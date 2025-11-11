#!/bin/bash
# AI Voice Agent Backend - Start Script

cd /Users/steen/ai-voice-agent/backend

echo "🚀 Starting AI Voice Agent Backend..."
echo ""
echo "Server will be available at:"
echo "  📡 API: http://localhost:3000/api"
echo "  💚 Health: http://localhost:3000/health"
echo ""
echo "Default login:"
echo "  📧 Email: admin@example.com"
echo "  🔑 Password: Admin123!"
echo ""
echo "Press Ctrl+C to stop the server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start server with proper environment
DATABASE_URL=postgresql://localhost:5432/aivoice node server.js
