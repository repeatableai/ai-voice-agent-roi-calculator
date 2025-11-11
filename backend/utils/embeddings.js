// Embeddings Utility - OpenAI API

const fetch = require('node-fetch');
const { logError } = require('./logger');

// Generate embedding for text using OpenAI
async function generateEmbedding(text) {
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: text.substring(0, 8000) // Limit to 8000 characters
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    return data.data[0].embedding;

  } catch (error) {
    logError('Generate embedding error:', error);
    throw error;
  }
}

// Generate embeddings for multiple texts in batch
async function generateEmbeddingsBatch(texts) {
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: texts.map(t => t.substring(0, 8000))
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    return data.data.map(item => item.embedding);

  } catch (error) {
    logError('Generate embeddings batch error:', error);
    throw error;
  }
}

module.exports = {
  generateEmbedding,
  generateEmbeddingsBatch
};
