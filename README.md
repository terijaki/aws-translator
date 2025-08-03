# AWS Translator

A serverless language detection web service built with AWS CDK, featuring a React frontend and AWS Lambda backend with analytics capabilities.

## Overview

This project deploys a complete serverless architecture for language detection using AWS Comprehend, with a modern React frontend, API Gateway, Lambda functions, and DynamoDB storage. The service is hosted on a custom domain with CloudFront distribution for optimal performance and security.

## Architecture

The application consists of the following components:

- **Frontend**: React single-page application built with Vite
- **Backend**: AWS Lambda functions for language detection and analytics
- **Storage**: DynamoDB table for persisting detection results
- **API**: API Gateway REST endpoints
- **CDN**: CloudFront distribution with custom domain
- **Monitoring**: CloudWatch Dashboard with Lambda metrics
- **Cost Management**: AWS Budget alerts

## Technology Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- TanStack Query for API state management
- TanStack Form for form handling
- Tailwind CSS for styling
- shadcn/ui component library
- Lucide React for icons
- Sonner for toast notifications
- Recharts for data visualization

### Backend
- AWS CDK (TypeScript) for infrastructure as code
- AWS Lambda runtime
- AWS SDK for AWS service integration
- AWS Comprehend for language detection
- DynamoDB for data persistence
- API Gateway for REST API endpoints
- CloudFront for content delivery and API routing

## Project Structure

```
aws-translator/
├── bin/                    # CDK app entry point
├── lib/                    # CDK stack definitions
├── lambda/                 # Lambda function source code
├── frontend/               # React application
├── constants/              # Shared constants and configuration
├── scripts/                # Deployment and utility scripts
└── cdk.out/               # CDK synthesized templates (auto-generated)
```

## Prerequisites

- Node.js (latest LTS version recommended)
- Bun package manager
- AWS CLI configured with appropriate permissions
- AWS CDK v2 installed globally (`npm install -g aws-cdk`)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd aws-translator
```

2. Install dependencies:
```bash
bun install
cd frontend && bun install
```

## Development

### Frontend Development
Run the frontend development server:
```bash
cd frontend
bun run dev
```

### Build Frontend
Build the frontend for production:
```bash
cd frontend
bun run build
```

### Deploy to AWS
Deploy the entire stack to AWS:
```bash
npx cdk deploy
```

Or use the convenience script:
```bash
bun run deploy
```

## API Endpoints

The service exposes the following REST API endpoints:

- `POST /detect-language` - Detect the language of provided text
- `GET /detect-language-results` - Get analytics on language detection usage

## Environment Variables

The application uses the following environment variables in Lambda functions:

- `LANGUAGE_DETECTION_TABLE_NAME` - DynamoDB table name for storing results

## Monitoring

The application includes:

- CloudWatch Dashboard for monitoring Lambda metrics
- CloudWatch log retention for cost optimization
- AWS Budget alerts for cost monitoring

## Cost Optimization

- DynamoDB uses on-demand billing
- Lambda functions use ARM64 architecture for better price/performance
- CloudWatch logs have configurable retention policy
- S3 bucket uses intelligent tiering where applicable

## Security

- S3 bucket is private with CloudFront Origin Access Identity
- IAM permissions follow least-privilege principle
- All traffic served over HTTPS via CloudFront

## Domain Configuration

The application is configured to use a custom domain with:
- SSL certificate managed by AWS Certificate Manager
- CloudFront distribution for global content delivery
- Custom origin for API Gateway integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally and ensure the build passes
5. Submit a pull request

## License

This project is private and proprietary.

## Support

For questions or issues, please contact the development team or create an issue in the repository.
