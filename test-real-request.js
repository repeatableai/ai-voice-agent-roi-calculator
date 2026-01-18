const fetch = require('node-fetch');

async function testRealRequest() {
  const url = 'https://aiva-y723.onrender.com/api/aiva/generate-deliverable-content';
  
  // Exact payload from user's error
  const payload = {
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
    ],
    hourlyRate: 50,
    biggestFrustration: 'Spending too much time on repetitive tasks'
  };

  console.log('Testing with exact user payload...');
  console.log('Payload:', JSON.stringify(payload, null, 2));
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      timeout: 120000
    });

    console.log('\nResponse Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('\nResponse Body:', text.substring(0, 1000));
    
    if (response.status !== 200) {
      try {
        const json = JSON.parse(text);
        console.log('\nParsed Error:', JSON.stringify(json, null, 2));
      } catch (e) {
        console.log('\nCould not parse as JSON');
      }
    }
  } catch (error) {
    console.error('\nRequest failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testRealRequest();
