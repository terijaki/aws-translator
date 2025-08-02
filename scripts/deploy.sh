# Stop script on any error
set -e

bun install

# 1. Lint and auto-fix code using Biome
bun biome check --write

# 2. Build the React frontend (in /frontend)
bun run --cwd frontend build

# 3. Deploy the CDK stack (provisions AWS resources and uploads frontend)
bunx cdk deploy --outputs-file cdk-outputs.json

# 4. Verify DNS configuration for CloudFront domain
# Read domain name from constants file
DOMAIN_NAME=$(grep -o 'DOMAIN_NAME = "[^"]*"' constants/cdkNames.ts | cut -d'"' -f2)

# Get the CloudFront distribution domain from CDK outputs
CLOUDFRONT_DOMAIN=$(cat cdk-outputs.json | grep -o '"CloudFrontURL": "[^"]*"' | cut -d'"' -f4 | sed 's|https://||')

if [ -n "$CLOUDFRONT_DOMAIN" ]; then
    # Check DNS configuration
    CNAME_RECORD=$(dig +short CNAME $DOMAIN_NAME)
    
    if [ -n "$CNAME_RECORD" ] && echo "$CNAME_RECORD" | grep -q "cloudfront.net"; then
        echo "✅ DNS correctly configured for $DOMAIN_NAME"
    else
        echo "❌ DNS not configured correctly for $DOMAIN_NAME"
        echo "   Please create a CNAME record pointing to: $CLOUDFRONT_DOMAIN"
    fi
else
    echo "⚠️  Could not extract CloudFront domain from CDK outputs"
fi