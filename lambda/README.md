# Lambda Functions

This directory contains the AWS Lambda functions that power the language detection service backend.

## Overview

The Lambda functions are written in TypeScript and run on Node.js 22.x runtime. They are automatically bundled using esbuild during CDK deployment and integrate with various AWS services including Comprehend, DynamoDB, and API Gateway.

## Functions

### 1. detect-language.ts

**Purpose**: Main language detection endpoint that processes text input and returns detected language.

**Trigger**: API Gateway POST request to `/detect-language`

**Functionality**:
- Receives text input via API Gateway event
- Validates input parameters (requires `text` field)
- Calls AWS Comprehend `detectDominantLanguage` API
- Stores detection results in DynamoDB with metadata
- Returns detected language code and original text

**Input**:
```json
{
  "text": "Hello, how are you today?"
}
```

**Output**:
```json
{
  "languageCode": "en",
  "text": "Hello, how are you today?"
}
```

**DynamoDB Record**:
- `id`: UUID v4 identifier
- `text`: Original input text
- `languageCode`: Detected language code (e.g., 'en', 'fr', 'es')
- `timestamp`: ISO 8601 timestamp of detection

**Error Handling**:
- Returns 400 for missing text input
- Returns 500 for AWS service errors or unexpected exceptions
- Comprehensive error messages with original text context

### 2. detect-language-results.ts

**Purpose**: Analytics endpoint that provides language detection usage statistics.

**Trigger**: API Gateway GET request to `/detect-language-results`

**Functionality**:
- Scans the DynamoDB table for all language detection records
- Aggregates language codes by frequency
- Returns the top 5 most detected languages with counts
- Sorted by detection frequency (descending order)

**Input**: None (GET request)

**Output**:
```json
[
  { "code": "en", "count": 15 },
  { "code": "fr", "count": 8 },
  { "code": "es", "count": 5 },
  { "code": "de", "count": 3 },
  { "code": "it", "count": 1 }
]
```

**Performance Considerations**:
- Uses DynamoDB scan operation (suitable for small to medium datasets)
- Returns only top 5 results to limit response size
- In-memory aggregation using JavaScript Map for efficiency

**Error Handling**:
- Returns 500 for DynamoDB errors or unexpected exceptions
- Graceful handling of empty result sets

## Dependencies

### Runtime Dependencies
- **aws-sdk v2**: AWS service integration (Comprehend, DynamoDB)
- **uuid v9**: Unique identifier generation for DynamoDB records

### Development Dependencies
- **@types/aws-lambda**: TypeScript definitions for Lambda events and context
- **@types/uuid**: TypeScript definitions for UUID library

## Environment Variables

The Lambda functions access the following environment variables (set by CDK):

- `LANGUAGE_DETECTION_TABLE_NAME`: DynamoDB table name for storing detection results

## AWS Permissions

The Lambda functions are granted the following IAM permissions:

### detect-language function:
- `comprehend:DetectDominantLanguage`: To call AWS Comprehend service
- `dynamodb:PutItem`: To store detection results in DynamoDB
- `logs:CreateLogGroup`, `logs:CreateLogStream`, `logs:PutLogEvents`: CloudWatch logging

### detect-language-results function:
- `dynamodb:Scan`: To read all records from DynamoDB table
- `logs:CreateLogGroup`, `logs:CreateLogStream`, `logs:PutLogEvents`: CloudWatch logging

## Deployment

The Lambda functions are automatically deployed as part of the CDK stack:

```bash
npx cdk deploy
```

**Build Process**:
- TypeScript compilation handled by CDK NodejsFunction construct
- Automatic bundling with esbuild
- ES modules support with proper import/export syntax
- Source maps included for debugging

**Runtime Configuration**:
- Node.js 22.x runtime
- ARM64 architecture for better price/performance
- Memory: Default (128 MB, configurable)
- Timeout: Default (30 seconds, configurable)

## Monitoring

Lambda functions include:

- **CloudWatch Logs**: Automatic log collection with 30-day retention
- **CloudWatch Metrics**: Standard Lambda metrics (duration, errors, invocations)
- **CloudWatch Dashboard**: Custom dashboard with function-specific widgets
- **Error Tracking**: Structured error responses with proper HTTP status codes

## Local Development

For local development and testing:

1. Ensure AWS credentials are configured
2. Set environment variables:
   ```bash
   export LANGUAGE_DETECTION_TABLE_NAME=LanguageDetectionResults
   ```
3. Run TypeScript compilation to check syntax
4. Test against deployed AWS resources or use LocalStack for local AWS simulation

## Testing

The functions can be tested using:

- **AWS Console**: Test events in Lambda console
- **API Gateway Test**: Test through API Gateway console
- **Postman/curl**: HTTP requests to deployed endpoints
- **Frontend Application**: Integration testing through the React app

## Performance Characteristics

### detect-language function:
- **Cold Start**: ~200-500ms (includes AWS SDK initialization)
- **Warm Execution**: ~50-100ms
- **Comprehend API**: ~100-200ms latency
- **DynamoDB Write**: ~10-20ms

### detect-language-results function:
- **Cold Start**: ~200-400ms
- **Warm Execution**: ~20-50ms
- **DynamoDB Scan**: Variable based on table size (10-100ms for small tables)

## Scaling

- **Concurrency**: Default AWS Lambda scaling (1000 concurrent executions per region)
- **DynamoDB**: On-demand billing automatically scales with request volume
- **API Gateway**: Automatically scales with Lambda functions
- **Cost**: Pay-per-request model with no fixed costs
