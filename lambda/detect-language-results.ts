import type { APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { LANGUAGE_DETECTION_TABLE_NAME } from "constants/cdkNames.js";

const dynamodb = new DynamoDB.DocumentClient();

export const handler = async (): Promise<APIGatewayProxyResult> => {
	try {
		// check the results for language detection in dynamoDB
		const results = await dynamodb
			.scan({ TableName: LANGUAGE_DETECTION_TABLE_NAME })
			.promise();
		// Count language codes using a Map and return sorted array
		if (results?.Items) {
			// Create a Map to count occurrences of each language code
			const counts = new Map<string, number>();
			// Iterate through the results and count each language code
			for (const item of results.Items) {
				const code = item.languageCode;
				counts.set(code, (counts.get(code) || 0) + 1);
			}
			// Convert the Map to an array of objects and sort by count in descending order
			const sortedArray = Array.from(counts.entries())
				.map(([code, count]) => ({ code, count }))
				.sort((a, b) => b.count - a.count);
			// Return the sorted array as JSON: [{ code: 'en', count: 10 }, { code: 'fr', count: 5 }, ...]
			return {
				statusCode: 200,
				body: JSON.stringify(sortedArray.slice(0, 5)), // Limit to top 5 languages
			};
		}
	} catch (err) {
		if (typeof err === "string") {
			return {
				statusCode: 500,
				body: JSON.stringify({ error: err }),
			};
		}
		if (err instanceof Error) {
			return {
				statusCode: 500,
				body: JSON.stringify({ error: err.message }),
			};
		}
	}
	return {
		statusCode: 500,
		body: JSON.stringify({ error: "Unknown error" }),
	};
};
