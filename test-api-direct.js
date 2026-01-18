const https = require('https');

const data = JSON.stringify({
  jobTitle: 'Marketing Manager',
  industry: 'Professional Services',
  companyName: 'pa',
  deliverables: [
    {
      title: 'Monthly Financial Reports',
      baselineHours: 8,
      aiEnabledHours: 2,
      frequency: 'monthly',
      occurrencesPerYear: 12,
      timeMultiplier: 4,
      annualHoursFreed: 72,
      payrollFreed: 3600,
      scenario: 'Monthly reporting',
      oldWay: 'Manual process',
      aiVoiceWay: 'AI-assisted process'
    }
  ],
  hourlyRate: 50,
  biggestFrustration: 'Spending too much time on repetitive tasks'
});

const options = {
  hostname: 'aiva-y723.onrender.com',
  path: '/api/aiva/generate-deliverable-content',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('🚀 Testing API with REAL data...\n');

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      try {
        const json = JSON.parse(body);
        console.log('\n✅ SUCCESS! Response received:');
        console.log(`   Success: ${json.success}`);
        console.log(`   Deliverables: ${json.deliverables?.length || 0}`);
        if (json.deliverables && json.deliverables.length > 0) {
          console.log(`   First deliverable: "${json.deliverables[0].title}"`);
          console.log(`   Has productivityImpact: ${!!json.deliverables[0].productivityImpact}`);
          console.log(`   Has emotionalImpact: ${!!json.deliverables[0].emotionalImpact}`);
          console.log(`   Has businessROI: ${!!json.deliverables[0].businessROI}`);
        }
        if (json.errors) {
          console.log(`   Errors: ${json.errors.length}`);
        }
        console.log('\n✅ PROOF: API is working! No 500 errors!');
      } catch (e) {
        console.log('❌ Failed to parse JSON:', e.message);
        console.log('Response:', body.substring(0, 500));
      }
    } else {
      console.log(`\n❌ FAILED: Status ${res.statusCode}`);
      console.log('Response:', body.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Request error: ${e.message}`);
});

req.write(data);
req.end();
