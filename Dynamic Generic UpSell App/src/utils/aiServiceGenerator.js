/**
 * AI Service Generator
 * Generates industry-specific, contextually relevant upsell services
 * Uses real Claude AI with SPIN selling methodology
 */

import { getServiceTemplatesForIndustry } from "@/data/industryServiceTemplates";
import { generateServicesWithAI, getCachedServices, cacheServices } from "@/services/anthropicService";

/**
 * Generate top 10 most relevant upsell services for a company
 * @param {string} companyName - Company name
 * @param {string} websiteUrl - Company website URL
 * @param {string} industry - Industry type (hvac, plumbing, electrical, etc.)
 * @param {string} customIndustry - Custom industry description (when "other" is selected)
 * @param {string} businessType - Business type (residential, commercial, both)
 * @param {string} companySize - Company size (1-5, 6-20, etc.)
 * @returns {Promise<Array>} - Array of 10 customized service objects
 */
export async function generateCustomServices({
  companyName,
  websiteUrl,
  industry,
  customIndustry,
  businessType,
  companySize
}) {
  try {
    const displayIndustry = industry === 'other' ? customIndustry : industry;
    console.log('🎯 [SERVICE GEN] Starting REAL AI generation for:', { companyName, industry: displayIndustry, businessType, companySize });

    // Check cache first to save API costs
    const cached = getCachedServices(companyName, displayIndustry);
    if (cached) {
      console.log('💾 [SERVICE GEN] Using cached AI services (< 24hrs old)');
      return cached;
    }

    // Call REAL Claude AI to generate services
    console.log('🤖 [SERVICE GEN] Calling Claude AI (this will take 10-30 seconds)...');

    const aiServices = await generateServicesWithAI({
      companyName,
      websiteUrl,
      industry: displayIndustry,
      customIndustry,
      businessType,
      companySize
    });

    console.log(`✅ [SERVICE GEN] AI generated ${aiServices.length} services with SPIN scripts`);
    console.log('Services:', aiServices.map(s => s.name));

    // Cache the results
    cacheServices(companyName, displayIndustry, aiServices);

    return aiServices;
  } catch (error) {
    console.error('❌ [SERVICE GEN] AI generation failed:', error);
    console.error('Stack:', error.stack);

    // Fallback to templates if AI fails
    console.log('⚠️ [SERVICE GEN] Falling back to template services...');
    const fallback = getServiceTemplatesForIndustry(industry);
    console.log(`📋 [SERVICE GEN] Using ${fallback.length} fallback template services`);
    return fallback;
  }
}

/**
 * Extract company context from website
 */
async function extractCompanyContext(websiteUrl) {
  try {
    // Normalize URL
    let url = websiteUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // Use CORS proxy to fetch website
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl, { timeout: 5000 });
    const data = await response.json();
    const html = data.contents;

    // Extract key information
    const context = {
      hasCommercial: /commercial|business|enterprise|corporate/i.test(html),
      hasResidential: /residential|home|homeowner/i.test(html),
      hasEmergency: /emergency|24\/7|24 hour/i.test(html),
      hasMaintenance: /maintenance|service plan|annual|yearly/i.test(html),
      hasWarranty: /warranty|guarantee/i.test(html),
      hasFinancing: /financing|payment plan/i.test(html),
      premium: /premium|luxury|high-end/i.test(html),
      ecofriendly: /eco|green|energy.efficient|sustainable/i.test(html),
      smart: /smart|automation|IoT|connected/i.test(html)
    };

    return context;
  } catch (error) {
    console.log('Could not fetch website context:', error);
    return {
      hasCommercial: true,
      hasResidential: true,
      hasEmergency: false,
      hasMaintenance: true,
      hasWarranty: false,
      hasFinancing: false,
      premium: false,
      ecofriendly: false,
      smart: false
    };
  }
}

/**
 * Customize services based on company specifics
 */
async function customizeServicesForCompany({
  baseTemplates,
  companyName,
  companyContext,
  industry,
  customIndustry,
  businessType,
  companySize
}) {
  const industryName = industry === 'other' && customIndustry ? customIndustry : industry;
  const customized = baseTemplates.map((template, index) => {
    let service = { ...template };

    // Personalize scripts and descriptions with company name
    service.technician_script = service.technician_script
      .replace(/our company/gi, companyName)
      .replace(/we offer/gi, `${companyName} offers`)
      .replace(/our service/gi, `${companyName}'s service`);

    service.customer_description = service.customer_description
      .replace(/our company/gi, companyName)
      .replace(/we provide/gi, `${companyName} provides`);

    // Adjust based on business type
    if (businessType === 'commercial' && service.when_to_offer) {
      service.when_to_offer = service.when_to_offer.replace(
        /homeowner|customer|resident/gi,
        'business owner'
      );
    } else if (businessType === 'residential' && service.when_to_offer) {
      service.when_to_offer = service.when_to_offer.replace(
        /business|commercial|facility/gi,
        'home'
      );
    }

    // Add context-specific enhancements
    if (companyContext.premium && service.benefits) {
      service.benefits.unshift('Premium Quality Guarantee');
    }

    if (companyContext.hasWarranty && service.benefits) {
      service.benefits.push('Extended Warranty Coverage');
    }

    if (companyContext.hasFinancing && !service.benefits.some(b => b.includes('Financing'))) {
      service.benefits.push('Flexible Financing Available');
    }

    // Adjust pricing suggestion for company size
    if (companySize === '1-5' && service.price) {
      // Smaller companies might have lower overhead
      service.price = service.price.replace(/\$\d+/, (match) => {
        const amount = parseInt(match.replace('$', ''));
        return '$' + Math.floor(amount * 0.85);
      });
    }

    return service;
  });

  // Sort by relevance based on company context
  return prioritizeServicesByContext(customized, companyContext, businessType);
}

/**
 * Prioritize services based on company context
 */
function prioritizeServicesByContext(services, context, businessType) {
  return services.map((service, index) => ({
    ...service,
    order_priority: index + 1,
    relevanceScore: calculateRelevance(service, context, businessType)
  }))
  .sort((a, b) => b.relevanceScore - a.relevanceScore)
  .map((service, index) => {
    const { relevanceScore, ...cleanService } = service;
    return {
      ...cleanService,
      order_priority: index + 1
    };
  })
  .slice(0, 10); // Top 10 most relevant
}

/**
 * Calculate relevance score for a service
 */
function calculateRelevance(service, context, businessType) {
  let score = 100;

  const serviceName = service.name.toLowerCase();
  const description = service.customer_description.toLowerCase();
  const fullText = serviceName + ' ' + description;

  // Boost maintenance services if company offers them
  if (context.hasMaintenance && /maintenance|plan|tune/i.test(fullText)) {
    score += 20;
  }

  // Boost emergency services if company offers them
  if (context.hasEmergency && /emergency|24|urgent/i.test(fullText)) {
    score += 15;
  }

  // Boost smart/tech services if company is tech-forward
  if (context.smart && /smart|digital|automated|iot/i.test(fullText)) {
    score += 25;
  }

  // Boost eco services if company is eco-friendly
  if (context.ecofriendly && /eco|energy|efficient|green|sustainable/i.test(fullText)) {
    score += 20;
  }

  // Boost premium services for premium brands
  if (context.premium && /premium|advanced|high-end|luxury/i.test(fullText)) {
    score += 15;
  }

  // Adjust for business type
  if (businessType === 'commercial' && /commercial|business|enterprise/i.test(fullText)) {
    score += 10;
  } else if (businessType === 'residential' && /home|residential|homeowner/i.test(fullText)) {
    score += 10;
  }

  return score;
}

/**
 * Generate a completely new service using AI (for future implementation)
 * This would call an AI API to generate services from scratch
 */
export async function generateServiceWithAI({
  companyName,
  industry,
  serviceType,
  context
}) {
  // This would call OpenAI/Anthropic API with a prompt like:
  // "Generate a detailed upsell service for {companyName}, a {industry} company.
  //  Service type: {serviceType}. Include: name, price, when_to_offer,
  //  4 benefits, technician_script, customer_description"

  // For now, return null and use templates
  return null;
}
