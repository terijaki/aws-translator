# Copilot Instructions for aws-translator

## Project Overview
- This project is an AWS CDK (TypeScript) application that deploys a serverless language detection web service.
- The stack provisions:
  - An S3 bucket for static website hosting (serves a React frontend from `/frontend`)
  - An AWS Lambda function (TypeScript, in `/lambda/detect-language.ts`) for language detection using AWS Comprehend
  - An API Gateway REST endpoint to invoke the Lambda
  - IAM permissions for least-privilege Lambda execution
  - Automatic deployment of frontend assets and a generated `config.json` (with API URL) to S3

## Architecture & Data Flow
- User accesses the React app (hosted on S3 static website)
- React app POSTs text to `/detect-language` endpoint on API Gateway
- API Gateway triggers Lambda, which calls AWS Comprehend to detect language
- Lambda returns detected language code to frontend
- The API URL is injected into the frontend at deploy time via `config.json`

## Key Files & Patterns
- `lib/aws-translator-stack.ts`: Main CDK stack. All AWS resources are defined here. Writes `frontend/config.json` with the API URL before deploying assets to S3.
- `lambda/detect-language.ts`: Lambda handler. Uses AWS SDK's Comprehend client. Handles errors robustly, always returns JSON.
- `frontend/app.js`: React SPA. Loads API URL from `config.json` at runtime. All API calls use this dynamic URL.
- `tsconfig.json`: Ensure `ES2015` is in `lib` for Promise/async support.

## Developer Workflows
- **Install dependencies:** `bun install`
- **Build & Deploy:** `npx cdk deploy` (writes config.json, deploys Lambda/API/S3/frontend)
- **Update frontend API URL:** No manual step; CDK writes `frontend/config.json` automatically
- **Local frontend dev:** Use a local server and manually create a `config.json` with the dev API URL if needed
- **Logs/Debug:** Use AWS CloudWatch for Lambda logs

## Project Conventions
- Use ES module imports (not require) in TypeScript
- Do not use require; always use import statements for all modules and types
- All infrastructure is defined in a single CDK stack
- No hardcoded API URLs in frontend; always use config.json
- IAM permissions are least-privilege, only what Lambda needs
- S3 bucket is public for static website, but auto-deletion is disabled in production

## Integration Points
- AWS Comprehend (language detection)
- API Gateway (REST, no auth)
- S3 (static website hosting)
- Lambda (Node.js 18.x, TypeScript, auto-bundled)

## Examples
- See `lib/aws-translator-stack.ts` for how config.json is generated and deployed
- See `frontend/app.js` for dynamic config loading pattern
- See `lambda/detect-language.ts` for Lambda error handling and AWS SDK usage

---
If any conventions or workflows are unclear, please ask for clarification or examples from the codebase.
