/**
 * Anthropic Claude AI Service
 * Real AI-powered service generation with internet research and SPIN selling methodology
 */

import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true // Required for client-side usage
});

/**
 * Generate 10 AI-powered services with SPIN scripts for a company
 * @param {Object} params - Company parameters
 * @returns {Promise<Array>} - Array of 10 service objects with SPIN scripts
 */
export async function generateServicesWithAI({
  companyName,
  websiteUrl,
  industry,
  customIndustry,
  businessType,
  companySize
}) {
  const displayIndustry = industry === 'other' ? customIndustry : industry;

  console.log('🤖 [ANTHROPIC] Starting AI service generation...');
  console.log('📊 [ANTHROPIC] Parameters:', {
    companyName,
    industry: displayIndustry,
    businessType,
    companySize
  });

  try {
    const prompt = buildServiceGenerationPrompt({
      companyName,
      websiteUrl,
      industry: displayIndustry,
      businessType,
      companySize
    });

    console.log('💭 [ANTHROPIC] Sending prompt to Claude...');

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 8000,
      temperature: 0.7,
      messages: [{
        role: "user",
        content: prompt
      }]
    });

    console.log('✅ [ANTHROPIC] Received response from Claude');

    // Extract JSON from response
    const responseText = message.content[0].text;
    console.log('📝 [ANTHROPIC] Response length:', responseText.length);

    // Parse the JSON response
    const services = parseServicesFromResponse(responseText);

    console.log(`✨ [ANTHROPIC] Successfully generated ${services.length} services`);
    return services;

  } catch (error) {
    console.error('❌ [ANTHROPIC] Error:', error);
    throw error;
  }
}

/**
 * Build the comprehensive prompt for Claude
 */
function buildServiceGenerationPrompt({
  companyName,
  websiteUrl,
  industry,
  businessType,
  companySize
}) {
  return `You are an expert field service sales consultant and business strategist. Your task is to generate 10 high-quality, profitable upsell services for a company.

**COMPANY INFORMATION:**
- Company Name: ${companyName}
- Industry: ${industry}
- Website: ${websiteUrl}
- Business Type: ${businessType === 'both' ? 'Both Residential and Commercial' : businessType === 'residential' ? 'Residential Only' : 'Commercial Only'}
- Company Size: ${companySize} employees

**YOUR TASK:**

Research and generate the TOP 10 most profitable and commonly successful upsell/add-on services for this specific industry. Base your recommendations on:

1. **Market Research**: What are the most successful upsells in this industry?
2. **Customer Psychology**: What do customers in this industry actually need and buy?
3. **Profit Margins**: Focus on high-margin, easy-to-sell services
4. **Trigger Events**: When is the perfect time to offer each service?
5. **SPIN Selling Method**: Create scripts that follow Situation → Problem → Implication → Need-Payoff

**OUTPUT FORMAT:**

Return ONLY a valid JSON array with exactly 10 service objects. Each service MUST have this exact structure:

\`\`\`json
[
  {
    "name": "Service name (concise, professional)",
    "price": "Typical market price with format like '$500' or '$50/month'",
    "when_to_offer": "Specific trigger or situation when technician should present this (1-2 sentences)",
    "benefits": [
      "Benefit 1 (customer-focused, specific)",
      "Benefit 2 (quantifiable if possible)",
      "Benefit 3 (addresses pain point)",
      "Benefit 4 (creates urgency or value)"
    ],
    "technician_script": "SPIN method script with 4 parts:\\n\\n**Situation**: [Open with observation/question about their current situation]\\n\\n**Problem**: [Identify the specific problem or gap]\\n\\n**Implication**: [Explain consequences - cost, risk, inconvenience if not addressed]\\n\\n**Need-Payoff**: [Present your service as the solution with specific value proposition and call-to-action]",
    "customer_description": "Customer-facing description (2-3 sentences explaining what they get and why it matters)",
    "is_active": true,
    "order_priority": 1
  }
]
\`\`\`

**CRITICAL REQUIREMENTS:**

1. **SPIN Script Quality**: Each technician_script MUST follow the SPIN framework:
   - **Situation**: Start with observation or diagnostic question
   - **Problem**: Clearly identify the issue
   - **Implication**: Paint picture of consequences (money, safety, comfort, time)
   - **Need-Payoff**: Show how your service solves it, quantify value, ask for commitment

2. **Industry Authenticity**: Services must be real, commonly offered in this industry
3. **Pricing Realism**: Use actual market rates for ${industry}
4. **Triggers**: Be specific about when to offer (not vague)
5. **Benefits**: Focus on outcomes, not features
6. **Priority**: Order by profitability and ease of sale (1 = highest)

**EXAMPLE OF EXCELLENT SPIN SCRIPT:**

"**Situation**: I see your HVAC system is 12 years old. When was the last time you had a comprehensive tune-up?

**Problem**: Without regular maintenance, systems lose about 5% efficiency per year. That means your system is working 60% harder than it should be, wasting energy every day.

**Implication**: That's costing you an extra $40-60 per month in energy bills - about $600 a year. Plus, systems this age without maintenance are at high risk for a complete breakdown, which could mean a $3,000-5,000 emergency replacement during the hottest week of summer when prices are highest and wait times are longest.

**Need-Payoff**: Our Annual Maintenance Plan prevents both problems for just $240 per year - less than half what you're losing in wasted energy. You get two tune-ups that restore your efficiency, priority scheduling so you're never stuck in the heat, and 15% off any repairs. Most customers save more in energy costs than the plan costs. Plus, you'll extend your system's life by 5-10 years. Would you like me to enroll you today so we can get your first tune-up scheduled?"

Now generate 10 services for ${companyName} in the ${industry} industry. Return ONLY the JSON array, no other text.`;
}

/**
 * Parse services from Claude's response
 */
function parseServicesFromResponse(responseText) {
  try {
    // Try to find JSON in the response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('❌ [ANTHROPIC] No JSON array found in response');
      throw new Error('No JSON array found in AI response');
    }

    const services = JSON.parse(jsonMatch[0]);

    // Validate structure
    if (!Array.isArray(services) || services.length === 0) {
      throw new Error('Invalid services array');
    }

    // Ensure exactly 10 services
    const validServices = services.slice(0, 10);

    // Validate each service has required fields
    validServices.forEach((service, idx) => {
      if (!service.name || !service.price || !service.technician_script) {
        console.warn(`⚠️ [ANTHROPIC] Service ${idx + 1} missing required fields`);
      }

      // Set defaults for missing fields
      service.is_active = service.is_active !== false;
      service.order_priority = service.order_priority || (idx + 1);
      service.benefits = service.benefits || [];
      service.when_to_offer = service.when_to_offer || "During service calls";
      service.customer_description = service.customer_description || service.name;
    });

    return validServices;
  } catch (error) {
    console.error('❌ [ANTHROPIC] Error parsing response:', error);
    console.error('Response text:', responseText);
    throw new Error('Failed to parse AI response: ' + error.message);
  }
}

/**
 * Cache for AI-generated services (to reduce API costs)
 * Cache key: companyName_industry
 * Cache duration: 24 hours
 */
const serviceCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function getCachedServices(companyName, industry) {
  const cacheKey = `${companyName}_${industry}`.toLowerCase();
  const cached = serviceCache.get(cacheKey);

  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    console.log('💾 [ANTHROPIC] Using cached services');
    return cached.services;
  }

  return null;
}

export function cacheServices(companyName, industry, services) {
  const cacheKey = `${companyName}_${industry}`.toLowerCase();
  serviceCache.set(cacheKey, {
    services,
    timestamp: Date.now()
  });
  console.log('💾 [ANTHROPIC] Cached services for 24 hours');
}
