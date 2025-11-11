/**
 * Extract branding information (logo, colors) from a website URL
 * Uses Claude AI to intelligently extract brand colors and Clearbit for logos
 */

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true
});

/**
 * Fetch and extract branding from a website
 * @param {string} websiteUrl - The company website URL
 * @returns {Promise<{logo_url: string, primary_color: string}>}
 */
export async function extractBrandingFromWebsite(websiteUrl) {
  try {
    console.log('🎨 [BRANDING] Starting extraction for:', websiteUrl);

    // Normalize URL
    let url = websiteUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    const companyName = domain.split('.')[0];

    const branding = {
      logo_url: null,
      primary_color: '#3B82F6' // default blue
    };

    // Method 1: Try Clearbit Logo API (free, no auth required) - HIGH QUALITY LOGOS
    try {
      const clearbitUrl = `https://logo.clearbit.com/${domain}`;
      const response = await fetch(clearbitUrl, { method: 'HEAD' });
      if (response.ok) {
        branding.logo_url = clearbitUrl;
        console.log('✅ [BRANDING] Clearbit logo found:', clearbitUrl);
      }
    } catch (e) {
      console.log('⚠️ [BRANDING] Clearbit API failed:', e);
    }

    // Method 2: Try to get high-res favicon from website HTML
    if (!branding.logo_url) {
      try {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const htmlResponse = await fetch(proxyUrl, { timeout: 5000 });
        const data = await htmlResponse.json();
        const html = data.contents;

        // Look for high-quality logos (apple-touch-icon, og:image, etc)
        const logoPatterns = [
          /<link[^>]*rel=["']apple-touch-icon["'][^>]*href=["']([^"']+)["']/i,
          /<link[^>]*href=["']([^"']+)["'][^>]*rel=["']apple-touch-icon["']/i,
          /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
          /<link[^>]*rel=["']icon["'][^>]*sizes=["']192x192["'][^>]*href=["']([^"']+)["']/i,
        ];

        for (const pattern of logoPatterns) {
          const match = html.match(pattern);
          if (match && match[1]) {
            let logoUrl = match[1];
            // Handle relative URLs
            if (logoUrl.startsWith('//')) {
              logoUrl = urlObj.protocol + logoUrl;
            } else if (logoUrl.startsWith('/')) {
              logoUrl = `${urlObj.protocol}//${urlObj.hostname}${logoUrl}`;
            } else if (!logoUrl.startsWith('http')) {
              logoUrl = `${urlObj.protocol}//${urlObj.hostname}/${logoUrl}`;
            }

            branding.logo_url = logoUrl;
            console.log('✅ [BRANDING] High-res logo found:', logoUrl);
            break;
          }
        }
      } catch (e) {
        console.log('⚠️ [BRANDING] HTML scraping failed:', e);
      }
    }

    // Method 3: Fallback to Google Favicon API (256px)
    if (!branding.logo_url) {
      branding.logo_url = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
      console.log('ℹ️ [BRANDING] Using Google favicon:', branding.logo_url);
    }

    // Method 4: Use Claude AI to research and extract primary brand color
    try {
      console.log('🤖 [BRANDING] Asking Claude AI for brand color...');

      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 300,
        temperature: 0.3,
        messages: [{
          role: "user",
          content: `You are a branding expert. I need to know the primary brand color for the company "${companyName}" (website: ${domain}).

Research this company and tell me their primary brand color as a HEX code.

IMPORTANT: Respond with ONLY the hex code (e.g., #FF6B35). No other text or explanation.

If you cannot determine the exact color, provide your best educated guess based on the company name and industry.`
        }]
      });

      const colorResponse = message.content[0].text.trim();

      // Extract hex code from response
      const hexMatch = colorResponse.match(/#[0-9A-Fa-f]{6}/);
      if (hexMatch) {
        branding.primary_color = hexMatch[0];
        console.log('✨ [BRANDING] AI extracted color:', branding.primary_color);
      } else {
        console.log('⚠️ [BRANDING] AI did not return valid hex code:', colorResponse);
      }
    } catch (e) {
      console.log('⚠️ [BRANDING] AI color extraction failed:', e);
    }

    console.log('🎨 [BRANDING] Final branding:', branding);
    return branding;

  } catch (error) {
    console.error('❌ [BRANDING] Error extracting branding:', error);
    // Return defaults
    const domain = new URL(websiteUrl.startsWith('http') ? websiteUrl : 'https://' + websiteUrl).hostname;
    return {
      logo_url: `https://logo.clearbit.com/${domain}`,
      primary_color: '#3B82F6'
    };
  }
}

/**
 * Convert any color format to hex
 */
function colorToHex(color) {
  if (color.startsWith('#')) {
    return color;
  }

  // Handle rgb/rgba
  if (color.startsWith('rgb')) {
    const matches = color.match(/\d+/g);
    if (matches && matches.length >= 3) {
      const r = parseInt(matches[0]);
      const g = parseInt(matches[1]);
      const b = parseInt(matches[2]);
      return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    }
  }

  return color;
}
