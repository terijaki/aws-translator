import * as cdk from "aws-cdk-lib";
import "source-map-support";
import { AwsTranslatorStack } from "../lib/aws-translator-stack";

const app = new cdk.App();
new AwsTranslatorStack(app, "AwsTranslatorStack", {
	env: {
		region: "us-east-1",
	},
});
