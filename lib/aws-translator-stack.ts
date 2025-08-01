import {
	CfnOutput,
	RemovalPolicy,
	Stack,
	type StackProps,
	Tags,
} from "aws-cdk-lib";
import { AuthorizationType, LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { CfnBudget } from "aws-cdk-lib/aws-budgets";
import {
	AllowedMethods,
	CachePolicy,
	Distribution,
	OriginAccessIdentity,
	OriginProtocolPolicy,
	ResponseHeadersPolicy,
	ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { HttpOrigin, S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import type { Construct } from "constructs";
import { LANGUAGE_DETECTION_ROUTE } from "../constants/routeNames";

export class AwsTranslatorStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);
		// Tag all resources in this stack
		Tags.of(this).add("App", "aws-translator-app");

		// CloudFront Origin Access Identity for S3
		const oai = new OriginAccessIdentity(this, "FrontendOAI");

		// S3 bucket for static website hosting (private, accessed via CloudFront OAI)
		const websiteBucket = new Bucket(this, "FrontendBucket", {
			blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
			removalPolicy: RemovalPolicy.RETAIN,
			autoDeleteObjects: false,
		});
		// Enable static website hosting
		websiteBucket.grantRead(oai);

		// Lambda function for language detection (TypeScript, auto-bundled)
		const detectLanguageLambda = new NodejsFunction(
			this,
			"DetectLanguageHandler",
			{
				runtime: Runtime.NODEJS_22_X,
				entry: "lambda/detect-language.ts",
				handler: "handler",
				environment: {},
			},
		);
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

		// Modern CloudFront Distribution (S3 for frontend, API Gateway for /detect-language)
		const cloudFrontDist = new Distribution(this, "CloudFrontDist", {
			defaultBehavior: {
				origin: new S3Origin(websiteBucket, { originAccessIdentity: oai }),
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
			},
			defaultRootObject: "index.html",
			comment: "CloudFront for aws-translator: S3 frontend + API Gateway proxy",
		});

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
