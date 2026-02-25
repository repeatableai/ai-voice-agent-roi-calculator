import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Clock, DollarSign, Zap, Brain, CheckCircle, ArrowRight, Target, Lightbulb, MessageCircle, ChevronDown, ChevronUp, Save, Check, FileText } from 'lucide-react';
import { getDeliverablesForRole, ROLE_DELIVERABLES } from './data/roleDeliverables';
import { getHaradaMatrixForRole } from './data/roleHaradaMatrices';
import HaradaMatrix from './components/HaradaMatrix';
import DeliverableModal from './components/DeliverableModal';

const JOB_ROLES = [
  'Operations Manager - Manufacturing',
  'Sales Development Representative',
  'Customer Success Manager',
  'Software Engineer',
  'Marketing Manager',
  'HR Manager',
  'Financial Analyst',
  'Project Manager',
  'Account Executive',
  'Product Manager',
  'Supply Chain Manager',
  'Quality Assurance Manager',
  'IT Support Specialist',
  'Business Development Manager',
  'Executive Assistant',
  'Other'
];

const INDUSTRIES = [
  'Manufacturing',
  'Technology',
  'Healthcare',
  'Financial Services',
  'Retail',
  'Professional Services',
  'Education',
  'Logistics & Transportation',
  'Hospitality',
  'Other'
];

const COMPANY_SIZES = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1000+ employees'
];

export default function VoiceROICalculator() {
  const [currentStep, setCurrentStep] = useState('input');
  const [formData, setFormData] = useState({
    jobTitle: '',
    industry: '',
    companySize: '',
    companyName: '',
    companyWebsite: '',
    customRole: '',
    customIndustry: '',
    biggestFrustration: '',
    salaryType: 'Annual Salary',
    salaryAmount: ''
  });
  const [companyContext, setCompanyContext] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAnalysisId, setSavedAnalysisId] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    block2: false,
    block3: false
  });
  const [additionalImpactAnswers, setAdditionalImpactAnswers] = useState({});
  const [customDeliverables, setCustomDeliverables] = useState([
    { id: 1, title: '', baselineHours: '', frequency: 'daily', occurrencesPerYear: '', oldWay: '', aiVoiceWay: '' }
  ]);
  const [showImplementationDetails, setShowImplementationDetails] = useState(false);
  const [selectedDeliverable, setSelectedDeliverable] = useState(null);
  const [selectedDeliverableIndex, setSelectedDeliverableIndex] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDeliverableClick = (deliverable, index) => {
    setSelectedDeliverable(deliverable);
    setSelectedDeliverableIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedDeliverable(null);
    setSelectedDeliverableIndex(null);
  };

  const handleCustomDeliverableChange = (id, field, value) => {
    setCustomDeliverables(prev => prev.map(d =>
      d.id === id ? { ...d, [field]: value } : d
    ));
  };

  const addCustomDeliverable = () => {
    if (customDeliverables.length < 5) {
      setCustomDeliverables(prev => [...prev, {
        id: prev.length + 1,
        title: '',
        baselineHours: '',
        frequency: 'daily',
        occurrencesPerYear: '',
        oldWay: '',
        aiVoiceWay: ''
      }]);
    }
  };

  const removeCustomDeliverable = (id) => {
    if (customDeliverables.length > 1) {
      setCustomDeliverables(prev => prev.filter(d => d.id !== id));
    }
  };

  const generateCustomDeliverables = (hourlyRate) => {
    return customDeliverables
      .filter(d => d.title && d.baselineHours && d.occurrencesPerYear)
      .map(d => {
        const baselineHours = parseFloat(d.baselineHours);
        const aiEnabledHours = baselineHours / 8; // Conservative 8x multiplier
        const occurrences = parseInt(d.occurrencesPerYear);
        const annualHoursFreed = (baselineHours - aiEnabledHours) * occurrences;

        return {
          id: d.id,
          title: d.title,
          category: 'top5',
          baselineHours: baselineHours,
          aiEnabledHours: aiEnabledHours,
          frequency: d.frequency,
          occurrencesPerYear: occurrences,
          timeMultiplier: 8.0,
          annualHoursFreed: annualHoursFreed,
          payrollFreed: annualHoursFreed * hourlyRate,
          scenario: `A typical ${d.title.toLowerCase()} situation in your role`,
          oldWay: d.oldWay || 'Traditional manual approach requiring significant time and effort',
          aiVoiceWay: d.aiVoiceWay || `Your AI voice partner analyzes the situation, provides instant guidance, and handles the heavy lifting while you focus on decisions. Completed in minutes instead of hours.`,
          didYouKnow: {
            show: false,
            insight: ''
          },
          valueAddedSuggestion: {
            hours: annualHoursFreed * 0.85,
            activity: 'Strategic Initiative Leadership',
            description: 'Reallocate freed time to high-impact strategic projects',
            expectedImpact: 'Accelerates career progression and organizational impact'
          },
          additionalImpactQuestions: []
        };
      });
  };

  const calculateHourlyRate = () => {
    const amount = parseFloat(formData.salaryAmount);
    if (isNaN(amount)) return 75;
    return formData.salaryType === 'Annual Salary' ? amount / 2080 : amount;
  };

  const getImplementationCost = (companySize) => {
    const costs = {
      '1-10 employees': 25000,
      '11-50 employees': 40000,
      '51-200 employees': 75000,
      '201-500 employees': 125000,
      '501-1000 employees': 200000,
      '1000+ employees': 300000
    };
    return costs[companySize] || 75000;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const generateDeliverables = async (jobTitle, industry, hourlyRate) => {
    // Check if user has actually filled out custom deliverable fields
    const hasCustomDeliverables = customDeliverables.some(
      d => d.title && d.title.trim() !== '' &&
           d.baselineHours && d.baselineHours !== '' &&
           d.occurrencesPerYear && d.occurrencesPerYear !== ''
    );

    // Only use custom deliverables if the user manually filled them out
    if (formData.jobTitle === 'Other' && hasCustomDeliverables) {
      console.log('📝 Using manually filled custom deliverables');
      return generateCustomDeliverables(hourlyRate);
    }

    // Check if role is mapped in predefined list
    const isMappedRole = ROLE_DELIVERABLES[jobTitle] !== undefined;

    if (isMappedRole) {
      // Use predefined deliverables for mapped roles (fast, consistent)
      console.log(`📚 Using predefined deliverables for: "${jobTitle}"`);
      return getDeliverablesForRole(jobTitle, hourlyRate);
    } else {
      // Dynamic research for unmapped roles
      console.log(`🔍 Researching deliverables dynamically for: "${jobTitle}" in "${industry}"`);

      try {
        // Use relative URL when served by backend (same origin), or VITE_API_URL if set
      const apiUrl = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${apiUrl}/api/aiva/research-role-deliverables`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Required for session cookies
          body: JSON.stringify({
            jobTitle,
            industry,
            companyName: formData.companyName,
            hourlyRate
          })
        });

        if (!response.ok) {
          let errorData;
          const contentType = response.headers.get('content-type');
          try {
            if (contentType && contentType.includes('application/json')) {
              errorData = await response.json();
            } else {
              const text = await response.text();
              console.error('❌ Research API returned non-JSON error:', text);
              throw new Error(`Research API failed: ${response.status} ${response.statusText}`);
            }
          } catch (parseError) {
            throw new Error(`Research API failed: ${response.status} ${response.statusText}`);
          }
          throw new Error(errorData?.error || `Research API failed: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('❌ Research API returned non-JSON response:', text.substring(0, 200));
          throw new Error('Invalid response format from research API');
        }

        const data = await response.json();
        console.log(`✅ Dynamically researched ${data.deliverables.length} deliverables for ${jobTitle}`);

        // Transform researched deliverables to match expected format
        return data.deliverables.map(d => ({
          ...d,
          category: 'top5',
          annualHoursFreed: (d.baselineHours - d.aiEnabledHours) * d.occurrencesPerYear,
          payrollFreed: ((d.baselineHours - d.aiEnabledHours) * d.occurrencesPerYear) * hourlyRate,
          didYouKnow: { show: false, insight: '' },
          valueAddedSuggestion: {
            hours: ((d.baselineHours - d.aiEnabledHours) * d.occurrencesPerYear) * 0.85,
            activity: 'Strategic Initiative Leadership',
            description: 'Reallocate freed time to high-impact strategic projects',
            expectedImpact: 'Accelerates career progression and organizational impact'
          },
          additionalImpactQuestions: []
        }));
      } catch (error) {
        console.error('❌ Dynamic research failed:', error);
        console.log('⚠️  Falling back to generic deliverables');
        // Fallback to generic deliverables
        return getDeliverablesForRole(jobTitle, hourlyRate);
      }
    }
  };

  const generateValueAddedSuggestions = (jobTitle, totalHours) => {
    if (jobTitle === 'Operations Manager - Manufacturing') {
      return [
        {
          activity: 'Strategic Process Improvement Leadership',
          hours: Math.round(totalHours * 0.3),
          description: 'Lead comprehensive lean initiatives and constraint elimination projects',
          expectedImpact: '$100K-$300K in annual cost reductions, positions you as strategic leader'
        },
        {
          activity: 'Team Capability Development & AI Enablement',
          hours: Math.round(totalHours * 0.25),
          description: 'Train team on AI workflows, creating 3-5x productivity multiplication',
          expectedImpact: 'Team becomes top-performing, reduces your firefighting by 60%'
        },
        {
          activity: 'Cross-Functional Collaboration',
          hours: Math.round(totalHours * 0.20),
          description: 'Build relationships to eliminate organizational bottlenecks',
          expectedImpact: 'Accelerates company-wide decisions 30-40%'
        },
        {
          activity: 'Innovation & Technology Pilots',
          hours: Math.round(totalHours * 0.15),
          description: 'Test emerging technologies for competitive advantage',
          expectedImpact: 'Builds reputation as forward-thinking leader'
        },
        {
          activity: 'Long-term Strategic Planning',
          hours: Math.round(totalHours * 0.10),
          description: 'Develop 3-5 year capacity plans and risk mitigation',
          expectedImpact: 'Shifts operations from reactive to proactive'
        }
      ];
    }

    return [
      {
        activity: 'Strategic Initiative Leadership',
        hours: Math.round(totalHours * 0.4),
        description: 'Lead high-impact projects with measurable business value',
        expectedImpact: 'Accelerates career progression'
      },
      {
        activity: 'Skill Development & Team Enablement',
        hours: Math.round(totalHours * 0.3),
        description: 'Develop capabilities and train others',
        expectedImpact: 'Builds high-performing teams'
      },
      {
        activity: 'Innovation & Process Improvement',
        hours: Math.round(totalHours * 0.3),
        description: 'Drive continuous improvement',
        expectedImpact: 'Creates competitive advantage'
      }
    ];
  };

  const fetchCompanyContext = async (websiteURL) => {
    if (!websiteURL) return null;

    try {
      console.log(`🔍 Fetching company context from: ${websiteURL}`);
      
      const apiUrl = import.meta.env.VITE_API_URL || '';
      
      // Try multi-page discovery first (new enhanced method)
      try {
        console.log('🌐 Attempting multi-page discovery...');
        const multiPageResponse = await fetch(`${apiUrl}/api/aiva/fetch-multi-page-context`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            websiteURL
          })
        });

        if (multiPageResponse.ok) {
          const multiPageData = await multiPageResponse.json();
          if (multiPageData.success && multiPageData.companyContext) {
            console.log('✅ Multi-page company context extracted:', {
              pagesFetched: multiPageData.companyContext.pagesFetched,
              hasCoreBusiness: !!multiPageData.companyContext.coreBusiness,
              hasTargetMarket: !!multiPageData.companyContext.targetMarket,
              companySize: multiPageData.companyContext.companySize,
              industry: multiPageData.companyContext.industry,
              hasKeyDifferentiators: !!multiPageData.companyContext.keyDifferentiators
            });
            return multiPageData.companyContext;
          }
        } else {
          console.warn('⚠️ Multi-page discovery failed, falling back to single-page extraction');
        }
      } catch (multiPageError) {
        console.warn('⚠️ Multi-page discovery error, falling back to single-page:', multiPageError);
      }

      // Fallback to single-page extraction
      console.log('📄 Falling back to single-page extraction...');
      
      // Use Jina Reader API to fetch website content (free, no API key needed)
      const jinaURL = `https://r.jina.ai/${websiteURL}`;
      const response = await fetch(jinaURL);
      const markdown = await response.text();

      console.log(`✅ Fetched ${markdown.length} chars of markdown from website`);

      // Use backend AI endpoint to intelligently extract company information
      try {
        const extractResponse = await fetch(`${apiUrl}/api/aiva/extract-company-context`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            websiteURL,
            rawMarkdown: markdown
          })
        });

        if (extractResponse.ok) {
          const extractData = await extractResponse.json();
          if (extractData.success && extractData.companyContext) {
            console.log('✅ AI-extracted company context:', {
              hasCoreBusiness: !!extractData.companyContext.coreBusiness,
              hasTargetMarket: !!extractData.companyContext.targetMarket,
              companySize: extractData.companyContext.companySize,
              industry: extractData.companyContext.industry,
              hasKeyDifferentiators: !!extractData.companyContext.keyDifferentiators
            });
            return extractData.companyContext;
          }
        } else {
          console.warn('⚠️ AI extraction failed, falling back to basic extraction');
        }
      } catch (extractError) {
        console.warn('⚠️ AI extraction error, falling back to basic extraction:', extractError);
      }

      // Fallback to basic extraction if AI extraction fails
      const context = {
        rawContent: markdown ? String(markdown).substring(0, 5000) : null, // Increased to 5000
        companySize: extractCompanySize(markdown) ? String(extractCompanySize(markdown)) : null,
        products: extractProducts(markdown) ? String(extractProducts(markdown)).substring(0, 500) : null,
        industry: extractIndustryDetails(markdown) ? String(extractIndustryDetails(markdown)).substring(0, 500) : null,
        recentNews: extractRecentNews(markdown) ? String(extractRecentNews(markdown)).substring(0, 500) : null
      };

      // Remove null values to keep object clean
      Object.keys(context).forEach(key => {
        if (context[key] === null) {
          delete context[key];
        }
      });

      // If all values are null/empty, return null
      if (Object.keys(context).length === 0) {
        return null;
      }

      console.log('✅ Using fallback extraction');
      return context;
    } catch (error) {
      console.error('❌ Failed to fetch company context:', error);
      return null;
    }
  };

  const extractCompanySize = (content) => {
    const sizePatterns = /(\d+[\+]?\s*employees?|\d+[\+]?\s*team members?|\d+[\+]?\s*people)/gi;
    const matches = content.match(sizePatterns);
    return matches ? matches[0] : null;
  };

  const extractProducts = (content) => {
    // Look for product/service mentions in first 2000 chars
    const productSection = content.substring(0, 2000);
    return productSection.match(/(?:products?|services?|solutions?)[\s\S]{0,200}/gi)?.[0] || null;
  };

  const extractIndustryDetails = (content) => {
    return content.substring(0, 500); // First 500 chars usually contain industry context
  };

  const extractRecentNews = (content) => {
    const newsPatterns = /(news|announcement|press release|recently|launched|acquired)[\s\S]{0,150}/gi;
    const matches = content.match(newsPatterns);
    return matches ? matches.slice(0, 2).join(' ') : null;
  };

  const generateAIContent = async (jobTitle, industry, companyName, companyContext, deliverables, biggestFrustration, hourlyRate) => {
    try {
      // Use relative URL when served by backend (same origin), or VITE_API_URL if set
      const apiUrl = import.meta.env.VITE_API_URL || '';

      // Sanitize companyContext before sending - remove any non-serializable data
      let sanitizedContext = null;
      if (companyContext) {
        try {
          // Include all properties from AI extraction or fallback extraction
          sanitizedContext = {
            ...(companyContext.rawContent && { rawContent: String(companyContext.rawContent).substring(0, 5000) }), // Increased to 5000
            ...(companyContext.coreBusiness && { coreBusiness: String(companyContext.coreBusiness).substring(0, 1000) }),
            ...(companyContext.targetMarket && { targetMarket: String(companyContext.targetMarket).substring(0, 500) }),
            ...(companyContext.companySize && { companySize: String(companyContext.companySize) }),
            ...(companyContext.products && { products: String(companyContext.products).substring(0, 500) }), // Legacy field
            ...(companyContext.industry && { industry: String(companyContext.industry).substring(0, 500) }),
            ...(companyContext.keyDifferentiators && { keyDifferentiators: String(companyContext.keyDifferentiators).substring(0, 500) }),
            ...(companyContext.recentNews && { recentNews: String(companyContext.recentNews).substring(0, 500) }),
            ...(companyContext.companyCulture && { companyCulture: String(companyContext.companyCulture).substring(0, 500) })
          };
          // If empty, set to null
          if (Object.keys(sanitizedContext).length === 0) {
            sanitizedContext = null;
          }
        } catch (sanitizeError) {
          console.warn('⚠️ Failed to sanitize companyContext, sending null:', sanitizeError);
          sanitizedContext = null;
        }
      }

      // Log request data for debugging
      console.log('🚀 API Request:', {
        jobTitle,
        industry,
        companyName,
        deliverableCount: deliverables.length,
        hasFrustration: !!biggestFrustration,
        hasCompanyContext: !!sanitizedContext,
        apiUrl: `${apiUrl}/api/aiva/generate-deliverable-content`
      });

      const response = await fetch(`${apiUrl}/api/aiva/generate-deliverable-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Required for session cookies
        body: JSON.stringify({
          jobTitle,
          industry,
          companyName,
          companyContext: sanitizedContext, // Use sanitized version
          biggestFrustration,
          hourlyRate,
          deliverables: deliverables.map(d => ({
            id: d.id,
            title: d.title,
            category: d.category,
            scenario: d.scenario,
            oldWay: d.oldWay,
            aiVoiceWay: d.aiVoiceWay,
            baselineHours: d.baselineHours,
            aiEnabledHours: d.aiEnabledHours,
            frequency: d.frequency,
            occurrencesPerYear: d.occurrencesPerYear,
            timeMultiplier: d.timeMultiplier,
            annualHoursFreed: d.annualHoursFreed,
            payrollFreed: d.payrollFreed
          }))
        })
      });

      // Check if response is successful
      if (!response.ok) {
        let errorData;
        const contentType = response.headers.get('content-type');
        try {
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json();
          } else {
            const text = await response.text();
            console.error('❌ API returned non-JSON error:', text);
            errorData = { error: `Server error (${response.status}): ${response.statusText}` };
          }
        } catch (parseError) {
          console.error('❌ Failed to parse error response:', parseError);
          errorData = { error: `Server error (${response.status}): ${response.statusText}` };
        }
        
        console.error('❌ API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          apiUrl: `${apiUrl}/api/aiva/generate-deliverable-content`
        });
        
        const errorMessage = errorData?.error || 'Unknown error';
        alert(`API Error (${response.status}): ${errorMessage}\n\nPlease check:\n1. Backend server is running\n2. VITE_API_URL is set correctly\n3. Check browser console for details.`);
        return [];
      }

      // Parse JSON response
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('❌ API returned non-JSON response:', text.substring(0, 200));
        alert('API Error: Server returned invalid response format.\n\nPlease check backend server configuration.');
        return [];
      }

      const data = await response.json();
      console.log('✅ API Success:', {
        receivedDeliverables: data.deliverables?.length || 0
      });
      return data.deliverables || [];
    } catch (error) {
      console.error('❌ Failed to generate AI content:', error);
      
      // Provide helpful error messages based on error type
      let errorMessage = error.message;
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'Cannot connect to backend server.\n\nPlease check:\n1. Backend server is running\n2. VITE_API_URL environment variable is set correctly\n3. CORS is configured on backend\n4. Check browser console for details.';
      } else if (error.message.includes('JSON')) {
        errorMessage = 'Invalid response from server.\n\nPlease check:\n1. Backend server is responding correctly\n2. API endpoint is correct\n3. Check browser console for details.';
      }
      
      alert(`Network Error: ${errorMessage}`);
      return [];
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);

    // Validation: Check required fields
    const jobTitle = formData.jobTitle === 'Other' ? formData.customRole : formData.jobTitle;
    const industry = formData.industry === 'Other' ? formData.customIndustry : formData.industry;

    if (!jobTitle || jobTitle.trim() === '') {
      alert('Please select or enter a job title');
      setIsAnalyzing(false);
      return;
    }

    if (!industry || industry.trim() === '') {
      alert('Please select or enter an industry');
      setIsAnalyzing(false);
      return;
    }

    if (!formData.companyName || formData.companyName.trim() === '') {
      alert('Please enter a company name');
      setIsAnalyzing(false);
      return;
    }

    if (!formData.salaryAmount || parseFloat(formData.salaryAmount) <= 0) {
      alert('Please enter a valid salary amount');
      setIsAnalyzing(false);
      return;
    }

    console.log('📋 Starting Analysis:', {
      jobTitle,
      industry,
      companyName: formData.companyName
    });

    // Step 1: Fetch company context if website URL provided
    let context = null;
    if (formData.companyWebsite) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Show "Researching company"
      context = await fetchCompanyContext(formData.companyWebsite);
      setCompanyContext(context);
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    const hourlyRate = calculateHourlyRate();
    let deliverables = await generateDeliverables(jobTitle, industry, hourlyRate, context);

    console.log('📊 Generated Deliverables:', {
      count: deliverables.length,
      titles: deliverables.map(d => d.title)
    });

    // Step 2: Generate AI content for all deliverables (including optional 6th frustration-based deliverable)
    const generatedContent = await generateAIContent(
      jobTitle,
      industry,
      formData.companyName,
      context,
      deliverables,
      formData.biggestFrustration,
      hourlyRate
    );

    // Step 3: Merge generated content with deliverables
    // Note: generatedContent may include a 6th frustration-based deliverable
    if (generatedContent && generatedContent.length > 0) {
      // If we got more deliverables back (6) than we sent (5), add the new one
      if (generatedContent.length > deliverables.length) {
        console.log('✨ 6th frustration-based deliverable received from API');
        deliverables = [...deliverables];
      }

      deliverables = generatedContent.map((generated, index) => {
        const original = deliverables.find(d => d.id === generated.id) || deliverables[index] || {};
        return {
          ...original,
          ...generated,
          keyActivities: generated?.keyActivities || original.keyActivities,
          successMetrics: generated?.successMetrics || original.successMetrics,
          dependencies: generated?.dependencies || original.dependencies,
          productivityImpact: generated?.productivityImpact || original.productivityImpact,
          emotionalImpact: generated?.emotionalImpact || original.emotionalImpact,
          businessROI: generated?.businessROI || original.businessROI,
          additionalRippleEffects: generated?.additionalRippleEffects || original.additionalRippleEffects,
          compoundingEffect: generated?.compoundingEffect || original.compoundingEffect,
          frustrationResolutionAnalysis: generated?.frustrationResolutionAnalysis || null,
          // Voice Agent Implementation Guide fields
          voiceAgentOverview: generated?.voiceAgentOverview || '',
          voiceAgentPersonality: generated?.voiceAgentPersonality || '',
          voiceAgentKnowledgeBase: generated?.voiceAgentKnowledgeBase || '',
          voiceAgentSystemPrompt: generated?.voiceAgentSystemPrompt || '',
          voiceAgentSampleConversations: generated?.voiceAgentSampleConversations || '',
          voiceAgentTrainingData: generated?.voiceAgentTrainingData || '',
          voiceAgentIntegrationGuide: generated?.voiceAgentIntegrationGuide || ''
        };
      });
    }

    // Step 4: Build dynamic Harada Matrix from AI-generated deliverables
    const haradaMatrix = {
      deliverables: deliverables.map(d => ({
        name: d.title,
        keyActivities: d.keyActivities || ['Core responsibilities', 'Stakeholder management', 'Performance optimization'],
        successMetrics: d.successMetrics || ['Output quality', 'Efficiency metrics', 'Stakeholder satisfaction'],
        dependencies: d.dependencies || ['Team collaboration', 'System access', 'Resource allocation']
      }))
    };

    const totalAnnualHoursFreed = deliverables.reduce((sum, d) => sum + d.annualHoursFreed, 0);
    const totalPayrollFreed = totalAnnualHoursFreed * hourlyRate;

    // Random payback period: 21-27 days OR 41-49 days (purely random choice)
    const range = Math.random() < 0.5 ? [21, 27] : [41, 49];
    const paybackDays = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];

    // Conservative Estimate: payroll freed × 3.3
    const conservativeEstimate = totalPayrollFreed * 3.3;

    const avgMultiplier = (deliverables.reduce((sum, d) => sum + d.timeMultiplier, 0) / deliverables.length).toFixed(1);

    // Annual Value Created for projections
    const annualValueCreated = conservativeEstimate;

    setAnalysisResults({
      jobTitle,
      industry: formData.industry,
      companySize: formData.companySize,
      companyName: formData.companyName,
      companyWebsite: formData.companyWebsite,
      companyContext: context,
      haradaMatrix: haradaMatrix,
      hourlyRate: hourlyRate.toFixed(2),
      metrics: {
        productivityMultiplier: avgMultiplier,
        annualTimeSavings: Math.round(totalAnnualHoursFreed),
        totalPayrollFreed: totalPayrollFreed,
        annualValueCreated: annualValueCreated,
        conservativeEstimate: conservativeEstimate,
        paybackDays: paybackDays
      },
      deliverables: deliverables,
      valueAddedSuggestions: generateValueAddedSuggestions(jobTitle, totalAnnualHoursFreed)
    });

    setIsAnalyzing(false);
    setCurrentStep('results');
  };

  const saveAnalysis = async () => {
    if (!analysisResults) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      
      // Validate required fields before sending
      const hourlyRateValue = parseFloat(analysisResults.hourlyRate);
      if (isNaN(hourlyRateValue) || hourlyRateValue < 0) {
        throw new Error('Invalid hourly rate. Please ensure a valid hourly rate is provided.');
      }

      if (!analysisResults.jobTitle || !analysisResults.industry || !analysisResults.companyName) {
        throw new Error('Missing required fields: job title, industry, or company name.');
      }

      if (!analysisResults.deliverables || !Array.isArray(analysisResults.deliverables)) {
        throw new Error('Analysis data is incomplete. Please regenerate the analysis.');
      }

      const requestBody = {
        title: `${analysisResults.jobTitle} - ${analysisResults.companyName}`,
        jobTitle: analysisResults.jobTitle,
        industry: analysisResults.industry,
        companyName: analysisResults.companyName,
        companyWebsite: analysisResults.companyWebsite || null,
        companySize: analysisResults.companySize || null,
        companyContext: analysisResults.companyContext || null,
        hourlyRate: hourlyRateValue,
        biggestFrustration: formData.biggestFrustration || null,
        analysisData: {
          deliverables: analysisResults.deliverables,
          haradaMatrix: analysisResults.haradaMatrix || null,
          metrics: analysisResults.metrics || {},
          valueAddedSuggestions: analysisResults.valueAddedSuggestions || []
        }
      };

      console.log('📤 Saving analysis with data:', {
        jobTitle: requestBody.jobTitle,
        industry: requestBody.industry,
        companyName: requestBody.companyName,
        hourlyRate: requestBody.hourlyRate,
        hasDeliverables: requestBody.analysisData.deliverables?.length > 0
      });
      
      const response = await fetch(`${apiUrl}/api/aiva/analyses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include session cookies
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Handle validation errors array
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const errorMessages = errorData.errors.map(err => 
            `${err.param || 'Field'}: ${err.msg || 'Invalid value'}`
          ).join(', ');
          throw new Error(`Validation failed: ${errorMessages}`);
        }
        throw new Error(errorData.error || `Failed to save analysis (${response.status})`);
      }

      const data = await response.json();
      setSavedAnalysisId(data.analysis?.id);
      console.log('✅ Analysis saved:', data.analysis?.id);

    } catch (error) {
      console.error('❌ Error saving analysis:', error);
      setSaveError(error.message || 'Failed to save analysis');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdditionalImpactAnswer = (deliverableId, questionId, answer) => {
    setAdditionalImpactAnswers(prev => ({
      ...prev,
      [deliverableId]: {
        ...prev[deliverableId],
        [questionId]: answer
      }
    }));
  };

  const generateAdditionalImpactNarrative = (deliverable, answers) => {
    if (!answers || Object.keys(answers).length === 0) return null;

    const impacts = Object.values(answers);
    const highImpacts = impacts.filter(a => a.impact === 'high');
    const mediumImpacts = impacts.filter(a => a.impact === 'medium');

    if (highImpacts.length === 0 && mediumImpacts.length === 0) {
      return {
        level: 'low',
        narrative: `Your ${deliverable.title.toLowerCase()} delivered the ${formatCurrency(deliverable.payrollFreed)} direct payroll freed value.`
      };
    }

    let narrative = `**Downstream Impact Beyond ${formatCurrency(deliverable.payrollFreed)} Direct Value:**\n\n`;
    let estimatedValue = { low: 0, high: 0 };

    highImpacts.forEach(impact => {
      if (impact.value === 'prevented_downtime') {
        narrative += `**Downtime Prevention:** By addressing this proactively, you kept production running. Unplanned downtime costs $10K-$50K per hour. Preventing even one 4-6 hour event represents $40K-$300K in preserved production value.\n\n`;
        estimatedValue.low += 40000;
        estimatedValue.high += 300000;
      }
      if (impact.value === 'prevented_revenue_loss' || impact.value === 'saved_account') {
        narrative += `**Revenue Protection:** Fast resolution prevented customer churn or revenue loss. Enterprise customer churn typically costs $50K-$500K in lifetime value.\n\n`;
        estimatedValue.low += 50000;
        estimatedValue.high += 500000;
      }
      if (impact.value === 'prevented_overruns' || impact.value === 'better_roi') {
        narrative += `**Cost Avoidance:** Proactive management prevented budget overruns or optimized spend. Typical impact: $25K-$150K in avoided costs annually.\n\n`;
        estimatedValue.low += 25000;
        estimatedValue.high += 150000;
      }
      if (impact.value === 'higher_connect' || impact.value === 'faster_fills') {
        narrative += `**Accelerated Outcomes:** Faster execution led to more wins, faster closes, or quicker placements. Revenue acceleration worth $30K-$200K annually.\n\n`;
        estimatedValue.low += 30000;
        estimatedValue.high += 200000;
      }
      if (impact.value === 'prevented_exec_escalation') {
        narrative += `**Executive Protection:** Preventing executive-level escalations protects leadership time and company reputation. Each prevented escalation saves $10K-$50K in emergency discounts, credits, and executive time.\n\n`;
        estimatedValue.low += 10000;
        estimatedValue.high += 50000;
      }
      if (impact.value === 'became_standard') {
        narrative += `**Organizational Multiplier:** Your process became the new standard, multiplying impact across your entire team. Team-wide adoption creates 5-10x value multiplication.\n\n`;
        estimatedValue.low += 50000;
        estimatedValue.high += 250000;
      }
      if (impact.value === 'prevented_lawsuit') {
        narrative += `**Legal Risk Mitigation:** Fast, proper response prevented potential lawsuit and legal exposure. Employment lawsuits cost $125K-$500K in legal fees and settlements.\n\n`;
        estimatedValue.low += 125000;
        estimatedValue.high += 500000;
      }
      if (impact.value === 'prevented_waste') {
        narrative += `**Budget Protection:** Catching underperforming campaigns early prevented wasted marketing spend. Typical waste from unoptimized campaigns: $10K-$50K monthly.\n\n`;
        estimatedValue.low += 40000;
        estimatedValue.high += 200000;
      }
      if (impact.value === 'prevented_delay' || impact.value === 'unblocked_team') {
        narrative += `**Project Velocity:** Preventing delays or unblocking teams preserves project value and accelerates time-to-market. Each week of delay typically costs $25K-$75K in lost opportunity.\n\n`;
        estimatedValue.low += 25000;
        estimatedValue.high += 75000;
      }
      if (impact.value === 'won_deal' || impact.value === 'advanced_deal') {
        narrative += `**Revenue Impact:** Winning or advancing deals faster directly drives revenue. Enterprise deals won through better positioning represent $100K-$500K in closed revenue.\n\n`;
        estimatedValue.low += 100000;
        estimatedValue.high += 500000;
      }
    });

    if (mediumImpacts.length > 0 && highImpacts.length === 0) {
      narrative += `**Incremental Improvements:** Multiple smaller improvements that compound over time.\n\n`;
      estimatedValue.low = 15000;
      estimatedValue.high = 75000;
    }

    if (estimatedValue.low > 0) {
      narrative += `\n**Conservative downstream value estimate: ${formatCurrency(estimatedValue.low)} - ${formatCurrency(estimatedValue.high)} annually**`;
    } else {
      narrative += `\n**Estimated downstream value: $50K-$200K annually**`;
    }

    return {
      level: highImpacts.length > 0 ? 'high' : 'medium',
      narrative,
      estimatedLow: estimatedValue.low || 50000,
      estimatedHigh: estimatedValue.high || 200000
    };
  };

  const DeliverableCard = ({ deliverable, index }) => {
    const [showAdditionalImpact, setShowAdditionalImpact] = useState(false);
    const answers = additionalImpactAnswers[deliverable.id] || {};
    const additionalImpact = generateAdditionalImpactNarrative(deliverable, answers);

    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <div className="flex items-start mb-4">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold mr-4 flex-shrink-0 text-lg">
            {index + 1}
          </span>
          <h3 className="text-2xl font-bold text-gray-900">{deliverable.title}</h3>
        </div>

        <div className="pl-14 space-y-4">
          <div>
            <p className="text-sm font-semibold text-purple-600 mb-2">THE SITUATION:</p>
            <p className="text-gray-700">{deliverable.scenario}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">THE OLD WAY:</p>
            <p className="text-gray-600">{deliverable.oldWay}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-blue-600 mb-2">THE AI VOICE WAY:</p>
            <p className="text-gray-700">{deliverable.aiVoiceWay}</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm font-bold text-green-900 mb-2">THE IMMEDIATE WIN:</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-green-700 font-semibold">Time Freed:</p>
                <p className="text-green-900 font-bold">{(deliverable.baselineHours - deliverable.aiEnabledHours).toFixed(2)}h per {deliverable.frequency}</p>
              </div>
              <div>
                <p className="text-green-700 font-semibold">Payroll Freed:</p>
                <p className="text-green-900 font-bold">{formatCurrency(deliverable.payrollFreed)}/yr</p>
              </div>
              <div>
                <p className="text-green-700 font-semibold">Multiplier:</p>
                <p className="text-green-900 font-bold">{deliverable.timeMultiplier}x faster</p>
              </div>
            </div>
          </div>

          {deliverable.didYouKnow?.show && (
            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
              <p className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2" />
                DID YOU KNOW?
              </p>
              <p className="text-sm text-blue-800">{deliverable.didYouKnow.insight}</p>
            </div>
          )}

          {deliverable.additionalImpactQuestions?.length > 0 && (
            <div className="border-t pt-4">
              <button
                onClick={() => setShowAdditionalImpact(!showAdditionalImpact)}
                className="w-full flex items-center justify-between text-purple-600 font-semibold hover:text-purple-700 mb-3"
              >
                <span className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Calculate Additional Downstream Impact
                </span>
                {showAdditionalImpact ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {showAdditionalImpact && (
                <div className="space-y-4 bg-purple-50 rounded-lg p-4">
                  {deliverable.additionalImpactQuestions.map((question) => (
                    <div key={question.id}>
                      <p className="font-semibold text-gray-800 mb-2 text-sm">{question.question}</p>
                      <div className="space-y-2">
                        {question.options.map((option) => (
                          <label
                            key={option.value}
                            className={`flex items-start p-3 rounded-lg cursor-pointer ${
                              answers[question.id]?.value === option.value
                                ? 'bg-purple-200 border-2 border-purple-500'
                                : 'bg-white border-2 border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`${deliverable.id}-${question.id}`}
                              checked={answers[question.id]?.value === option.value}
                              onChange={() => handleAdditionalImpactAnswer(deliverable.id, question.id, option)}
                              className="mt-1 mr-3"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  {additionalImpact && (
                    <div className={`mt-4 p-4 rounded-lg ${
                      additionalImpact.level === 'high' ? 'bg-green-100 border-l-4 border-green-500' : 'bg-gray-100'
                    }`}>
                      <p className="text-sm text-gray-800 whitespace-pre-line">{additionalImpact.narrative}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {deliverable.valueAddedSuggestion && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
              <p className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                <Target className="w-4 h-4 mr-2 text-purple-600" />
                REALLOCATE {deliverable.valueAddedSuggestion.hours} HOURS TO:
              </p>
              <p className="text-sm font-semibold text-purple-900 mb-2">{deliverable.valueAddedSuggestion.activity}</p>
              <p className="text-sm text-gray-700 mb-2">{deliverable.valueAddedSuggestion.description}</p>
              <p className="text-sm font-semibold text-green-700">🚀 {deliverable.valueAddedSuggestion.expectedImpact}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {formData.companyWebsite ? `Analyzing ${formData.companyName}...` : 'Analyzing Your Role...'}
          </h2>
          <div className="space-y-3 text-gray-600">
            {formData.companyWebsite && (
              <p className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Researching {formData.companyWebsite}
              </p>
            )}
            {formData.companyWebsite && (
              <p className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Understanding your business model
              </p>
            )}
            <p className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Identifying cognitive load patterns
            </p>
            <p className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Mapping voice intervention points
            </p>
            <p className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Calculating productivity multipliers
            </p>
            <p className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Generating personalized analysis for {formData.companyName}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'results' && analysisResults) {
    // Include ALL deliverables (top5 + custom-frustration if present)
    const allDeliverables = analysisResults.deliverables;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your AI Voice Impact Report</h1>
            <p className="text-xl text-gray-600 mb-4">{analysisResults.jobTitle} • {analysisResults.industry} • ${analysisResults.hourlyRate}/hr</p>
            
            {/* Save Analysis Button */}
            <div className="flex justify-center gap-4 flex-wrap">
              {!savedAnalysisId ? (
                <button
                  onClick={saveAnalysis}
                  disabled={isSaving}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                    isSaving
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? 'Saving...' : 'Save Analysis'}
                </button>
              ) : (
                <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-100 text-green-800 font-semibold">
                  <Check className="w-5 h-5" />
                  Analysis Saved
                </div>
              )}
              <button
                onClick={() => navigate('/analyses')}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold transition-colors"
              >
                <FileText className="w-5 h-5" />
                View All Analyses
              </button>
              {saveError && (
                <div className="text-red-600 text-sm mt-2 w-full text-center">{saveError}</div>
              )}
            </div>
          </div>

          {analysisResults.companyContext && (
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-600" />
                Analysis Personalized for {analysisResults.companyName}
              </h3>
              <div className="text-sm text-gray-700 space-y-1">
                {analysisResults.companyContext.companySize && (
                  <p><strong>Team Size:</strong> ~{analysisResults.companyContext.companySize}</p>
                )}
                {analysisResults.companyContext.products && (
                  <p><strong>Focus:</strong> {
                    Array.isArray(analysisResults.companyContext.products)
                      ? analysisResults.companyContext.products.join(', ').substring(0, 150)
                      : String(analysisResults.companyContext.products).substring(0, 150)
                  }...</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  This analysis incorporates insights from your website to make scenarios more realistic and contextually relevant to {analysisResults.companyName}.
                </p>
              </div>
            </div>
          )}

          <HaradaMatrix
            haradaData={analysisResults.haradaMatrix}
            companyName={analysisResults.companyName}
            jobTitle={analysisResults.jobTitle}
            deliverables={allDeliverables}
            onDeliverableClick={handleDeliverableClick}
          />

          <DeliverableModal
            deliverable={selectedDeliverable}
            index={selectedDeliverableIndex}
            totalDeliverables={allDeliverables.length}
            isOpen={selectedDeliverable !== null}
            onClose={handleCloseModal}
            formatCurrency={formatCurrency}
            additionalImpactAnswers={additionalImpactAnswers}
            handleAdditionalImpactAnswer={handleAdditionalImpactAnswer}
            generateAdditionalImpactNarrative={generateAdditionalImpactNarrative}
            companyName={analysisResults.companyName}
            jobTitle={analysisResults.jobTitle}
            industry={analysisResults.industry}
          />

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8" />
                <span className="text-3xl font-bold">{analysisResults.metrics.productivityMultiplier}x</span>
              </div>
              <p className="text-blue-100 text-sm">Productivity Multiplier</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8" />
                <span className="text-3xl font-bold">{analysisResults.metrics.annualTimeSavings}</span>
              </div>
              <p className="text-purple-100 text-sm">Hours Freed Annually</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8" />
                <span className="text-2xl font-bold">{formatCurrency(analysisResults.metrics.totalPayrollFreed)}</span>
              </div>
              <p className="text-green-100 text-sm">Payroll Freed to Reallocate</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-8 h-8" />
                <span className="text-2xl font-bold">{formatCurrency(analysisResults.metrics.conservativeEstimate)}</span>
              </div>
              <p className="text-orange-100 text-sm">Per {analysisResults.jobTitle} × Headcount ROI</p>
              <p className="text-orange-200 text-xs mt-1">Conservative annual estimate</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <button
              onClick={() => setShowImplementationDetails(!showImplementationDetails)}
              className="w-full flex items-center justify-between text-gray-900 hover:text-blue-600 transition-colors"
            >
              <div className="flex items-center">
                <DollarSign className="w-6 h-6 mr-3 text-blue-600" />
                <span className="text-xl font-bold">Implementation & Payback Analysis</span>
              </div>
              {showImplementationDetails ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </button>

            {showImplementationDetails && (
              <div className="mt-6 space-y-6">
                <p className="text-gray-600">
                  Here's the business case for implementing AI voice partners, including investment requirements and payback timeline.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Time to Implementation</p>
                    <p className="text-2xl font-bold text-gray-900">1-2 weeks</p>
                    <p className="text-xs text-gray-500 mt-1">Setup & go-live timeline</p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Payback Period</p>
                    <p className="text-2xl font-bold text-blue-600">{analysisResults.metrics.paybackDays} days</p>
                    <p className="text-xs text-gray-500 mt-1">Time to break even</p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Minimum Conservative Estimate</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(analysisResults.metrics.conservativeEstimate)}</p>
                    <p className="text-xs text-gray-500 mt-1">First year value return</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-3">Progressive Value Timeline</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">90-Day Value:</span>
                      <span className="font-bold text-blue-600">{formatCurrency((analysisResults.metrics.annualValueCreated / 365) * 90)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">6-Month Value:</span>
                      <span className="font-bold text-indigo-600">{formatCurrency(analysisResults.metrics.annualValueCreated * 0.5)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-300 pt-2">
                      <span className="text-gray-900 font-semibold">1-Year Value:</span>
                      <span className="font-bold text-green-600">{formatCurrency(analysisResults.metrics.annualValueCreated)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t-2 border-purple-300 pt-3 mt-2">
                      <span className="text-gray-900 font-bold">3-Year Total Value:</span>
                      <span className="font-bold text-purple-600 text-lg">{formatCurrency(analysisResults.metrics.annualValueCreated * 3)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p className="mb-2"><strong>What's included in implementation:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>AI voice platform setup and integration</li>
                    <li>Custom voice partner development for your role</li>
                    <li>Team training and onboarding</li>
                    <li>Knowledge base integration with your systems</li>
                    <li>6 months of optimization and support</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <Target className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Freed Time Portfolio</h2>
              <p className="text-xl text-gray-700 mb-4">{analysisResults.valueAddedSuggestions.reduce((sum, s) => sum + s.hours, 0)} hours freed annually</p>

              <div className="grid grid-cols-3 gap-4 mt-6 max-w-3xl mx-auto">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{Math.round(analysisResults.valueAddedSuggestions.reduce((sum, s) => sum + s.hours, 0) / 40)}</div>
                  <div className="text-sm text-gray-600">Full Work Weeks</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(analysisResults.valueAddedSuggestions.reduce((sum, s) => sum + s.hours, 0) * analysisResults.hourlyRate)}</div>
                  <div className="text-sm text-gray-600">Value to Reallocate</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">{Math.round((analysisResults.valueAddedSuggestions.reduce((sum, s) => sum + s.hours, 0) / 2080) * 100)}%</div>
                  <div className="text-sm text-gray-600">of Your Year Freed</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">💡 The Real Value: What You Can Do With This Time</h3>
              <p className="text-gray-700 mb-4">
                Instead of spending {analysisResults.valueAddedSuggestions.reduce((sum, s) => sum + s.hours, 0)} hours/year on repetitive tasks,
                you can reallocate this time to high-impact activities that accelerate your career and drive organizational results:
              </p>
            </div>

            <div className="space-y-6">
              {analysisResults.valueAddedSuggestions.map((suggestion, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border-l-4 border-purple-500">
                  <div className="flex justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{index + 1}. {suggestion.activity}</h3>
                    <span className="text-lg font-bold text-purple-600">{suggestion.hours}h/year</span>
                  </div>
                  <p className="text-gray-700 mb-3">{suggestion.description}</p>
                  <div className="bg-green-50 rounded-lg p-3 mb-3">
                    <p className="text-sm font-semibold text-green-800">🚀 {suggestion.expectedImpact}</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>That's ~{Math.round(suggestion.hours / 52)} hours per week you can spend on this</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">🎯 Bottom Line</h3>
              <p className="text-gray-800">
                By freeing {analysisResults.valueAddedSuggestions.reduce((sum, s) => sum + s.hours, 0)} hours annually from repetitive work,
                you shift from being <strong>tactically busy</strong> to being <strong>strategically impactful</strong>.
                This is how top performers in your role operate—they don't work harder, they work on higher-leverage activities.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Build Your AI Voice Partners?</h2>
            <p className="text-xl text-gray-600 mb-8">You've seen the {formatCurrency(analysisResults.metrics.totalPayrollFreed)} opportunity</p>

            <button
              onClick={() => {
                setCurrentStep('input');
                setAnalysisResults(null);
                setAdditionalImpactAnswers({});
                setShowImplementationDetails(false);
                setCustomDeliverables([
                  { id: 1, title: '', baselineHours: '', frequency: 'daily', occurrencesPerYear: '', oldWay: '', aiVoiceWay: '' }
                ]);
                setFormData({
                  jobTitle: '',
                  industry: '',
                  companySize: '',
                  companyName: '',
                  companyWebsite: '',
                  customRole: '',
                  customIndustry: '',
                  biggestFrustration: '',
                  salaryType: 'Annual Salary',
                  salaryAmount: ''
                });
                setCompanyContext(null);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700"
            >
              Analyze Another Role
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
            <Zap className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Voice Partner Impact Calculator</h1>
          <p className="text-xl text-gray-600">Discover how AI voice partners dramatically increase productivity—guaranteed</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Your Job Title</label>
            <select
              value={formData.jobTitle}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select your role...</option>
              {JOB_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
          </div>

          {formData.jobTitle === 'Other' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Specify your role</label>
              <input
                type="text"
                value={formData.customRole}
                onChange={(e) => handleInputChange('customRole', e.target.value)}
                placeholder="e.g., Data Analyst, Operations Coordinator..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
            <select
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select industry...</option>
              {INDUSTRIES.map(industry => <option key={industry} value={industry}>{industry}</option>)}
            </select>
          </div>

          {formData.industry === 'Other' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Specify your industry</label>
              <input
                type="text"
                value={formData.customIndustry}
                onChange={(e) => handleInputChange('customIndustry', e.target.value)}
                placeholder="e.g., Real Estate, Construction, Agriculture..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="e.g., Acme Manufacturing"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Website (Optional but recommended for personalized analysis)</label>
            <input
              type="url"
              value={formData.companyWebsite}
              onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
              placeholder="https://www.yourcompany.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">We'll research your company to personalize the analysis. Your data is not stored.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Size</label>
            <select
              value={formData.companySize}
              onChange={(e) => handleInputChange('companySize', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select size...</option>
              {COMPANY_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
              <select
                value={formData.salaryType}
                onChange={(e) => handleInputChange('salaryType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Annual Salary">Annual Salary</option>
                <option value="Hourly Rate">Hourly Rate</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {formData.salaryType === 'Annual Salary' ? 'Annual Salary' : 'Hourly Rate'}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500">$</span>
                <input
                  type="number"
                  value={formData.salaryAmount}
                  onChange={(e) => handleInputChange('salaryAmount', e.target.value)}
                  placeholder={formData.salaryType === 'Annual Salary' ? '85000' : '45'}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Biggest daily frustration? (Optional)</label>
            <textarea
              value={formData.biggestFrustration}
              onChange={(e) => handleInputChange('biggestFrustration', e.target.value)}
              placeholder="e.g., Searching for information across systems..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!formData.jobTitle || !formData.industry || !formData.companySize || !formData.companyName || !formData.salaryAmount}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <span>Calculate My AI Voice Impact</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-blue-600" />
            Why AI Voice? Why Now?
          </h3>
          <p className="text-gray-700 text-sm">
            AI voice agents have sub-200ms response time, understand emotional nuance, handle interruptions naturally, and reason in real-time. Unlike text-based AI, voice works while you're moving and thinking—cognitive augmentation without disruption.
          </p>
        </div>
      </div>
    </div>
  );
}
