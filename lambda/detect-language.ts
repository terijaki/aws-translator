import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Comprehend, DynamoDB } from "aws-sdk";
import { LANGUAGE_DETECTION_TABLE_NAME } from "constants/cdkNames.js";
import { v4 as uuidv4 } from "uuid";

const comprehend = new Comprehend();
const dynamodb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	// input validation
	const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
	const text = body?.text;
	if (!text) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: "Missing text" }),
		};
	}

	try {
		const result = await comprehend.detectDominantLanguage({ Text: text }).promise();
		const langCode = result.Languages?.[0]?.LanguageCode;

		// Write to DynamoDB if detection was successful
		if (langCode) {
			const item = {
				id: uuidv4(),
				text,
				languageCode: langCode,
				timestamp: new Date().toISOString(),
			};
			await dynamodb.put({ TableName: LANGUAGE_DETECTION_TABLE_NAME, Item: item }).promise();
		}

		return {
			statusCode: 200,
			body: JSON.stringify({ languageCode: langCode, text }),
		};
	} catch (err) {
		if (typeof err === "string") {
			return {
				statusCode: 500,
				body: JSON.stringify({ error: err, text }),
			};
		}
		if (err instanceof Error) {
			return {
				statusCode: 500,
				body: JSON.stringify({ error: err.message, text }),
			};
		}
		return {
			statusCode: 500,
			body: JSON.stringify({ error: "Unknown error", text }),
		};
	}
};
