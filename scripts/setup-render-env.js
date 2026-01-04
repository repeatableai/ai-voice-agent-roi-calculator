#!/usr/bin/env node

/**
 * Render Environment Variables Setup Script
 * 
 * This script uses Render's REST API to set environment variables automatically
 * 
 * Usage:
 *   1. Get your Render API key from: https://dashboard.render.com/account/api-keys
 *   2. Set RENDER_API_KEY environment variable or pass as argument
 *   3. Run: node scripts/setup-render-env.js
 * 
 * Or set RENDER_API_KEY in your environment:
 *   export RENDER_API_KEY=your-render-api-key
 *   node scripts/setup-render-env.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const RENDER_API_BASE = 'https://api.render.com/v1';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`API Error: ${res.statusCode} - ${parsed.message || body}`));
          }
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function getServices(apiKey) {
  log('📡 Fetching your Render services...', 'blue');
  
  const options = {
    hostname: 'api.render.com',
    path: '/v1/services',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json'
    }
  };

  return makeRequest(options);
}

async function setEnvVar(apiKey, serviceId, key, value) {
  const options = {
    hostname: 'api.render.com',
    path: `/v1/services/${serviceId}/env-vars`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  return makeRequest(options, { key, value });
}

function readEnvFile() {
  const envPath = path.join(__dirname, '..', 'backend', '.env');
  if (!fs.existsSync(envPath)) {
    return null;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });

  return envVars;
}

function question(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(query, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  log('🚀 Render Environment Variables Setup', 'green');
  log('======================================\n', 'green');

  // Get Render API key
  let apiKey = process.env.RENDER_API_KEY || process.argv[2];
  
  if (!apiKey) {
    log('⚠️  RENDER_API_KEY not found in environment or arguments', 'yellow');
    log('Get your API key from: https://dashboard.render.com/account/api-keys\n', 'yellow');
    apiKey = await question('Enter your Render API Key: ');
  }

  if (!apiKey) {
    log('❌ API key is required', 'red');
    process.exit(1);
  }

  // Read local .env file
  const localEnv = readEnvFile();
  if (localEnv) {
    log('✅ Found local .env file\n', 'green');
  }

  // Get services
  let services;
  try {
    services = await getServices(apiKey);
  } catch (error) {
    log(`❌ Error fetching services: ${error.message}`, 'red');
    process.exit(1);
  }

  if (!services || services.length === 0) {
    log('❌ No services found. Please create services in Render first.', 'red');
    process.exit(1);
  }

  log(`\n📋 Found ${services.length} service(s):\n`, 'blue');
  services.forEach((service, index) => {
    log(`  ${index + 1}. ${service.service.name} (${service.service.type})`, 'blue');
  });

  // Find backend and frontend services
  const backendService = services.find(s => 
    s.service.name.includes('backend') || 
    s.service.name.includes('api') ||
    s.service.type === 'web'
  );

  const frontendService = services.find(s => 
    s.service.name.includes('frontend') || 
    s.service.name.includes('static') ||
    s.service.type === 'static_site'
  );

  if (!backendService) {
    log('\n❌ Backend service not found. Please create it first.', 'red');
    process.exit(1);
  }

  log(`\n✅ Using backend service: ${backendService.service.name}`, 'green');
  
  if (frontendService) {
    log(`✅ Using frontend service: ${frontendService.service.name}\n`, 'green');
  }

  // Set backend environment variables
  log('\n🔧 Setting backend environment variables...\n', 'blue');
  
  const backendEnvVars = {
    NODE_ENV: 'production',
    PORT: '10000',
    ANTHROPIC_API_KEY: localEnv?.ANTHROPIC_API_KEY || await question('Enter Anthropic API Key: '),
    OPENAI_API_KEY: localEnv?.OPENAI_API_KEY || await question('Enter OpenAI API Key: '),
    SESSION_SECRET: require('crypto').randomBytes(32).toString('base64'),
    JWT_SECRET: require('crypto').randomBytes(32).toString('base64')
  };

  for (const [key, value] of Object.entries(backendEnvVars)) {
    try {
      await setEnvVar(apiKey, backendService.service.id, key, value);
      log(`  ✅ Set ${key}`, 'green');
    } catch (error) {
      log(`  ⚠️  ${key}: ${error.message}`, 'yellow');
    }
  }

  // Get backend URL
  const backendUrl = backendService.service.serviceDetails?.url || 
    await question('\nEnter your Backend URL: ');

  // Set frontend environment variables
  if (frontendService) {
    log(`\n🔧 Setting frontend environment variables...\n`, 'blue');
    
    try {
      await setEnvVar(apiKey, frontendService.service.id, 'VITE_API_URL', backendUrl);
      log(`  ✅ Set VITE_API_URL = ${backendUrl}`, 'green');
    } catch (error) {
      log(`  ⚠️  VITE_API_URL: ${error.message}`, 'yellow');
    }

    // Update CORS
    const frontendUrl = frontendService.service.serviceDetails?.url ||
      await question('\nEnter your Frontend URL: ');

    try {
      await setEnvVar(apiKey, backendService.service.id, 'CORS_ORIGIN', frontendUrl);
      log(`  ✅ Set CORS_ORIGIN = ${frontendUrl}`, 'green');
    } catch (error) {
      log(`  ⚠️  CORS_ORIGIN: ${error.message}`, 'yellow');
    }
  }

  log('\n✅ Environment variables configured successfully!', 'green');
  log('\nYour services will automatically redeploy with the new variables.\n', 'green');
}

main().catch(error => {
  log(`\n❌ Error: ${error.message}`, 'red');
  process.exit(1);
});

