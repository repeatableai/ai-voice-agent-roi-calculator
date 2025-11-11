// AIVA ROI Calculator - Deliverable Content Generation Route
// Generates personalized deliverable content using Claude API

const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');

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
 */
router.post('/generate-deliverable-content', async (req, res) => {
  try {
    const {
      jobTitle,
      industry,
      companyName,
      companyContext,
      deliverables
    } = req.body;

    // Validate required fields
    if (!jobTitle || !industry || !companyName || !deliverables || deliverables.length === 0) {
      return res.status(400).json({
        error: 'Missing required fields: jobTitle, industry, companyName, and deliverables are required'
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

    console.log(`🚀 Generating content in parallel for ${deliverables.length} deliverables...`);

    // Generate each deliverable in parallel for speed
    const generatePromises = deliverables.map((deliverable, index) =>
      generateSingleDeliverable({
        deliverable,
        index,
        jobTitle,
        industry,
        companyName,
        companyContext
      })
    );

    // Wait for all deliverables to generate in parallel
    const generatedDeliverables = await Promise.all(generatePromises);

    console.log(`✅ All ${deliverables.length} deliverables generated successfully`);

    // Return generated content
    res.json({
      success: true,
      deliverables: generatedDeliverables
    });

  } catch (error) {
    console.error('Error generating deliverable content:', error);
    res.status(500).json({
      error: 'Failed to generate deliverable content',
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
    console.log(`📝 Generating deliverable #${index + 1}: ${deliverable.title}`);

    const prompt = buildSingleDeliverablePrompt({
      deliverable,
      index,
      jobTitle,
      industry,
      companyName,
      companyContext
    });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
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

  return `You are generating a comprehensive, emotionally resonant deliverable analysis for an AI Voice Partner ROI Calculator lead magnet application.

Your task is to generate missing content sections for ONE specific deliverable for a ${jobTitle} at ${companyName}, making the analysis feel custom-built for them.

${contextSummary}

ROLE BEING ANALYZED:
- Job Title: ${jobTitle}
- Industry: ${industry}

DELIVERABLE TO ANALYZE:
- Title: ${deliverable.title}
- Baseline Hours: ${deliverable.baselineHours} hours per ${deliverable.frequency}
- AI-Enabled Hours: ${deliverable.aiEnabledHours} hours
- Frequency: ${deliverable.frequency}
- Annual Occurrences: ${deliverable.occurrencesPerYear}
- Time Multiplier: ${deliverable.timeMultiplier}x faster
- Annual Hours Freed: ${deliverable.annualHoursFreed}
- Payroll Freed: $${deliverable.payrollFreed.toFixed(0)}

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

---

VOICE AGENT IMPLEMENTATION GUIDE SECTIONS:

Generate these 7 additional sections to enable ${companyName} to build an AI voice agent for this deliverable:

6. **voiceAgentOverview** (150-200 words)
Format as plain text with clear structure:
- Opening: "This AI voice agent is designed to handle ${deliverable.title} for ${jobTitle} roles at ${companyName}."
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
  "compoundingEffect": "full text here...",
  "voiceAgentOverview": "full text here...",
  "voiceAgentPersonality": "full text here...",
  "voiceAgentKnowledgeBase": "full text here...",
  "voiceAgentSystemPrompt": "full text here...",
  "voiceAgentSampleConversations": "full text here...",
  "voiceAgentTrainingData": "full text here...",
  "voiceAgentIntegrationGuide": "full text here..."
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
- Payroll Freed: $${d.payrollFreed.toFixed(0)}

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

module.exports = router;
