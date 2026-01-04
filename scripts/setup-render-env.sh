#!/bin/bash

# Render Environment Variables Setup Script
# This script helps you set environment variables in Render automatically
# 
# Prerequisites:
# 1. Install Render CLI: npm install -g render-cli
# 2. Login: render login
# 3. Get your API keys ready

set -e

echo "🚀 Render Environment Variables Setup"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if render CLI is installed
if ! command -v render &> /dev/null; then
    echo "❌ Render CLI not found. Installing..."
    npm install -g render-cli
fi

# Check if logged in
if ! render whoami &> /dev/null; then
    echo "⚠️  Not logged in to Render. Please run: render login"
    exit 1
fi

echo "✅ Render CLI found and authenticated"
echo ""

# Read API keys from local .env file if it exists
ENV_FILE="backend/.env"
if [ -f "$ENV_FILE" ]; then
    echo "📄 Found local .env file, reading API keys..."
    source "$ENV_FILE"
    
    ANTHROPIC_KEY="${ANTHROPIC_API_KEY}"
    OPENAI_KEY="${OPENAI_API_KEY}"
else
    echo "⚠️  No .env file found. Please enter API keys manually:"
    read -p "Enter Anthropic API Key: " ANTHROPIC_KEY
    read -p "Enter OpenAI API Key: " OPENAI_KEY
fi

# Get service names
read -p "Enter your Render Backend Service Name (e.g., aiva-backend): " BACKEND_SERVICE
read -p "Enter your Render Frontend Service Name (e.g., aiva-frontend): " FRONTEND_SERVICE

echo ""
echo "Setting environment variables for backend service: $BACKEND_SERVICE"
echo ""

# Set backend environment variables
render env:set ANTHROPIC_API_KEY="$ANTHROPIC_KEY" --service "$BACKEND_SERVICE"
render env:set OPENAI_API_KEY="$OPENAI_KEY" --service "$BACKEND_SERVICE"
render env:set NODE_ENV=production --service "$BACKEND_SERVICE"
render env:set PORT=10000 --service "$BACKEND_SERVICE"

# Generate secrets
SESSION_SECRET=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)

render env:set SESSION_SECRET="$SESSION_SECRET" --service "$BACKEND_SERVICE"
render env:set JWT_SECRET="$JWT_SECRET" --service "$BACKEND_SERVICE"

echo ""
echo "✅ Backend environment variables set!"
echo ""

# Get backend URL
echo "Getting backend URL..."
BACKEND_URL=$(render services:list --name "$BACKEND_SERVICE" --format json | jq -r '.[0].service.serviceDetails.url' 2>/dev/null || echo "")

if [ -z "$BACKEND_URL" ]; then
    read -p "Enter your Backend URL (e.g., https://aiva-backend.onrender.com): " BACKEND_URL
fi

echo ""
echo "Setting environment variables for frontend service: $FRONTEND_SERVICE"
echo ""

# Set frontend environment variables
render env:set VITE_API_URL="$BACKEND_URL" --service "$FRONTEND_SERVICE"

echo ""
echo "Getting frontend URL..."
FRONTEND_URL=$(render services:list --name "$FRONTEND_SERVICE" --format json | jq -r '.[0].service.serviceDetails.url' 2>/dev/null || echo "")

if [ -z "$FRONTEND_URL" ]; then
    read -p "Enter your Frontend URL (e.g., https://aiva-frontend.onrender.com): " FRONTEND_URL
fi

# Update backend CORS
echo ""
echo "Updating CORS_ORIGIN in backend..."
render env:set CORS_ORIGIN="$FRONTEND_URL" --service "$BACKEND_SERVICE"

echo ""
echo -e "${GREEN}✅ All environment variables configured!${NC}"
echo ""
echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""
echo "Your services will automatically redeploy with the new environment variables."

