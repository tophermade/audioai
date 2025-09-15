const express = require('express');
const router = express.Router();
const { generateMultipleAudios, generateAudio, getAvailableVoices } = require('../config/elevenlabs');

// Validation middleware for audio generation
const validateAudioRequest = (req, res, next) => {
  const { translations, openaiKey, elevenlabsKey } = req.body;
  
  if (!translations || !Array.isArray(translations)) {
    return res.status(400).json({ error: 'Translations array is required' });
  }
  
  if (translations.length === 0) {
    return res.status(400).json({ error: 'At least one translation is required' });
  }
  
  // Validate each translation object
  for (const translation of translations) {
    if (!translation.text || !translation.language || !translation.languageName) {
      return res.status(400).json({ 
        error: 'Each translation must have text, language, and languageName' 
      });
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

// POST /api/audio/generate - Generate audio for multiple translations
router.post('/generate', validateAudioRequest, async (req, res) => {
  try {
    const { translations, openaiKey, elevenlabsKey } = req.body;
    
    console.log(`Generating audio for ${translations.length} translations...`);
    
    // Generate audio files using user's API keys
    const translationsWithAudio = await generateMultipleAudios(translations, elevenlabsKey);
    
    res.json({
      success: true,
      translations: translationsWithAudio,
      message: 'Audio generation completed'
    });

  } catch (error) {
    console.error('Audio generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Audio generation failed',
      message: error.message
    });
  }
});

// POST /api/audio/generate-single - Generate audio for a single translation
router.post('/generate-single', async (req, res) => {
  try {
    const { text, language, languageName, voiceId, openaiKey, elevenlabsKey } = req.body;
    
    if (!text || !language) {
      return res.status(400).json({ error: 'Text and language are required' });
    }
    
    if (!openaiKey || !elevenlabsKey) {
      return res.status(400).json({ error: 'API keys are required' });
    }
    
    console.log(`Generating single audio for ${language}:`, { text: text.substring(0, 50) + '...', voiceId });
    
    const filename = `${Date.now()}_${language}_single`;
    const audioUrl = await generateAudio(text, language, filename, voiceId, elevenlabsKey);
    
    console.log(`Generated audio URL: ${audioUrl}`);
    
    res.json({
      success: true,
      audioUrl: audioUrl,
      language: language,
      languageName: languageName || language,
      text: text,
      voiceId: voiceId
    });

  } catch (error) {
    console.error('Single audio generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Audio generation failed',
      message: error.message
    });
  }
});

// GET /api/audio/voices - Get available voices from ElevenLabs
router.get('/voices', async (req, res) => {
  try {
    const { elevenlabsKey } = req.query;
    
    if (!elevenlabsKey) {
      return res.status(400).json({ error: 'ElevenLabs API key is required' });
    }
    
    const voices = await getAvailableVoices(elevenlabsKey);
    
    res.json({
      success: true,
      voices: voices
    });

  } catch (error) {
    console.error('Voices fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available voices',
      message: error.message
    });
  }
});

// GET /api/audio/test - Test endpoint to verify ElevenLabs API connection (requires API key in query)
router.get('/test', async (req, res) => {
  try {
    const { elevenlabsKey } = req.query;
    
    if (!elevenlabsKey) {
      return res.status(400).json({
        success: false,
        error: 'ElevenLabs API key is required in query parameter'
      });
    }

    // Try to fetch voices as a simple test
    await getAvailableVoices(elevenlabsKey);
    
    res.json({
      success: true,
      message: 'ElevenLabs API connection successful'
    });

  } catch (error) {
    console.error('ElevenLabs API test error:', error);
    res.status(500).json({
      success: false,
      error: 'ElevenLabs API connection failed',
      message: error.message
    });
  }
});

module.exports = router;
