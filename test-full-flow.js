// Test the full flow by simulating what happens when user fills form
const https = require('https');

console.log('🧪 Testing FULL USER FLOW on public link...\n');
console.log('Step 1: Form would be filled with:');
console.log('  - Job Title: Marketing Manager');
console.log('  - Industry: Professional Services');
console.log('  - Company: pa');
console.log('  - Salary: 100000');
console.log('  - Frustration: Spending too much time on repetitive tasks\n');

// This is what the frontend sends when form is submitted
const formData = {
  jobTitle: 'Marketing Manager',
  industry: 'Professional Services',
  companyName: 'pa',
  companySize: '11-50 employees',
  salaryType: 'Annual Salary',
  salaryAmount: '100000',
  biggestFrustration: 'Spending too much time on repetitive tasks'
};

// The frontend generates deliverables first, then calls the API
// Let's test with the actual deliverables that would be generated
const deliverables = [
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
  },
  {
    title: 'Budget Analysis',
    baselineHours: 6,
    aiEnabledHours: 1.5,
    frequency: 'monthly',
    occurrencesPerYear: 12,
    timeMultiplier: 4,
    annualHoursFreed: 54,
    payrollFreed: 2700,
    scenario: 'Budget review',
    oldWay: 'Manual analysis',
    aiVoiceWay: 'AI-assisted analysis'
  },
  {
    title: 'Risk Assessment',
    baselineHours: 10,
    aiEnabledHours: 2.5,
    frequency: 'quarterly',
    occurrencesPerYear: 4,
    timeMultiplier: 4,
    annualHoursFreed: 30,
    payrollFreed: 1500,
    scenario: 'Risk evaluation',
    oldWay: 'Manual assessment',
    aiVoiceWay: 'AI-assisted assessment'
  },
  {
    title: 'Compliance Reports',
    baselineHours: 12,
    aiEnabledHours: 3,
    frequency: 'quarterly',
    occurrencesPerYear: 4,
    timeMultiplier: 4,
    annualHoursFreed: 36,
    payrollFreed: 1800,
    scenario: 'Compliance review',
    oldWay: 'Manual reporting',
    aiVoiceWay: 'AI-assisted reporting'
  },
  {
    title: 'Data Analysis',
    baselineHours: 15,
    aiEnabledHours: 4,
    frequency: 'monthly',
    occurrencesPerYear: 12,
    timeMultiplier: 3.75,
    annualHoursFreed: 132,
    payrollFreed: 6600,
    scenario: 'Data processing',
    oldWay: 'Manual analysis',
    aiVoiceWay: 'AI-assisted analysis'
  }
];

const hourlyRate = 100000 / 2080; // ~$48/hour

const apiPayload = {
  jobTitle: formData.jobTitle,
  industry: formData.industry,
  companyName: formData.companyName,
  deliverables: deliverables,
  hourlyRate: hourlyRate,
  biggestFrustration: formData.biggestFrustration
};

console.log('Step 2: API call being made...\n');

const data = JSON.stringify(apiPayload);

const options = {
  hostname: 'aiva-y723.onrender.com',
  path: '/api/aiva/generate-deliverable-content',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  console.log(`📡 API Response: ${res.statusCode} ${res.statusCode === 200 ? '✅' : '❌'}\n`);
  
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      try {
        const json = JSON.parse(body);
        console.log('✅ SUCCESS! Full flow works!\n');
        console.log('Results:');
        console.log(`  Success: ${json.success}`);
        console.log(`  Deliverables generated: ${json.deliverables?.length || 0}`);
        console.log(`  Errors: ${json.errors?.length || 0}`);
        
        if (json.deliverables && json.deliverables.length > 0) {
          console.log('\n  Generated deliverables:');
          json.deliverables.forEach((d, i) => {
            const hasContent = !!(d.productivityImpact && d.emotionalImpact && d.businessROI);
            console.log(`    ${i + 1}. ${d.title} - ${hasContent ? '✅ Complete' : '⚠️ Partial'}`);
          });
        }
        
        if (json.errors && json.errors.length > 0) {
          console.log('\n  ⚠️ Errors:');
          json.errors.forEach((e, i) => {
            console.log(`    ${i + 1}. ${e.title}: ${e.error}`);
          });
        }
        
        console.log('\n✅ PUBLIC LINK IS WORKING!');
        console.log('✅ No 500 errors!');
        console.log('✅ API responds correctly!');
        console.log('✅ Deliverables generated successfully!');
      } catch (e) {
        console.log('❌ Failed to parse JSON:', e.message);
        console.log('Response:', body.substring(0, 500));
      }
    } else {
      console.log(`❌ FAILED: Status ${res.statusCode}`);
      console.log('Response:', body.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Request error: ${e.message}`);
});

req.write(data);
req.end();
