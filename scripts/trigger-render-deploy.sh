#!/bin/bash
# Script to trigger Render deployment with cache clear
# Requires RENDER_API_KEY environment variable

set -e

SERVICE_NAME="aiva"
RENDER_API_BASE="https://api.render.com/v1"

if [ -z "$RENDER_API_KEY" ]; then
  echo "❌ RENDER_API_KEY not set"
  echo "Get your API key from: https://dashboard.render.com/account/api-keys"
  echo ""
  echo "Usage:"
  echo "  export RENDER_API_KEY=your-api-key"
  echo "  ./scripts/trigger-render-deploy.sh"
  exit 1
fi

echo "🔍 Finding service: $SERVICE_NAME..."

# Get service ID
SERVICE_RESPONSE=$(curl -s -X GET \
  "$RENDER_API_BASE/services" \
  -H "Authorization: Bearer $RENDER_API_KEY")

SERVICE_ID=$(echo $SERVICE_RESPONSE | grep -o "\"id\":\"[^\"]*\",\"name\":\"$SERVICE_NAME\"" | grep -o "\"id\":\"[^\"]*\"" | cut -d'"' -f4)

if [ -z "$SERVICE_ID" ]; then
  echo "❌ Service '$SERVICE_NAME' not found"
  echo "Available services:"
  echo $SERVICE_RESPONSE | grep -o "\"name\":\"[^\"]*\"" | cut -d'"' -f4
  exit 1
fi

echo "✅ Found service ID: $SERVICE_ID"
echo "🚀 Triggering deployment with cache clear..."

# Trigger deployment
DEPLOY_RESPONSE=$(curl -s -X POST \
  "$RENDER_API_BASE/services/$SERVICE_ID/deploys" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "clearBuildCache": true
  }')

DEPLOY_ID=$(echo $DEPLOY_RESPONSE | grep -o "\"id\":\"[^\"]*\"" | head -1 | cut -d'"' -f4)

if [ -z "$DEPLOY_ID" ]; then
  echo "❌ Failed to trigger deployment"
  echo "Response: $DEPLOY_RESPONSE"
  exit 1
fi

echo "✅ Deployment triggered successfully!"
echo "📋 Deploy ID: $DEPLOY_ID"
echo ""
echo "Monitor deployment at: https://dashboard.render.com/web/$SERVICE_ID/deploys/$DEPLOY_ID"
echo ""
echo "⏳ Waiting for deployment to complete (this may take 2-5 minutes)..."
