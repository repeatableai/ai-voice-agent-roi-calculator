// Document Processing Utility

const fs = require('fs').promises;
const path = require('path');
const { logInfo, logError } = require('./logger');

// Process document and return chunks
async function processDocument(filePath, originalName) {
  const ext = path.extname(originalName).toLowerCase();

  try {
    switch (ext) {
      case '.txt':
      case '.md':
        return await processTextFile(filePath, originalName);

      case '.json':
        return await processJSONFile(filePath, originalName);

      case '.csv':
        return await processCSVFile(filePath, originalName);

      case '.pdf':
        return await processPDFFile(filePath, originalName);

      case '.docx':
      case '.doc':
        return await processWordFile(filePath, originalName);

      default:
        throw new Error(`Unsupported file type: ${ext}`);
    }
  } catch (error) {
    logError('Document processing error:', error);
    throw error;
  }
}

// Process plain text file
async function processTextFile(filePath, originalName) {
  const content = await fs.readFile(filePath, 'utf-8');
  return chunkText(content, originalName);
}

// Process JSON file
async function processJSONFile(filePath, originalName) {
  const content = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(content);

  // Convert JSON to readable text
  const text = JSON.stringify(data, null, 2);
  return chunkText(text, originalName, 'json');
}

// Process CSV file
async function processCSVFile(filePath, originalName) {
  const content = await fs.readFile(filePath, 'utf-8');
  const lines = content.split('\n');

  // Convert CSV to readable format
  const chunks = [];
  const chunkSize = 50; // Lines per chunk

  for (let i = 0; i < lines.length; i += chunkSize) {
    const chunkLines = lines.slice(i, i + chunkSize);
    chunks.push({
      text: chunkLines.join('\n'),
      type: 'csv',
      source: originalName,
      page: Math.floor(i / chunkSize) + 1
    });
  }

  return chunks;
}

// Process PDF file (requires external library)
async function processPDFFile(filePath, originalName) {
  // TODO: Implement PDF processing with pdf-parse or similar
  // For now, return placeholder

  logInfo('PDF processing not yet implemented, using placeholder');

  return [{
    text: `PDF file: ${originalName}. Full PDF processing not yet implemented. Please use .txt or .md files.`,
    type: 'pdf',
    source: originalName,
    page: 1
  }];

  /* Implementation with pdf-parse:
  const pdfParse = require('pdf-parse');
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdfParse(dataBuffer);

  return chunkText(data.text, originalName, 'pdf');
  */
}

// Process Word file (requires external library)
async function processWordFile(filePath, originalName) {
  // TODO: Implement Word processing with mammoth or similar
  // For now, return placeholder

  logInfo('Word file processing not yet implemented, using placeholder');

  return [{
    text: `Word file: ${originalName}. Full Word processing not yet implemented. Please use .txt or .md files.`,
    type: 'docx',
    source: originalName,
    page: 1
  }];

  /* Implementation with mammoth:
  const mammoth = require('mammoth');
  const result = await mammoth.extractRawText({ path: filePath });

  return chunkText(result.value, originalName, 'docx');
  */
}

// Chunk text into smaller pieces
function chunkText(text, source, type = 'text', maxChunkSize = 500) {
  const chunks = [];

  // Split into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  let currentChunk = '';
  let chunkIndex = 0;

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();

    if (!trimmedSentence) continue;

    // If adding this sentence would exceed max size, save current chunk
    if (currentChunk.length + trimmedSentence.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push({
        text: currentChunk.trim(),
        type,
        source,
        page: chunkIndex + 1
      });

      currentChunk = '';
      chunkIndex++;
    }

    currentChunk += trimmedSentence + ' ';
  }

  // Add remaining chunk
  if (currentChunk.trim()) {
    chunks.push({
      text: currentChunk.trim(),
      type,
      source,
      page: chunkIndex + 1
    });
  }

  return chunks;
}

module.exports = {
  processDocument,
  chunkText
};
