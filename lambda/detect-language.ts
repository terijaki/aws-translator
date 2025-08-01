import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Comprehend } from "aws-sdk";

export const handler = async (
	event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
	const body =
		typeof event.body === "string" ? JSON.parse(event.body) : event.body;
	const text = body?.text;
	if (!text) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: "Missing text" }),
		};
	}

	const comprehend = new Comprehend();
	try {
		const result = await comprehend
			.detectDominantLanguage({ Text: text })
			.promise();
		const langCode = result.Languages?.[0]?.LanguageCode;
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
