const express = require('express');
const router = express.Router();
const { translateToMultipleLanguages } = require('../config/openai');

// Validation middleware
const validateTranslationRequest = (req, res, next) => {
  const { text, targetLanguages, openaiKey, elevenlabsKey } = req.body;
  
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required and must be a string' });
  }
  
  if (text.trim().length === 0) {
    return res.status(400).json({ error: 'Text cannot be empty' });
  }
  
  if (text.length > 5000) {
    return res.status(400).json({ error: 'Text must be less than 5000 characters' });
  }
  
  if (!targetLanguages || !Array.isArray(targetLanguages) || targetLanguages.length === 0) {
    return res.status(400).json({ error: 'Target languages are required and must be a non-empty array' });
  }
  
  // Validate each language object
  for (const lang of targetLanguages) {
    if (!lang.code || !lang.name || !lang.openaiCode) {
      return res.status(400).json({ error: 'Each target language must have code, name, and openaiCode' });
    }
  }
  
  // Validate API keys
  if (!openaiKey || typeof openaiKey !== 'string' || !openaiKey.trim()) {
    return res.status(400).json({ error: 'OpenAI API key is required' });
  }
  
  if (!elevenlabsKey || typeof elevenlabsKey !== 'string' || !elevenlabsKey.trim()) {
    return res.status(400).json({ error: 'ElevenLabs API key is required' });
  }
  
  next();
};

// POST /api/translate
router.post('/', validateTranslationRequest, async (req, res) => {
  try {
    const { text, targetLanguages, openaiKey, elevenlabsKey } = req.body;
    
    console.log(`Translating text into ${targetLanguages.length} languages:`, targetLanguages.map(l => l.name).join(', '));

    // Perform translations using selected target languages and user's API keys
    const translations = await translateToMultipleLanguages(text.trim(), targetLanguages, openaiKey);

    res.json({
      success: true,
      originalText: text.trim(),
      translations: translations
    });

  } catch (error) {
    console.error('Translation error:', error);

    res.status(500).json({
      success: false,
      error: 'Translation failed',
      message: error.message
    });
  }
});


module.exports = router;
