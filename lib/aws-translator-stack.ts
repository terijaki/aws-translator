import {
	CfnOutput,
	Duration,
	RemovalPolicy,
	Stack,
	type StackProps,
	Tags,
} from "aws-cdk-lib";
import {
	AuthorizationType,
	LambdaIntegration,
	LambdaRestApi,
} from "aws-cdk-lib/aws-apigateway";
import { CfnBudget } from "aws-cdk-lib/aws-budgets";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import {
	AllowedMethods,
	CachePolicy,
	Distribution,
	OriginAccessIdentity,
	OriginProtocolPolicy,
	ResponseHeadersPolicy,
	ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import {
	HttpOrigin,
	S3StaticWebsiteOrigin,
} from "aws-cdk-lib/aws-cloudfront-origins";
import { Dashboard, GraphWidget, Metric } from "aws-cdk-lib/aws-cloudwatch";
import { AttributeType, Billing, TableV2 } from "aws-cdk-lib/aws-dynamodb";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LogRetention, RetentionDays } from "aws-cdk-lib/aws-logs";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import type { Construct } from "constructs";
import {
	LANGUAGE_DETECTION_RESULTS_ROUTE,
	LANGUAGE_DETECTION_ROUTE,
	LANGUAGE_DETECTION_TABLE_NAME,
} from "../constants/cdkNames";

export class AwsTranslatorStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);
		// Tag all resources in this stack
		Tags.of(this).add("App", "aws-translator-app");

		// CloudFront Origin Access Identity for S3
		const originAccessIdentityS3 = new OriginAccessIdentity(
			this,
			"FrontendOAI",
		);

		// S3 bucket for static website hosting (private, accessed via CloudFront OAI)
		const websiteBucket = new Bucket(this, "FrontendBucket", {
			websiteIndexDocument: "index.html",
			publicReadAccess: true,
			blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS_ONLY,
			removalPolicy: RemovalPolicy.RETAIN,
			autoDeleteObjects: false,
		});
		// Enable static website hosting
		websiteBucket.grantRead(originAccessIdentityS3);

		// DynamoDB Table to store language detection results
		const languageDetectionTable = new TableV2(
			this,
			LANGUAGE_DETECTION_TABLE_NAME,
			{
				tableName: "LanguageDetectionResults",
				partitionKey: { name: "id", type: AttributeType.STRING },
				removalPolicy: RemovalPolicy.DESTROY,
				billing: Billing.onDemand(),
			},
		);

		// Lambda function for language detection (TypeScript, auto-bundled)
		const detectLanguageLambda = new NodejsFunction(
			this,
			"DetectLanguageHandler",
			{
				runtime: Runtime.NODEJS_22_X,
				entry: "lambda/detect-language.ts",
				handler: "handler",
				bundling: {
					externalModules: [], // node_modules to exclude from bundling (keep empty to bundle all)
				},
			},
		);
		// Set log retention for detectLanguageLambda (e.g., 30 days)
		new LogRetention(this, "DetectLanguageLogRetention", {
			logGroupName: `/aws/lambda/${detectLanguageLambda.functionName}`,
			retention: RetentionDays.ONE_MONTH,
		});
		// Grant Lambda permission to write to DynamoDB
		languageDetectionTable.grantWriteData(detectLanguageLambda);
		// Grant Lambda permission to use Comprehend
		detectLanguageLambda.addToRolePolicy(
			new PolicyStatement({
				actions: ["comprehend:DetectDominantLanguage"],
				resources: ["*"],
			}),
		);

		// API Gateway to expose Lambda
		const api = new LambdaRestApi(this, "Endpoint", {
			handler: detectLanguageLambda,
			proxy: false,
			defaultMethodOptions: {
				authorizationType: AuthorizationType.NONE,
			},
			deployOptions: {
				stageName: "prod",
			},
			restApiName: "LanguageDetectApi",
			description: "API for language detection using AWS Comprehend",
		});

		// Add CORS support to the API Gateway resource
		const detectResource = api.root.addResource(LANGUAGE_DETECTION_ROUTE);
		detectResource.addMethod("POST");

		// Lambda function to get language detection results
		const getLanguageResultsLambda = new NodejsFunction(
			this,
			"GetLanguageResultsHandler",
			{
				runtime: Runtime.NODEJS_22_X,
				entry: "lambda/detect-language-results.ts",
				handler: "handler",
				bundling: {
					externalModules: [], // node_modules to exclude from bundling (keep empty to bundle all)
				},
			},
		);
		// Set log retention for getLanguageResultsLambda (e.g., 30 days)
		new LogRetention(this, "GetLanguageResultsLogRetention", {
			logGroupName: `/aws/lambda/${getLanguageResultsLambda.functionName}`,
			retention: RetentionDays.ONE_MONTH,
		});
		// Grant Lambda permission to read from DynamoDB
		languageDetectionTable.grantReadData(getLanguageResultsLambda);
		// Add a new resource for getting language results
		const getResultsResource = api.root.addResource(
			LANGUAGE_DETECTION_RESULTS_ROUTE,
		);
		getResultsResource.addMethod(
			"GET",
			new LambdaIntegration(getLanguageResultsLambda),
		);

		// Import ACM certificate for lang.terijaki.eu (must be in us-east-1 for CloudFront)
		const certificate = Certificate.fromCertificateArn(
			this,
			"LangTerijakiEuCert",
			"arn:aws:acm:us-east-1:090814024092:certificate/738358d6-36ef-4746-8790-56977529fdf3",
		);

		// Modern CloudFront Distribution (S3 for frontend, API Gateway for /detect-language)
		const cloudFrontDist = new Distribution(this, "CloudFrontDist", {
			defaultRootObject: "index.html",
			comment: "CloudFront for aws-translator: S3 frontend + API Gateway proxy",
			domainNames: ["lang.terijaki.eu"],
			certificate,
			defaultBehavior: {
				origin: new S3StaticWebsiteOrigin(websiteBucket, {
					originId: originAccessIdentityS3.originAccessIdentityId,
				}),
				allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
				viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				compress: true,
				cachePolicy: CachePolicy.CACHING_OPTIMIZED,
				responseHeadersPolicy:
					ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT,
			},
			additionalBehaviors: {
				[`/${LANGUAGE_DETECTION_ROUTE}`]: {
					origin: new HttpOrigin(
						`${api.restApiId}.execute-api.${this.region}.amazonaws.com`,
						{
							originPath: "/prod",
							protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
						},
					),
					allowedMethods: AllowedMethods.ALLOW_ALL,
					cachePolicy: CachePolicy.CACHING_DISABLED,
					viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				},
				[`/${LANGUAGE_DETECTION_RESULTS_ROUTE}`]: {
					origin: new HttpOrigin(
						`${api.restApiId}.execute-api.${this.region}.amazonaws.com`,
						{
							originPath: "/prod",
							protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
						},
					),
					allowedMethods: AllowedMethods.ALLOW_ALL,
					cachePolicy: CachePolicy.CACHING_DISABLED,
					viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				},
			},
		});

		// CloudWatch Dashboard for Lambda metrics
		const dashboard = new Dashboard(this, "AwsTranslatorDashboard", {
			dashboardName: "AwsTranslatorDashboard",
		});
		dashboard.addWidgets(
			new GraphWidget({
				title: "DetectLanguage Lambda Invocations",
				left: [
					new Metric({
						namespace: "AWS/Lambda",
						metricName: "Invocations",
						dimensionsMap: {
							FunctionName: detectLanguageLambda.functionName,
						},
						statistic: "Sum",
						period: Duration.minutes(5),
					}),
				],
			}),
			new GraphWidget({
				title: "DetectLanguage Lambda Errors",
				left: [
					new Metric({
						namespace: "AWS/Lambda",
						metricName: "Errors",
						dimensionsMap: {
							FunctionName: detectLanguageLambda.functionName,
						},
						statistic: "Sum",
						period: Duration.minutes(5),
					}),
				],
			}),
			new GraphWidget({
				title: "GetLanguageResults Lambda Invocations",
				left: [
					new Metric({
						namespace: "AWS/Lambda",
						metricName: "Invocations",
						dimensionsMap: {
							FunctionName: getLanguageResultsLambda.functionName,
						},
						statistic: "Sum",
						period: Duration.minutes(5),
					}),
				],
			}),
			new GraphWidget({
				title: "GetLanguageResults Lambda Errors",
				left: [
					new Metric({
						namespace: "AWS/Lambda",
						metricName: "Errors",
						dimensionsMap: {
							FunctionName: getLanguageResultsLambda.functionName,
						},
						statistic: "Sum",
						period: Duration.minutes(5),
					}),
				],
			}),
		);

		// Output the CloudFront URL
		new CfnOutput(this, "CloudFrontURL", {
			value: `https://${cloudFrontDist.domainName}`,
			description: "CloudFront distribution URL (frontend + API)",
		});

		// Deploy frontend build output to S3
		new BucketDeployment(this, "DeployFrontend", {
			sources: [Source.asset("frontend/dist")],
			destinationBucket: websiteBucket,
		});

		// AWS Budget: 30 EUR/month, notify at 10 and 20 EUR
		new CfnBudget(this, "MonthlyBudget", {
			budget: {
				budgetType: "COST",
				timeUnit: "MONTHLY",
				budgetLimit: {
					amount: 30,
					unit: "USD",
				},
				costFilters: {},
			},
			notificationsWithSubscribers: [
				{
					notification: {
						notificationType: "ACTUAL",
						comparisonOperator: "GREATER_THAN",
						threshold: 10,
						thresholdType: "ABSOLUTE_VALUE",
					},
					subscribers: [
						{
							subscriptionType: "EMAIL",
							address: "fridges.hamachi2i@icloud.com",
						},
					],
				},
				{
					notification: {
						notificationType: "ACTUAL",
						comparisonOperator: "GREATER_THAN",
						threshold: 20,
						thresholdType: "ABSOLUTE_VALUE",
					},
					subscribers: [
						{
							subscriptionType: "EMAIL",
							address: "fridges.hamachi2i@icloud.com",
						},
					],
				},
			],
		});
	}
}
