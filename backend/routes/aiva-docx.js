// AIVA DOCX Generation Route
// Generates downloadable DOCX files for voice agent implementation guides

const express = require('express');
const router = express.Router();
const { Packer } = require('docx');
const { generateVoiceAgentGuide } = require('../utils/docx-generator');

/**
 * POST /api/aiva/download-voice-agent-guide
 * Generates and downloads a DOCX implementation guide for a deliverable
 */
router.post('/download-voice-agent-guide', async (req, res) => {
  try {
    const {
      deliverable,
      companyName,
      jobTitle,
      industry
    } = req.body;

    // Validate required fields
    if (!deliverable || !companyName || !jobTitle || !industry) {
      return res.status(400).json({
        error: 'Missing required fields: deliverable, companyName, jobTitle, and industry are required'
      });
    }

    console.log(`Generating DOCX for: ${deliverable.title} at ${companyName}`);

    // Generate DOCX document
    const doc = generateVoiceAgentGuide(deliverable, companyName, jobTitle, industry);

    // Convert to buffer
    const buffer = await Packer.toBuffer(doc);

    // Create safe filename
    const safeCompanyName = companyName.replace(/[^a-z0-9]/gi, '_');
    const safeJobTitle = jobTitle.replace(/[^a-z0-9]/gi, '_');
    const safeDeliverableTitle = deliverable.title.replace(/[^a-z0-9]/gi, '_');
    const filename = `${safeCompanyName}_${safeJobTitle}_${safeDeliverableTitle}_Voice_Agent_Guide.docx`;

    // Set headers for download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);

    // Send file
    res.send(buffer);

    console.log(`✅ DOCX generated successfully: ${filename}`);

  } catch (error) {
    console.error('Error generating DOCX:', error);
    res.status(500).json({
      error: 'Failed to generate DOCX document',
      details: error.message
    });
  }
});

module.exports = router;
