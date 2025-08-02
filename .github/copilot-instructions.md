# Copilot Instructions for aws-translator

## Project Overview
- This project is an AWS CDK (TypeScript) application that deploys a serverless language detection web service with analytics.
- The stack provisions:
  - A private S3 bucket for hosting React frontend (served via CloudFront OAI)
  - AWS Lambda functions (TypeScript, Node.js 22.x) for language detection and results retrieval
  - DynamoDB table for storing language detection results and analytics
  - API Gateway REST endpoints to invoke the Lambdas
  - CloudFront distribution with custom domain (lang.terijaki.eu) for frontend + API
  - CloudWatch Dashboard for monitoring Lambda metrics
  - AWS Budget alerts for cost monitoring
  - IAM permissions for least-privilege Lambda execution

## Architecture & Data Flow
- User accesses the React app via CloudFront distribution (lang.terijaki.eu)
- React app POSTs text to `/detect-language` endpoint via CloudFront
- CloudFront routes API calls to API Gateway, which triggers Lambda functions
- Language detection Lambda calls AWS Comprehend and stores results in DynamoDB
- Results Lambda scans DynamoDB to provide language analytics
- All components are monitored via CloudWatch Dashboard

## Key Files & Patterns
- `lib/aws-translator-stack.ts`: Main CDK stack. All AWS resources defined here. Uses CloudFront for distribution.
- `lambda/detect-language.ts`: Primary Lambda handler. Uses AWS Comprehend and stores results in DynamoDB.
- `lambda/detect-language-results.ts`: Analytics Lambda. Scans DynamoDB and returns language usage statistics.
- `frontend/app.tsx`: React SPA built with Vite. Uses TanStack Query, Tailwind CSS, and shadcn/ui components.
- `constants/cdkNames.ts`: Shared constants for API routes and resource names between CDK and frontend.
- `tsconfig.json`: Ensure `ES2015` is in `lib` for Promise/async support.

## Developer Workflows
- **Install dependencies:** `bun install` (root) and `cd frontend && bun install` (frontend)
- **Frontend dev:** `cd frontend && bun run dev` (Vite dev server)
- **Frontend build:** `cd frontend && bun run build` (outputs to `frontend/dist/`)
- **Deploy:** `npx cdk deploy` (deploys Lambda, API, DynamoDB, CloudFront, and frontend assets)
- **Logs/Debug:** Use AWS CloudWatch for Lambda logs and CloudWatch Dashboard for metrics
- **Local testing:** Frontend dev server can proxy API calls to deployed endpoints

## Project Conventions
- Use ES module imports (not require) in TypeScript
- Do not use require; always use import statements for all modules and types
- All infrastructure is defined in a single CDK stack
- No hardcoded API URLs in frontend; uses relative paths via CloudFront
- IAM permissions are least-privilege, only what Lambda needs
- S3 bucket is private, accessed only via CloudFront Origin Access Identity
- DynamoDB uses on-demand billing for cost optimization
- CloudWatch log retention set to 30 days for cost management

## Integration Points
- AWS Comprehend (language detection)
- API Gateway (REST, no auth, CORS enabled)
- CloudFront (custom domain, SSL certificate, API + static content)
- S3 (private bucket with OAI for static website hosting)
- DynamoDB (language detection results storage)
- Lambda (Node.js 22.x, TypeScript, auto-bundled with esbuild)
- CloudWatch (monitoring, dashboards, log retention)
- AWS Budgets (cost alerts)

## Technology Stack
### Frontend
- React 19 with TypeScript
- Vite for build tooling
- TanStack Query for API state management
- TanStack Form for form handling
- Tailwind CSS 4 for styling
- shadcn/ui component library
- Lucide React for icons
- Sonner for toast notifications
- Recharts for data visualization

### Backend
- AWS CDK (TypeScript)
- AWS Lambda (Node.js 22.x)
- AWS SDK v2 (Comprehend, DynamoDB)
- UUID for unique identifiers

## Examples
- See `lib/aws-translator-stack.ts` for CloudFront distribution with custom domain setup
- See `frontend/app.tsx` for TanStack Query integration and modern React patterns
- See `lambda/detect-language.ts` for Lambda error handling and AWS SDK usage with DynamoDB
- See `lambda/detect-language-results.ts` for DynamoDB scanning and data aggregation

---
If any conventions or workflows are unclear, please ask for clarification or examples from the codebase.

## Recent Updates & Notes
- Upgraded to Node.js 22.x runtime for Lambda functions
- Frontend now uses React 19 and modern Vite tooling
- CloudFront distribution replaces direct S3 static website hosting
- Added DynamoDB for persistent storage of language detection results
- Implemented analytics endpoint for language usage statistics
- Added comprehensive monitoring with CloudWatch Dashboard
- Cost optimization with AWS Budgets and log retention policies
- Uses private S3 bucket with CloudFront Origin Access Identity for security
