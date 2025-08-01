# Stop script on any error
set -e

bun install

# 1. Lint and auto-fix code using Biome
bun biome check --write

# 2. Build the React frontend (in /frontend)
bun run --cwd frontend build

# 3. Deploy the CDK stack (provisions AWS resources and uploads frontend)
bunx cdk deploy 