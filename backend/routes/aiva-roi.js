// AIVA ROI Calculator - Deliverable Content Generation Route
// Generates personalized deliverable content using Claude API

const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');
const db = require('../db/database');
const { requireAuth, optionalAuth } = require('../middleware/auth');

// Initialize Anthropic client
let anthropic;
try {
  anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    timeout: 600000 // 10 minutes timeout for large content generation
  });
  console.log('✅ Anthropic client initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Anthropic client:', error);
}

// Verify API key is loaded
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('ERROR: ANTHROPIC_API_KEY not found in environment variables');
} else {
  console.log('✅ ANTHROPIC_API_KEY found:', process.env.ANTHROPIC_API_KEY.substring(0, 20) + '...');
}

/**
 * POST /api/aiva/generate-deliverable-content
 * Generates comprehensive, personalized content for all 5 deliverables
 * Public endpoint - no authentication required
 */
router.post('/generate-deliverable-content', optionalAuth, async (req, res) => {
  try {
    const {
      jobTitle,
      industry,
      companyName,
      companyWebsite,
      companySize,
      companyContext,
      deliverables,
      biggestFrustration,
      hourlyRate,
      save = false, // Optional: save analysis to database
      title, // Optional: custom title for saved analysis
      metrics // Optional: calculated metrics to save
    } = req.body;

    // Validate required fields
    if (!jobTitle || !industry || !companyName || !deliverables || deliverables.length === 0) {
      return res.status(400).json({
        error: 'Missing required fields: jobTitle, industry, companyName, and deliverables are required'
      });
    }

    // Ensure deliverables have required properties with defaults
    const normalizedDeliverables = deliverables.map(d => ({
      ...d,
      baselineHours: d.baselineHours || 0,
      aiEnabledHours: d.aiEnabledHours || 0,
      frequency: d.frequency || 'monthly',
      occurrencesPerYear: d.occurrencesPerYear || 12,
      timeMultiplier: d.timeMultiplier || 1,
      annualHoursFreed: d.annualHoursFreed || 0,
      payrollFreed: d.payrollFreed || 0,
      scenario: d.scenario || '',
      oldWay: d.oldWay || '',
      aiVoiceWay: d.aiVoiceWay || ''
    }));

    // Check if anthropic client is initialized
    if (!anthropic) {
      console.error('❌ Anthropic client not properly initialized');
      return res.status(500).json({
        error: 'AI service not available',
        details: 'Anthropic client initialization failed. Please check ANTHROPIC_API_KEY in .env file.'
      });
    }

    // Verify API key is actually set
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your-anthropic-api-key-here') {
      console.error('❌ ANTHROPIC_API_KEY is missing or not configured');
      return res.status(500).json({
        error: 'API key not configured',
        details: 'ANTHROPIC_API_KEY is missing or not set in .env file. Please add your Anthropic API key.'
      });
    }

    let allDeliverables = [...deliverables];

    // If user provided a frustration, generate the 6th deliverable
    if (biggestFrustration && biggestFrustration.trim().length > 0) {
      console.log(`💡 User provided frustration - generating 6th custom deliverable...`);
      try {
        const frustrationDeliverable = await generateFrustrationDeliverable({
          frustration: biggestFrustration,
          jobTitle,
          industry,
          companyName,
          hourlyRate: hourlyRate || 50, // Default fallback
          existingDeliverables: normalizedDeliverables // Pass first 5 deliverables for context
        });
        allDeliverables.push(frustrationDeliverable);
        console.log(`✅ 6th deliverable added: "${frustrationDeliverable.title}"`);
      } catch (frustrationError) {
        console.error('Failed to generate frustration deliverable:', frustrationError);
        // Continue with 5 deliverables if frustration generation fails
      }
    }

    console.log(`🚀 Generating content in parallel for ${allDeliverables.length} deliverables...`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 API Key present: ${!!process.env.ANTHROPIC_API_KEY}`);
    console.log(`📊 API Key length: ${process.env.ANTHROPIC_API_KEY?.length || 0}`);

    // Generate each deliverable in parallel for speed
    const generatePromises = allDeliverables.map((deliverable, index) => {
      // Ensure deliverable has all required properties
      const normalizedDeliverable = {
        ...deliverable,
        baselineHours: deliverable.baselineHours || 0,
        aiEnabledHours: deliverable.aiEnabledHours || 0,
        frequency: deliverable.frequency || 'monthly',
        occurrencesPerYear: deliverable.occurrencesPerYear || 12,
        timeMultiplier: deliverable.timeMultiplier || 1,
        annualHoursFreed: deliverable.annualHoursFreed || 0,
        payrollFreed: deliverable.payrollFreed || 0,
        scenario: deliverable.scenario || '',
        oldWay: deliverable.oldWay || '',
        aiVoiceWay: deliverable.aiVoiceWay || ''
      };
      
      // Wrap in additional error handling to capture more details
      return generateSingleDeliverable({
        deliverable: normalizedDeliverable,
        index,
        jobTitle,
        industry,
        companyName,
        companyContext
      }).catch(error => {
        // Enhanced error logging for production debugging
        console.error(`❌ Deliverable #${index + 1} "${deliverable.title}" failed:`, {
          message: error.message,
          name: error.name,
          status: error.status,
          statusCode: error.statusCode,
          code: error.code,
          response: error.response?.data || error.response || 'No response',
          stack: error.stack?.substring(0, 500) // First 500 chars of stack
        });
        throw error; // Re-throw to be caught by Promise.allSettled
      });
    });

    // Wait for all deliverables to generate in parallel
    // Use allSettled instead of all so partial failures don't crash the entire request
    const results = await Promise.allSettled(generatePromises);

    // Process results - handle both fulfilled and rejected promises
    const generatedDeliverables = [];
    const errors = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        generatedDeliverables.push(result.value);
      } else {
        const deliverable = allDeliverables[index];
        console.error(`❌ Failed to generate deliverable #${index + 1} "${deliverable?.title || 'Unknown'}":`, result.reason);
        errors.push({
          index: index + 1,
          title: deliverable?.title || 'Unknown',
          error: result.reason?.message || 'Unknown error'
        });
        // Include the original deliverable with error flag so frontend can handle it
        generatedDeliverables.push({
          ...deliverable,
          error: true,
          errorMessage: result.reason?.message || 'Failed to generate content'
        });
      }
    });

    console.log(`✅ Generated ${generatedDeliverables.length} deliverables (${errors.length} errors)`);

    // Prepare response
    const response = {
      success: errors.length === 0,
      deliverables: generatedDeliverables,
      ...(errors.length > 0 && {
        errors: errors,
        warning: `${errors.length} deliverable(s) failed to generate. They will show with limited content.`
      })
    };

    // Optionally save analysis to database
    if (save && req.session?.userId) {
      try {
        const userId = req.session.userId;
        const userCompanyId = req.session.companyId;

        if (!userCompanyId && req.session.role !== 'super_admin') {
          console.warn('⚠️ Cannot save analysis: user does not belong to a company');
        } else {
          // Build analysis data object
          const analysisData = {
            deliverables: generatedDeliverables,
            haradaMatrix: req.body.haradaMatrix || null,
            metrics: metrics || req.body.metrics || {},
            valueAddedSuggestions: req.body.valueAddedSuggestions || []
          };

          // Calculate metrics if not provided
          const totalAnnualHoursFreed = generatedDeliverables.reduce((sum, d) => {
            return sum + (parseFloat(d.annualHoursFreed) || 0);
          }, 0);

          const totalPayrollFreed = totalAnnualHoursFreed * parseFloat(hourlyRate || 50);
          const annualValueCreated = metrics?.annualValueCreated || metrics?.conservativeEstimate || (totalPayrollFreed * 3.3);
          const paybackDays = metrics?.paybackDays || null;
          const productivityMultiplier = parseFloat(metrics?.productivityMultiplier) || null;

          // Insert analysis
          const saveResult = await db.query(
            `INSERT INTO roi_analyses (
              user_id, company_id, title, job_title, industry, company_name, 
              company_website, company_size, company_context, hourly_rate, 
              biggest_frustration, analysis_data, total_annual_hours_freed, 
              total_payroll_freed, annual_value_created, payback_days, 
              productivity_multiplier, status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
            RETURNING id`,
            [
              userId,
              userCompanyId || req.body.companyId || null,
              title || `${jobTitle} - ${companyName}`,
              jobTitle,
              industry,
              companyName,
              companyWebsite || null,
              companySize || null,
              companyContext ? JSON.stringify(companyContext) : null,
              parseFloat(hourlyRate || 50),
              biggestFrustration || null,
              JSON.stringify(analysisData),
              totalAnnualHoursFreed,
              totalPayrollFreed,
              annualValueCreated,
              paybackDays,
              productivityMultiplier,
              'completed'
            ]
          );

          response.analysisId = saveResult.rows[0].id;
          console.log(`✅ Analysis saved with ID: ${response.analysisId}`);
        }
      } catch (saveError) {
        console.error('❌ Error saving analysis:', saveError);
        // Don't fail the request if save fails, just log it
        response.saveError = 'Failed to save analysis, but content was generated successfully';
      }
    }

    // Return generated content with error information
    res.json(response);

  } catch (error) {
    console.error('❌ Error generating deliverable content:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error details:', {
      message: error.message,
      name: error.name,
      status: error.status,
      statusCode: error.statusCode,
      code: error.code,
      cause: error.cause,
      response: error.response?.data || error.response || 'No response',
      errorType: error.constructor?.name
    });
    console.error('❌ Request body:', JSON.stringify(req.body, null, 2));
    
    // Provide more helpful error messages
    let errorMessage = error.message || 'Unknown error occurred';
    let statusCode = 500;
    
    // Handle specific error types
    if (error.message?.includes('timeout') || error.code === 'ETIMEDOUT') {
      errorMessage = 'Request timed out. The AI generation is taking too long. Please try again with fewer deliverables.';
      statusCode = 504;
    } else if (error.message?.includes('API key') || error.message?.includes('authentication') || error.message?.includes('401') || error.status === 401) {
      errorMessage = 'AI service authentication failed. ANTHROPIC_API_KEY is missing or invalid. Please configure it in Render environment variables.';
      statusCode = 503;
    } else if (error.message?.includes('rate limit') || error.status === 429) {
      errorMessage = 'AI service rate limit exceeded. Please try again in a moment.';
      statusCode = 429;
    } else if (error.status === 500 && error.message?.includes('anthropic')) {
      errorMessage = 'AI service error. Please check ANTHROPIC_API_KEY configuration in Render.';
      statusCode = 503;
    }
    
    // Return detailed error in development, simplified in production
    const errorResponse = {
      error: 'Failed to generate deliverable content',
      details: errorMessage,
      type: error.name || 'UnknownError',
      status: error.status || error.statusCode || statusCode
    };
    
    // Include more details in production for debugging (but not full stack)
    if (process.env.NODE_ENV === 'production') {
      errorResponse.errorCode = error.code || 'UNKNOWN';
      if (error.status) errorResponse.apiStatus = error.status;
      if (error.response?.data) errorResponse.apiResponse = error.response.data;
    } else {
      errorResponse.stack = error.stack;
    }
    
    res.status(statusCode).json(errorResponse);
  }
});

/**
 * POST /api/aiva/generate-voice-agent-content
 * Generates voice agent implementation guide content for a single deliverable on-demand
 */
router.post('/generate-voice-agent-content', async (req, res) => {
  try {
    const {
      deliverable,
      jobTitle,
      industry,
      companyName
    } = req.body;

    // Validate required fields
    if (!deliverable || !jobTitle || !industry || !companyName) {
      return res.status(400).json({
        error: 'Missing required fields: deliverable, jobTitle, industry, and companyName are required'
      });
    }

    // Check if anthropic client is initialized
    if (!anthropic) {
      console.error('Anthropic client not properly initialized');
      return res.status(500).json({
        error: 'AI service not available',
        details: 'Anthropic client initialization failed'
      });
    }

    console.log(`🤖 Generating voice agent content for: ${deliverable.title}`);

    const prompt = buildVoiceAgentPrompt({
      deliverable,
      jobTitle,
      industry,
      companyName
    });

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 16000,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseText = message.content[0].text;

    // Parse JSON response
    let parsed;
    try {
      const cleanedResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse voice agent JSON:', parseError);
      return res.status(500).json({
        error: 'Invalid JSON response from AI',
        details: parseError.message
      });
    }

    console.log(`✅ Voice agent content generated successfully`);

    res.json({
      success: true,
      voiceAgentContent: parsed
    });

  } catch (error) {
    console.error('Error generating voice agent content:', error);
    res.status(500).json({
      error: 'Failed to generate voice agent content',
      details: error.message
    });
  }
});

/**
 * POST /api/aiva/research-role-deliverables
 * Dynamically researches and generates role-specific deliverables for unmapped roles
 */
router.post('/research-role-deliverables', async (req, res) => {
  try {
    const {
      jobTitle,
      industry,
      companyName,
      hourlyRate
    } = req.body;

    // Validate required fields
    if (!jobTitle || !industry || !companyName || !hourlyRate) {
      return res.status(400).json({
        error: 'Missing required fields: jobTitle, industry, companyName, and hourlyRate are required'
      });
    }

    // Check if anthropic client is initialized
    if (!anthropic) {
      console.error('Anthropic client not properly initialized');
      return res.status(500).json({
        error: 'AI service not available',
        details: 'Anthropic client initialization failed'
      });
    }

    console.log(`🔍 Researching deliverables for: ${jobTitle} in ${industry} at ${companyName}`);

    const prompt = buildDeliverableResearchPrompt({ jobTitle, industry, companyName, hourlyRate });

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8000,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseText = message.content[0].text;

    // Parse JSON response
    let deliverables;
    try {
      const cleanedResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      deliverables = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse deliverables JSON:', parseError);
      return res.status(500).json({
        error: 'Invalid JSON response from AI',
        details: parseError.message
      });
    }

    console.log(`✅ Researched ${deliverables.length} deliverables for ${jobTitle}`);

    res.json({
      success: true,
      deliverables: deliverables
    });

  } catch (error) {
    console.error('Error researching deliverables:', error);
    res.status(500).json({
      error: 'Failed to research deliverables',
      details: error.message
    });
  }
});

/**
 * Generate content for a single deliverable using Claude API
 * This enables parallel generation of all deliverables
 */
async function generateSingleDeliverable({ deliverable, index, jobTitle, industry, companyName, companyContext }) {
  try {
    // Verify API key before making request
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your-anthropic-api-key-here') {
      throw new Error('ANTHROPIC_API_KEY is not configured. Please add your API key to .env file.');
    }

    // Verify anthropic client is initialized
    if (!anthropic) {
      throw new Error('Anthropic client not initialized. Check ANTHROPIC_API_KEY configuration.');
    }

    console.log(`📝 Generating deliverable #${index + 1}: ${deliverable.title}`);
    
    const prompt = buildSingleDeliverablePrompt({
      deliverable,
      index,
      jobTitle,
      industry,
      companyName,
      companyContext
    });
    
    console.log(`📝 Prompt length: ${prompt.length} chars`);
    console.log(`📡 Making Anthropic API call for deliverable #${index + 1}...`);
    const startTime = Date.now();

    let message;
    try {
      message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 16000,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });
    } catch (apiError) {
      // Handle Anthropic API errors specifically
      if (apiError.status === 401 || apiError.message?.includes('authentication') || apiError.message?.includes('API key')) {
        throw new Error('ANTHROPIC_API_KEY is invalid or missing. Please configure it in Render environment variables.');
      }
      if (apiError.status === 429) {
        throw new Error('Anthropic API rate limit exceeded. Please try again in a moment.');
      }
      // Re-throw other errors
      throw apiError;
    }
    
    const duration = Date.now() - startTime;
    console.log(`✅ Anthropic API call completed for deliverable #${index + 1} in ${duration}ms`);

    const responseText = message.content[0].text;

    // Parse JSON response
    let parsed;
    try {
      // Remove any markdown code blocks if present
      const cleanedResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error(`Failed to parse JSON for deliverable #${index + 1}:`, parseError);
      throw new Error(`Invalid JSON response for deliverable "${deliverable.title}"`);
    }

    console.log(`✅ Deliverable #${index + 1} generated successfully`);

    // Return the generated deliverable with merged data
    return {
      ...deliverable,
      ...parsed
    };

  } catch (error) {
    console.error(`❌ Error generating deliverable #${index + 1}:`, error);
    console.error(`❌ Error details for deliverable "${deliverable.title}":`, {
      message: error.message,
      name: error.name,
      status: error.status,
      statusCode: error.statusCode,
      response: error.response?.data || error.response || 'No response data'
    });
    throw error;
  }
}

/**
 * Build prompt for a single deliverable
 */
function buildSingleDeliverablePrompt({ deliverable, index, jobTitle, industry, companyName, companyContext }) {
  const contextSummary = companyContext ? `
COMPANY RESEARCH FROM WEBSITE:
- Company Size: ${companyContext.companySize || 'Not specified'}
- Products/Services: ${companyContext.products || 'Not specified'}
- Industry Details: ${companyContext.industry || industry}
- Recent News: ${companyContext.recentNews || 'None found'}
` : `
COMPANY CONTEXT:
- Company: ${companyName}
- Industry: ${industry}
(No website provided - use industry-standard assumptions)
`;

  const isFrustrationDeliverable = deliverable.category === 'custom-frustration';
  const frustrationSection = isFrustrationDeliverable ? `

6. **frustrationResolutionAnalysis** (300-350 words)
THIS IS A CUSTOM DELIVERABLE BASED ON THE USER'S BIGGEST DAILY FRUSTRATION.
Format as plain text with headers and specific details. This section should feel DEEPLY PERSONAL:

**The Frustration They Described:**
Acknowledge what they said in their own words (reference their frustration context)

**Why This Frustration Persists:**
- Root cause #1: [Systemic reason]
- Root cause #2: [Process/tool reason]
- Root cause #3: [Human/organizational reason]

**The Hidden Costs:**
- Time cost: [Specific breakdown]
- Emotional cost: [Specific toll]
- Opportunity cost: [What they can't do because of this]
- Team/organizational cost: [Ripple effects]

**How AI Voice Specifically Solves It:**
Provide a step-by-step transformation:
1. [First interaction with AI voice]
2. [How it handles the frustration point]
3. [The immediate relief]
4. [The compounding benefit over time]

**The Transformation:**
"Instead of [their old frustrating experience], ${jobTitle} at ${companyName} now [new empowered experience]. This isn't just faster—it's fundamentally different."

Make this section feel like you truly understand their exact pain point and have the perfect solution.
` : '';

  return `You are generating a comprehensive, emotionally resonant deliverable analysis for an AI Voice Partner ROI Calculator lead magnet application.

Your task is to generate missing content sections for ONE specific deliverable for a ${jobTitle} at ${companyName}, making the analysis feel custom-built for them.

${contextSummary}

ROLE BEING ANALYZED:
- Job Title: ${jobTitle}
- Industry: ${industry}

DELIVERABLE TO ANALYZE:
- Title: ${deliverable.title}
- Baseline Hours: ${deliverable.baselineHours || 0} hours per ${deliverable.frequency || 'month'}
- AI-Enabled Hours: ${deliverable.aiEnabledHours || 0} hours
- Frequency: ${deliverable.frequency || 'monthly'}
- Annual Occurrences: ${deliverable.occurrencesPerYear || 12}
- Time Multiplier: ${deliverable.timeMultiplier || 1}x faster
- Annual Hours Freed: ${deliverable.annualHoursFreed || 0}
- Payroll Freed: $${(deliverable.payrollFreed || 0).toFixed(0)}

EXISTING NARRATIVE:
- Scenario: ${deliverable.scenario}
- The Old Way: ${deliverable.oldWay}
- The AI Voice Way: ${deliverable.aiVoiceWay}

---

INSTRUCTIONS:

Generate the following sections for this deliverable. Use "${companyName}" throughout to make it feel personalized (reference the company name 8-12 times across all sections).

HARADA MATRIX FIELDS (Generate FIRST - these define the deliverable structure):

**keyActivities** (array of 4-6 strings)
Specific, actionable activities that define this deliverable for ${jobTitle} at ${companyName}. Make them:
- Role-specific (not generic)
- Industry-contextualized (reference ${industry} standards/practices)
- Company-relevant (consider ${companyName}'s context)
Example format: ["Precision assembly per MIL-STD-1913 specifications", "Quality control inspections using digital calipers", ...]

**successMetrics** (array of 3-5 strings)
Measurable outcomes that define success for this deliverable. Include:
- Quantifiable metrics (time, accuracy, defect rates, etc.)
- Quality indicators relevant to ${industry}
- Outcomes ${companyName} would track
Example format: ["Zero defect rate on safety inspections", "Assembly time under 45 minutes per unit", ...]

**dependencies** (array of 3-4 strings)
Critical resources, people, or systems needed to complete this deliverable. Include:
- Team/department dependencies
- System/tool access requirements
- Information or resource availability
Example format: ["Parts inventory availability", "Quality assurance team sign-off", "CAD system access", ...]

DETAILED CONTENT SECTIONS:

1. **productivityImpact** (200-250 words)
Format as plain text with bullet points. Include:
- "Traditional Method:" with time breakdown
- "AIVA Method:" with time breakdown
- "Productivity Multiplier: Xx faster"
- "Annual Time Calculation:" with specific math

2. **emotionalImpact** (250-300 words)
Format as plain text with paragraphs. Follow this structure:
- Opening: The emotional burden this deliverable creates (fear, stress, anxiety)
- Paragraph 2: How it manifests (follows you home, Sunday night dread, decision paralysis)
- Paragraph 3: The AIVA transformation (confidence, presence, clarity)
- Paragraph 4: Specific emotional metrics as bullet list:
  • X% reduction in [specific anxiety]
  • X% reduction in [specific stress pattern]
  • Elimination of [specific dread]
  • Measurable improvement in [specific confidence metric]
- Closing: "This isn't minor quality-of-life improvement. This is the difference between sustainable leadership and burnout..."

3. **businessROI** (300-350 words)
Format as plain text with sections and bullet points. Include:
- Opening paragraph about cost of failure
- "Direct costs:" (bulleted breakdown)
- "Indirect costs:" (bulleted breakdown)
- "Total cost per [failure event]:"
- Time acceleration value calculation
- "For organizations [doing X]: $XXX-$XXX in combined value"
Reference ${companyName}'s scale and industry context.

4. **additionalRippleEffects** (250-300 words)
Format as plain text with markdown bold headers. Include:
- Opening: "The direct calculation shows $X in payroll freed. But here's what the numbers can't fully capture:"
- **Ripple Effect #1:** (with ${companyName} context)
- **Ripple Effect #2:** (organizational multiplication)
- **Ripple Effect #3:** (market/brand effects)
- "Conservative additional impact: $XXX-$XXX over 24 months beyond direct payroll freed."

5. **compoundingEffect** (150-200 words)
Format as plain text with arrows and bullets. Include:
- "When you reallocate X hours to strategic activities, the ROI doesn't add—it multiplies:"
- Virtuous cycle with arrows: → Activity A → Benefit B → More time for C →
- "This creates a virtuous cycle where each hour invested generates 1.5-2 hours freed through:"
- Bulleted compounding mechanisms (3-4 items)
- "Total value of strategic reallocation: $XXX-$XXX annually beyond direct productivity gains, compounding at 15-20% annually..."
${frustrationSection}
---

CRITICAL REQUIREMENTS:
- Use "${companyName}" 8-12 times across all sections
- Reference ${industry} context appropriately
- Include specific dollar amounts ($XXK-$XXXK ranges)
- Include specific percentage metrics (X% reduction, X% improvement)
- Maintain emotional depth and business rigor
- Follow the section structures exactly as specified
- Make it feel like custom analysis FOR THIS SPECIFIC COMPANY

RETURN FORMAT:
Return ONLY valid JSON in this exact structure (no markdown, no extra text):

{
  "keyActivities": ["Activity 1", "Activity 2", "Activity 3", "Activity 4"],
  "successMetrics": ["Metric 1", "Metric 2", "Metric 3"],
  "dependencies": ["Dependency 1", "Dependency 2", "Dependency 3"],
  "productivityImpact": "full text here...",
  "emotionalImpact": "full text here...",
  "businessROI": "full text here...",
  "additionalRippleEffects": "full text here...",
  "compoundingEffect": "full text here..."${isFrustrationDeliverable ? ',\n  "frustrationResolutionAnalysis": "full text here..."' : ''}
}

Generate now for this deliverable.`;
}

/**
 * Build comprehensive prompt for Claude to generate all deliverable content
 */
function buildComprehensivePrompt({ jobTitle, industry, companyName, companyContext, deliverables }) {
  const contextSummary = companyContext ? `
COMPANY RESEARCH FROM WEBSITE:
- Company Size: ${companyContext.companySize || 'Not specified'}
- Products/Services: ${companyContext.products || 'Not specified'}
- Industry Details: ${companyContext.industry || industry}
- Recent News: ${companyContext.recentNews || 'None found'}
` : `
COMPANY CONTEXT:
- Company: ${companyName}
- Industry: ${industry}
(No website provided - use industry-standard assumptions)
`;

  const deliverablesContext = deliverables.map((d, index) => `
DELIVERABLE #${index + 1}: ${d.title}
- Baseline Hours: ${d.baselineHours} hours per ${d.frequency}
- AI-Enabled Hours: ${d.aiEnabledHours} hours
- Frequency: ${d.frequency}
- Annual Occurrences: ${d.occurrencesPerYear}
- Time Multiplier: ${d.timeMultiplier}x faster
- Annual Hours Freed: ${d.annualHoursFreed}
- Payroll Freed: $${(d.payrollFreed || 0).toFixed(0)}

EXISTING NARRATIVE:
- Scenario: ${d.scenario}
- The Old Way: ${d.oldWay}
- The AI Voice Way: ${d.aiVoiceWay}
`).join('\n---\n');

  return `You are generating a comprehensive, emotionally resonant deliverable analysis for an AI Voice Partner ROI Calculator lead magnet application.

Your task is to generate missing content sections for ALL 5 deliverables for a specific role at a specific company, making the analysis feel custom-built for them.

${contextSummary}

ROLE BEING ANALYZED:
- Job Title: ${jobTitle}
- Industry: ${industry}

${deliverablesContext}

---

INSTRUCTIONS:

Generate the following sections for EACH of the ${deliverables.length} deliverables above. Use "${companyName}" throughout to make it feel personalized (reference the company name 8-12 times per deliverable across all sections).

For each deliverable, generate:

HARADA MATRIX FIELDS (Generate FIRST - these define the deliverable structure):

**keyActivities** (array of 4-6 strings)
Specific, actionable activities that define this deliverable for ${jobTitle} at ${companyName}. Make them:
- Role-specific (not generic)
- Industry-contextualized (reference ${industry} standards/practices)
- Company-relevant (consider ${companyName}'s context)
Example format: ["Precision assembly per MIL-STD-1913 specifications", "Quality control inspections using digital calipers", ...]

**successMetrics** (array of 3-5 strings)
Measurable outcomes that define success for this deliverable. Include:
- Quantifiable metrics (time, accuracy, defect rates, etc.)
- Quality indicators relevant to ${industry}
- Outcomes ${companyName} would track
Example format: ["Zero defect rate on safety inspections", "Assembly time under 45 minutes per unit", ...]

**dependencies** (array of 3-4 strings)
Critical resources, people, or systems needed to complete this deliverable. Include:
- Team/department dependencies
- System/tool access requirements
- Information or resource availability
Example format: ["Parts inventory availability", "Quality assurance team sign-off", "CAD system access", ...]

DETAILED CONTENT SECTIONS:

1. **productivityImpact** (200-250 words)
Format as plain text with bullet points. Include:
- "Traditional Method:" with time breakdown
- "AIVA Method:" with time breakdown
- "Productivity Multiplier: Xx faster"
- "Annual Time Calculation:" with specific math

2. **emotionalImpact** (250-300 words)
Format as plain text with paragraphs. Follow this structure:
- Opening: The emotional burden this deliverable creates (fear, stress, anxiety)
- Paragraph 2: How it manifests (follows you home, Sunday night dread, decision paralysis)
- Paragraph 3: The AIVA transformation (confidence, presence, clarity)
- Paragraph 4: Specific emotional metrics as bullet list:
  • X% reduction in [specific anxiety]
  • X% reduction in [specific stress pattern]
  • Elimination of [specific dread]
  • Measurable improvement in [specific confidence metric]
- Closing: "This isn't minor quality-of-life improvement. This is the difference between sustainable leadership and burnout..."

3. **businessROI** (300-350 words)
Format as plain text with sections and bullet points. Include:
- Opening paragraph about cost of failure
- "Direct costs:" (bulleted breakdown)
- "Indirect costs:" (bulleted breakdown)
- "Total cost per [failure event]:"
- Time acceleration value calculation
- "For organizations [doing X]: $XXX-$XXX in combined value"
Reference ${companyName}'s scale and industry context.

4. **additionalRippleEffects** (250-300 words)
Format as plain text with markdown bold headers. Include:
- Opening: "The direct calculation shows $X in payroll freed. But here's what the numbers can't fully capture:"
- **Ripple Effect #1:** (with ${companyName} context)
- **Ripple Effect #2:** (organizational multiplication)
- **Ripple Effect #3:** (market/brand effects)
- "Conservative additional impact: $XXX-$XXX over 24 months beyond direct payroll freed."

5. **compoundingEffect** (150-200 words)
Format as plain text with arrows and bullets. Include:
- "When you reallocate X hours to strategic activities, the ROI doesn't add—it multiplies:"
- Virtuous cycle with arrows: → Activity A → Benefit B → More time for C →
- "This creates a virtuous cycle where each hour invested generates 1.5-2 hours freed through:"
- Bulleted compounding mechanisms (3-4 items)
- "Total value of strategic reallocation: $XXX-$XXX annually beyond direct productivity gains, compounding at 15-20% annually..."

---

VOICE AGENT IMPLEMENTATION GUIDE SECTIONS:

Generate these 7 additional sections to enable ${companyName} to build an AI voice agent for this deliverable:

6. **voiceAgentOverview** (150-200 words)
Format as plain text with clear structure:
- Opening: "This AI voice agent is designed to handle [deliverable title] for ${jobTitle} roles at ${companyName}."
- Mission statement: What the voice agent accomplishes
- Target user profile: Who will interact with it
- Success criteria: What "excellent performance" looks like
- Expected impact: How it transforms the deliverable execution

7. **voiceAgentPersonality** (200-250 words)
Format as plain text with headers and bullets:
- **Tone & Voice:** (Professional, empathetic, efficient - specify for ${industry})
- **Communication Style:** (Direct, consultative, supportive - specify for ${companyName} culture)
- **Language Patterns:** (Technical vocabulary, industry jargon appropriate for ${industry})
- **Do's:** (3-4 specific behavioral guidelines)
- **Don'ts:** (3-4 specific behaviors to avoid)
- Closing: "This personality ensures the voice agent feels like a trusted ${jobTitle} colleague at ${companyName}."

8. **voiceAgentKnowledgeBase** (300-400 words)
Format as plain text with structured sections:
- **Core Deliverable Knowledge:** (What the agent must know about this specific deliverable)
- **Key Activities & Processes:** (From keyActivities - explain each in detail)
- **Success Metrics & Quality Standards:** (From successMetrics - explain measurement)
- **Dependencies & Resources:** (From dependencies - explain access requirements)
- **Industry-Specific Context:** (${industry} standards, regulations, best practices)
- **Company-Specific Context:** (${companyName} processes, systems, culture)
- **Common Scenarios:** (5-7 typical situations the agent will handle)

9. **voiceAgentSystemPrompt** (400-500 words)
Format as a complete, ready-to-use system prompt:
"You are an AI voice assistant specialized in [deliverable title] for ${jobTitle} professionals at ${companyName} in the ${industry} industry.

YOUR ROLE:
[Define the role comprehensively]

YOUR KNOWLEDGE:
[List key knowledge areas]

YOUR CAPABILITIES:
[What you can help with - 6-8 specific capabilities]

YOUR COMMUNICATION STYLE:
[Tone, approach, language]

CONVERSATION GUIDELINES:
[How to structure interactions - 5-7 guidelines]

QUALITY STANDARDS:
[How to ensure excellence]

WHEN TO ESCALATE:
[Scenarios requiring human intervention]

Remember: You represent ${companyName}'s commitment to excellence in ${industry}."

10. **voiceAgentSampleConversations** (500-600 words)
Format as 3-4 complete conversation examples:

**Scenario 1: [Happy Path]**
User: [Realistic opener]
Agent: [Response following personality & guidelines]
User: [Follow-up]
Agent: [Response]
[Continue for 4-6 turns]

**Scenario 2: [Complex Case]**
[Full conversation showing problem-solving]

**Scenario 3: [Edge Case/Objection]**
[Full conversation showing handling difficulty]

Each scenario should demonstrate voice agent personality, knowledge application, and conversation management.

11. **voiceAgentTrainingData** (400-500 words)
Format as 10-15 training dialogue pairs:

**Training Example 1:**
User Intent: [What user wants]
User: "[Exact user query]"
Agent: "[Exact response following guidelines]"
Context: [Why this response is correct]

**Training Example 2:**
[Continue pattern for 10-15 examples covering:]
- Common requests
- Information gathering
- Clarification needs
- Multi-step processes
- Error handling
- Confirmation protocols

12. **voiceAgentIntegrationGuide** (200-250 words)
Format as plain text with sections:
- **Required Data Access:** (What systems/databases the agent needs)
- **API Integration Points:** (External services to connect)
- **Information to Collect from Users:** (Data gathering requirements)
- **Handoff Protocols:** (When/how to transfer to humans)
- **Security & Privacy:** (${industry} compliance requirements)
- **Performance Monitoring:** (Metrics to track agent effectiveness)
- **Continuous Improvement:** (How to refine based on usage)

---

CRITICAL REQUIREMENTS:
- Use "${companyName}" 8-12 times per deliverable across all sections
- Reference ${industry} context appropriately
- Include specific dollar amounts ($XXK-$XXXK ranges)
- Include specific percentage metrics (X% reduction, X% improvement)
- Maintain emotional depth and business rigor
- Follow the section structures exactly as specified
- Make it feel like custom analysis FOR THIS SPECIFIC COMPANY

RETURN FORMAT:
Return ONLY valid JSON in this exact structure (no markdown, no extra text):

{
  "deliverables": [
    {
      "id": 1,
      "title": "Deliverable Title Here",
      "keyActivities": ["Activity 1", "Activity 2", "Activity 3", "Activity 4"],
      "successMetrics": ["Metric 1", "Metric 2", "Metric 3"],
      "dependencies": ["Dependency 1", "Dependency 2", "Dependency 3"],
      "productivityImpact": "full text here...",
      "emotionalImpact": "full text here...",
      "businessROI": "full text here...",
      "additionalRippleEffects": "full text here...",
      "compoundingEffect": "full text here...",
      "voiceAgentOverview": "full text here...",
      "voiceAgentPersonality": "full text here...",
      "voiceAgentKnowledgeBase": "full text here...",
      "voiceAgentSystemPrompt": "full text here...",
      "voiceAgentSampleConversations": "full text here...",
      "voiceAgentTrainingData": "full text here...",
      "voiceAgentIntegrationGuide": "full text here..."
    },
    ... repeat for all 5 deliverables
  ]
}

Generate now for all ${deliverables.length} deliverables.`;
}

/**
 * Build prompt for voice agent content generation
 * This is called on-demand when user downloads a guide
 */
function buildVoiceAgentPrompt({ deliverable, jobTitle, industry, companyName }) {
  return `You are generating AI voice agent implementation guide content for a specific deliverable.

Your task is to generate detailed voice agent setup instructions for ${jobTitle} at ${companyName} in the ${industry} industry.

DELIVERABLE CONTEXT:
- Title: ${deliverable.title}
- Scenario: ${deliverable.scenario}
- The Old Way: ${deliverable.oldWay}
- The AI Voice Way: ${deliverable.aiVoiceWay}
- Key Activities: ${deliverable.keyActivities ? deliverable.keyActivities.join(', ') : 'Not specified'}
- Success Metrics: ${deliverable.successMetrics ? deliverable.successMetrics.join(', ') : 'Not specified'}
- Dependencies: ${deliverable.dependencies ? deliverable.dependencies.join(', ') : 'Not specified'}

---

INSTRUCTIONS:

Generate the following 7 sections to enable ${companyName} to build an AI voice agent for this deliverable:

1. **voiceAgentOverview** (150-200 words)
Format as plain text with clear structure:
- Opening: "This AI voice agent is designed to handle ${deliverable.title} for ${jobTitle} roles at ${companyName}."
- Mission statement: What the voice agent accomplishes
- Target user profile: Who will interact with it
- Success criteria: What "excellent performance" looks like
- Expected impact: How it transforms the deliverable execution

2. **voiceAgentPersonality** (200-250 words)
Format as plain text with headers and bullets:
- **Tone & Voice:** (Professional, empathetic, efficient - specify for ${industry})
- **Communication Style:** (Direct, consultative, supportive - specify for ${companyName} culture)
- **Language Patterns:** (Technical vocabulary, industry jargon appropriate for ${industry})
- **Do's:** (3-4 specific behavioral guidelines)
- **Don'ts:** (3-4 specific behaviors to avoid)
- Closing: "This personality ensures the voice agent feels like a trusted ${jobTitle} colleague at ${companyName}."

3. **voiceAgentKnowledgeBase** (300-400 words)
Format as plain text with structured sections:
- **Core Deliverable Knowledge:** (What the agent must know about this specific deliverable)
- **Key Activities & Processes:** (From keyActivities - explain each in detail)
- **Success Metrics & Quality Standards:** (From successMetrics - explain measurement)
- **Dependencies & Resources:** (From dependencies - explain access requirements)
- **Industry-Specific Context:** (${industry} standards, regulations, best practices)
- **Company-Specific Context:** (${companyName} processes, systems, culture)
- **Common Scenarios:** (5-7 typical situations the agent will handle)

4. **voiceAgentSystemPrompt** (400-500 words)
Format as a complete, ready-to-use system prompt:
"You are an AI voice assistant specialized in ${deliverable.title} for ${jobTitle} professionals at ${companyName} in the ${industry} industry.

YOUR ROLE:
[Define the role comprehensively]

YOUR KNOWLEDGE:
[List key knowledge areas]

YOUR CAPABILITIES:
[What you can help with - 6-8 specific capabilities]

YOUR COMMUNICATION STYLE:
[Tone, approach, language]

CONVERSATION GUIDELINES:
[How to structure interactions - 5-7 guidelines]

QUALITY STANDARDS:
[How to ensure excellence]

WHEN TO ESCALATE:
[Scenarios requiring human intervention]

Remember: You represent ${companyName}'s commitment to excellence in ${industry}."

5. **voiceAgentSampleConversations** (500-600 words)
Format as 3-4 complete conversation examples:

**Scenario 1: [Happy Path]**
User: [Realistic opener]
Agent: [Response following personality & guidelines]
User: [Follow-up]
Agent: [Response]
[Continue for 4-6 turns]

**Scenario 2: [Complex Case]**
[Full conversation showing problem-solving]

**Scenario 3: [Edge Case/Objection]**
[Full conversation showing handling difficulty]

Each scenario should demonstrate voice agent personality, knowledge application, and conversation management.

6. **voiceAgentTrainingData** (400-500 words)
Format as 10-15 training dialogue pairs:

**Training Example 1:**
User Intent: [What user wants]
User: "[Exact user query]"
Agent: "[Exact response following guidelines]"
Context: [Why this response is correct]

**Training Example 2:**
[Continue pattern for 10-15 examples covering:]
- Common requests
- Information gathering
- Clarification needs
- Multi-step processes
- Error handling
- Confirmation protocols

7. **voiceAgentIntegrationGuide** (200-250 words)
Format as plain text with sections:
- **Required Data Access:** (What systems/databases the agent needs)
- **API Integration Points:** (External services to connect)
- **Information to Collect from Users:** (Data gathering requirements)
- **Handoff Protocols:** (When/how to transfer to humans)
- **Security & Privacy:** (${industry} compliance requirements)
- **Performance Monitoring:** (Metrics to track agent effectiveness)
- **Continuous Improvement:** (How to refine based on usage)

---

CRITICAL REQUIREMENTS:
- Use "${companyName}" 6-8 times across all sections
- Reference ${industry} context appropriately
- Make it actionable and ready-to-implement
- Provide specific, detailed guidance
- Maintain professional yet practical tone

RETURN FORMAT:
Return ONLY valid JSON in this exact structure (no markdown, no extra text):

{
  "voiceAgentOverview": "full text here...",
  "voiceAgentPersonality": "full text here...",
  "voiceAgentKnowledgeBase": "full text here...",
  "voiceAgentSystemPrompt": "full text here...",
  "voiceAgentSampleConversations": "full text here...",
  "voiceAgentTrainingData": "full text here...",
  "voiceAgentIntegrationGuide": "full text here..."
}

Generate now.`;
}

/**
 * Build prompt for researching role-specific deliverables
 * This is called for unmapped roles to dynamically discover appropriate deliverables
 */
function buildDeliverableResearchPrompt({ jobTitle, industry, companyName, hourlyRate }) {
  return `You are an expert business analyst researching role-specific deliverables for an AI Voice Partner ROI Calculator.

Your task is to identify the 5 most time-consuming, repetitive, high-impact deliverables for a ${jobTitle} role in the ${industry} industry at ${companyName}.

CONTEXT:
- Job Title: ${jobTitle}
- Industry: ${industry}
- Company: ${companyName}
- Hourly Rate: $${hourlyRate}

INSTRUCTIONS:

Research and identify 5 deliverables that meet these criteria:
1. **Time-consuming**: Takes significant time to complete (baseline 20-100+ hours annually)
2. **Repetitive**: Happens regularly (weekly, monthly, or quarterly)
3. **High-impact**: Important to the role's success
4. **Automatable**: Can be significantly accelerated with AI voice assistance
5. **Role-specific**: Specific to ${jobTitle} in ${industry}, not generic tasks

For each deliverable, provide:

**title**: Short, specific deliverable name (e.g., "Safety Inspection Reports", "Customer Onboarding Calls")

**scenario**: Realistic scenario describing when/why this deliverable is needed (2-3 sentences)
Example: "Every time a new firearm is assembled, the technician must document serial numbers, test fire results, and compliance certifications. This happens 15-30 times per week and requires meticulous attention to detail."

**oldWay**: How ${jobTitle} currently completes this deliverable without AI (3-4 sentences, emphasize manual effort, time consumption, pain points)

**aiVoiceWay**: How an AI voice partner would transform this deliverable (3-4 sentences, emphasize speed, accuracy, ease)

**baselineHours**: Typical hours per occurrence (realistic estimate based on role/industry)

**aiEnabledHours**: Reduced hours with AI assistance (typically 40-80% faster)

**frequency**: "Week", "Month", or "Quarter"

**occurrencesPerYear**: Annual frequency (e.g., weekly task = 52, monthly = 12)

**timeMultiplier**: Speed multiplier (e.g., 3 means 3x faster with AI)

CRITICAL REQUIREMENTS:
- Make deliverables SPECIFIC to ${jobTitle} in ${industry}
- Use industry-appropriate terminology
- Include realistic time estimates
- Reference ${companyName} to personalize
- Ensure each deliverable is DIFFERENT and covers distinct aspects of the role
- Focus on deliverables where voice AI provides clear advantages (hands-free, real-time, during physical work)

RETURN FORMAT:
Return ONLY valid JSON in this exact structure (no markdown, no extra text):

[
  {
    "id": 1,
    "title": "Deliverable name here",
    "scenario": "Scenario description...",
    "oldWay": "How it's done manually...",
    "aiVoiceWay": "How AI transforms it...",
    "baselineHours": 4.5,
    "aiEnabledHours": 1.5,
    "frequency": "Week",
    "occurrencesPerYear": 52,
    "timeMultiplier": 3
  },
  ... repeat for all 5 deliverables
]

Research and generate 5 role-specific deliverables for ${jobTitle} at ${companyName} now.`;
}

/**
 * Build prompt for generating a frustration-based deliverable
 * This creates a 6th custom deliverable from the user's biggest daily frustration
 * Uses context from the first 5 deliverables to ensure consistency and relevance
 */
function buildFrustrationDeliverablePrompt({ frustration, jobTitle, industry, companyName, hourlyRate, existingDeliverables }) {
  // Build context from first 5 deliverables
  const deliverablesContext = existingDeliverables && existingDeliverables.length > 0 ? `
EXISTING DELIVERABLES CONTEXT (First 5 Deliverables):
The user has already identified these 5 core deliverables for their role. Use this context to ensure the 6th deliverable:
- Complements (doesn't duplicate) these existing deliverables
- Uses similar structure, metrics, and question patterns
- Aligns with the role's overall workflow and priorities

${existingDeliverables.map((d, index) => `
DELIVERABLE #${index + 1}: ${d.title}
- Scenario: ${d.scenario}
- Baseline Hours: ${d.baselineHours}h per ${d.frequency}
- AI-Enabled Hours: ${d.aiEnabledHours}h
- Time Multiplier: ${d.timeMultiplier}x faster
- Annual Hours Freed: ${d.annualHoursFreed}h
- Payroll Freed: $${d.payrollFreed}
${d.additionalImpactQuestions && d.additionalImpactQuestions.length > 0 ? `- Impact Questions: ${d.additionalImpactQuestions.map(q => q.question).join('; ')}` : ''}
`).join('\n---\n')}

PATTERNS TO FOLLOW:
- Match the depth and structure of the existing deliverables
- Use similar question formats for additionalImpactQuestions
- Ensure time estimates are consistent with the existing deliverables
- Reference similar success metrics and dependencies patterns
` : '';

  return `You are an expert business analyst creating a custom deliverable based on a specific daily frustration submitted by a ${jobTitle} at ${companyName}.

CONTEXT:
- Job Title: ${jobTitle}
- Industry: ${industry}
- Company: ${companyName}
- Hourly Rate: $${hourlyRate}
${deliverablesContext}

USER'S BIGGEST DAILY FRUSTRATION:
"${frustration}"

YOUR TASK:
Analyze this frustration and create a complete, actionable deliverable structure that shows how an AI voice assistant would solve this specific problem.

INSTRUCTIONS:

Generate a single deliverable that:
1. **Directly addresses** the frustration stated above
2. **Quantifies** the time and effort this frustration costs
3. **Demonstrates** how AI voice assistance specifically solves it
4. **Feels personal** - this is THEIR exact problem, not a generic one

Provide the following fields:

**title**: A specific, action-oriented title that directly addresses the frustration (e.g., "Eliminate Cross-System Information Search", "Streamline After-Hours Decision-Making")
- Make it feel like a solution to their exact pain point
- Keep it concise (3-6 words)

**scenario**: A realistic scenario describing when/why this frustration occurs (3-4 sentences)
- Reference the exact frustration they described
- Show you understand their specific pain point
- Make it feel like you're describing THEIR daily experience at ${companyName}
- Example tone: "For ${jobTitle} roles at ${companyName}, one of the most draining parts of the day is [their frustration]. This happens [frequency/context] and creates [specific pain]."

**oldWay**: How ${jobTitle} currently deals with this frustration WITHOUT AI (4-5 sentences)
- Paint a vivid picture of the manual, frustrating process
- Emphasize time waste, cognitive load, stress
- Reference ${industry} context
- Show the emotional and practical toll
- Use specific details that feel authentic to their role

**aiVoiceWay**: How an AI voice partner would ELIMINATE this frustration (4-5 sentences)
- Show dramatic transformation
- Emphasize voice-specific advantages (hands-free, real-time, conversational)
- Demonstrate how it specifically addresses their stated frustration
- Include concrete examples of interactions
- Show the emotional relief and practical benefits

**baselineHours**: Realistic estimate of hours this frustration costs per occurrence
- Consider: time spent + context switching + recovery time + rework
- Be realistic but don't underestimate hidden time costs
- Typical range: 0.5 - 8 hours per occurrence

**aiEnabledHours**: Reduced hours with AI voice assistance
- Typically 60-90% reduction for frustration-solving use cases
- Should be significantly faster but realistic

**frequency**: "Week", "Month", or "Quarter"
- Based on how often this frustration occurs
- Consider the context from their description

**occurrencesPerYear**: Annual frequency
- Weekly = 52, Monthly = 12, Quarterly = 4
- Or custom number if frustration varies

**timeMultiplier**: Speed multiplier (how much faster AI makes it)
- Calculate as: baselineHours / aiEnabledHours
- Typical range: 3x to 20x faster

**keyActivities** (array of 4-6 strings)
- Specific, actionable activities that define this frustration-solving deliverable for ${jobTitle} at ${companyName}
- Should align with the style and depth of keyActivities from the first 5 deliverables
- Focus on activities related to addressing the specific frustration
- Make them role-specific and industry-contextualized
- Example format: ["Activity related to frustration", "Supporting activity", ...]

**successMetrics** (array of 3-5 strings)
- Measurable outcomes that define success for solving this frustration
- Should match the style and format of successMetrics from the first 5 deliverables
- Include quantifiable metrics relevant to the frustration type
- Example format: ["Metric 1", "Metric 2", "Metric 3"]

**dependencies** (array of 3-4 strings)
- Critical resources, people, or systems needed to solve this frustration
- Should align with dependencies format from the first 5 deliverables
- Include team/department dependencies, system/tool access, information availability
- Example format: ["Dependency 1", "Dependency 2", "Dependency 3"]

**additionalImpactQuestions**: 2 questions that assess downstream ROI benefits from solving this frustration
- These questions help quantify additional value beyond direct time savings
- Each question should have 3-4 options with impact levels (high, medium, none)
- Questions should be specific to this frustration and feel contextually relevant
- IMPORTANT: Match the question style and structure used in the first 5 deliverables above
- Use similar impact assessment patterns (high/medium/none) as shown in existing deliverables
- Examples based on frustration type:
  * For communication issues: "Did solving this prevent team escalations or improve collaboration?"
  * For data/search issues: "Has faster access led to better decisions or prevented delays?"
  * For after-hours work: "Did eliminating this improve work-life balance or reduce burnout?"
  * For process bottlenecks: "Did this prevent a major issue (downtime, client loss, compliance risk)?"

Format for each question:
{
  "id": "q1" or "q2",
  "question": "Specific question about downstream impact...",
  "options": [
    { "value": "unique_key", "label": "Positive outcome description", "impact": "high" },
    { "value": "unique_key2", "label": "Moderate outcome description", "impact": "medium" },
    { "value": "unique_key3", "label": "Minor or pending outcome", "impact": "medium" },
    { "value": "none", "label": "No impact yet / Still measuring", "impact": "none" }
  ]
}

**didYouKnow**: Educational insight that validates the user's frustration
- This should be a compelling statistic or research finding that validates their pain point
- Make them feel understood: "You're not alone - this is a widespread challenge"
- Should be specific to their frustration type (communication, data search, after-hours work, process bottlenecks, etc.)
- Keep it conversational and impactful
- Examples by frustration type:
  * Communication issues: "68% of knowledge workers report spending 2+ hours daily on internal communication inefficiencies"
  * Data/search issues: "The average professional spends 2.5 hours per day searching for information across disconnected systems"
  * After-hours work: "74% of managers report decision-making pressure outside business hours leads to burnout"
  * Process bottlenecks: "Manual process delays cost mid-sized companies an average of $5.2M annually in lost productivity"

Format:
{
  "show": true,
  "insight": "Compelling statistic or research finding that validates their specific frustration..."
}

**valueAddedSuggestion**: Strategic reallocation guidance for hours freed from solving this frustration
- Calculate the annual hours freed: (baselineHours - aiEnabledHours) × occurrencesPerYear
- Suggest ONE high-value strategic activity that aligns with:
  1. Their role (${jobTitle})
  2. The nature of their frustration (what were they trying to accomplish?)
  3. ${industry} best practices
- The activity should feel aspirational but achievable
- Examples by frustration type:
  * Communication frustrations → "Strategic Stakeholder Relationship Building" or "Cross-Functional Initiative Leadership"
  * Data/search frustrations → "Predictive Analysis & Trend Forecasting" or "Data-Driven Strategy Development"
  * After-hours work → "Long-Term Planning & Process Improvement" or "Team Development & Mentorship"
  * Process bottlenecks → "Process Automation Strategy" or "Operational Excellence Initiatives"

Format:
{
  "hours": <calculated annual hours freed, rounded to 1 decimal>,
  "activity": "Specific Strategic Activity Name",
  "description": "2-3 sentence description of what this activity involves and why it's valuable for ${jobTitle} in ${industry}",
  "expectedImpact": "Specific measurable outcome (e.g., '15-25% improvement in strategic decision quality' or '20-30% faster market response time')"
}

CRITICAL REQUIREMENTS:
- This deliverable must feel CUSTOM-BUILT for this specific frustration
- Reference "${companyName}" 2-3 times in scenario + oldWay + aiVoiceWay
- Use ${industry}-appropriate terminology
- Make time estimates realistic but show significant impact
- The user should read this and think "They get it - this is exactly my problem"
- Focus on how VOICE AI specifically helps (not just any AI)
- The 2 additional impact questions should assess real downstream benefits specific to their frustration
- Ensure consistency with the first 5 deliverables in terms of:
  * Time estimate ranges (baselineHours should align with existing deliverables)
  * Question structure and impact assessment patterns
  * Success metrics style and dependencies format
  * Overall depth and detail level
- The deliverable should complement, not duplicate, the existing 5 deliverables

RETURN FORMAT:
Return ONLY valid JSON in this exact structure (no markdown, no extra text):

{
  "id": 6,
  "title": "Frustration-solving title here",
  "category": "custom-frustration",
  "scenario": "Scenario description...",
  "oldWay": "How they struggle with it now...",
  "aiVoiceWay": "How AI voice eliminates the frustration...",
  "baselineHours": 2.5,
  "aiEnabledHours": 0.3,
  "frequency": "Week",
  "occurrencesPerYear": 52,
  "timeMultiplier": 8,
  "keyActivities": ["Activity 1", "Activity 2", "Activity 3", "Activity 4"],
  "successMetrics": ["Metric 1", "Metric 2", "Metric 3"],
  "dependencies": ["Dependency 1", "Dependency 2", "Dependency 3"],
  "additionalImpactQuestions": [
    {
      "id": "q1",
      "question": "First impact question...",
      "options": [
        { "value": "option1", "label": "High impact outcome", "impact": "high" },
        { "value": "option2", "label": "Medium impact outcome", "impact": "medium" },
        { "value": "option3", "label": "Minor outcome", "impact": "medium" },
        { "value": "none", "label": "No impact yet", "impact": "none" }
      ]
    },
    {
      "id": "q2",
      "question": "Second impact question...",
      "options": [
        { "value": "option1", "label": "High impact outcome", "impact": "high" },
        { "value": "option2", "label": "Medium impact outcome", "impact": "medium" },
        { "value": "option3", "label": "Minor outcome", "impact": "medium" },
        { "value": "none", "label": "No impact yet", "impact": "none" }
      ]
    }
  ],
  "didYouKnow": {
    "show": true,
    "insight": "Compelling statistic or research finding that validates their specific frustration..."
  },
  "valueAddedSuggestion": {
    "hours": 114.4,
    "activity": "Strategic Activity Name aligned with their role and frustration",
    "description": "2-3 sentence description of what this involves and why it's valuable for this specific role in this industry...",
    "expectedImpact": "15-25% improvement in [relevant metric]"
  }
}

Analyze the frustration and generate the custom deliverable now.`;
}

/**
 * Generate a frustration-based deliverable using Claude API
 * This creates a 6th deliverable from the user's biggest daily frustration
 * Uses context from the first 5 deliverables to ensure consistency
 */
async function generateFrustrationDeliverable({ frustration, jobTitle, industry, companyName, hourlyRate, existingDeliverables }) {
  try {
    console.log(`💡 Generating custom deliverable from frustration: "${frustration.substring(0, 50)}..."`);
    console.log(`📊 Using context from ${existingDeliverables?.length || 0} existing deliverables`);

    const prompt = buildFrustrationDeliverablePrompt({
      frustration,
      jobTitle,
      industry,
      companyName,
      hourlyRate,
      existingDeliverables
    });

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseText = message.content[0].text;

    // Parse JSON response
    let deliverable;
    try {
      const cleanedResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      deliverable = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse frustration deliverable JSON:', parseError);
      throw new Error('Invalid JSON response for frustration deliverable');
    }

    // Calculate derived metrics
    const annualHoursFreed = (deliverable.baselineHours - deliverable.aiEnabledHours) * deliverable.occurrencesPerYear;
    const payrollFreed = annualHoursFreed * hourlyRate;

    console.log(`✅ Custom frustration deliverable generated: "${deliverable.title}"`);

    return {
      ...deliverable,
      annualHoursFreed: Math.round(annualHoursFreed * 10) / 10,
      payrollFreed: Math.round(payrollFreed)
    };

  } catch (error) {
    console.error('Error generating frustration deliverable:', error);
    throw error;
  }
}

module.exports = router;
