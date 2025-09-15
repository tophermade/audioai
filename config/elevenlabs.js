const axios = require('axios');
const fs = require('fs');
const path = require('path');

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Default voice IDs for different languages - Using Will as default for all languages
const VOICE_MAPPING = {
  'en': 'bIHbv24MWmeRgasZH58o', // Will (English) - Default voice
  'zh-CN': 'bIHbv24MWmeRgasZH58o', // Will (Chinese)
  'ru': 'bIHbv24MWmeRgasZH58o', // Will (Russian)
  'pl': 'bIHbv24MWmeRgasZH58o', // Will (Polish)
  'es': 'bIHbv24MWmeRgasZH58o', // Will (Spanish)
  'pt': 'bIHbv24MWmeRgasZH58o', // Will (Portuguese)
  'de': 'bIHbv24MWmeRgasZH58o', // Will (German)
  'fr': 'bIHbv24MWmeRgasZH58o', // Will (French)
  'ja': 'bIHbv24MWmeRgasZH58o', // Will (Japanese)
  'ko': 'bIHbv24MWmeRgasZH58o' // Will (Korean)
};

const generateAudio = async (text, language, filename, customVoiceId = null, customApiKey = null) => {
  try {
    if (!customApiKey) {
      throw new Error('ElevenLabs API key not provided');
    }

    const voiceId = customVoiceId || VOICE_MAPPING[language] || VOICE_MAPPING['en'];
    const audioDir = path.join(__dirname, '..', 'public', 'audio');
    
    // Ensure audio directory exists
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    const response = await axios.post(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
      {
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.0,
          use_speaker_boost: true
        }
      },
      {
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': customApiKey
      },
        responseType: 'arraybuffer'
      }
    );

    const audioPath = path.join(audioDir, `${filename}.mp3`);
    fs.writeFileSync(audioPath, response.data);

    return `/audio/${filename}.mp3`;
  } catch (error) {
    console.error(`Audio generation error for ${language}:`, error.response?.data || error.message);
    throw new Error(`Failed to generate audio for ${language}: ${error.message}`);
  }
};

const generateMultipleAudios = async (translations, customApiKey = null) => {
  if (!customApiKey) {
    throw new Error('ElevenLabs API key not provided');
  }
  
  const results = [];
  
  // Process audio generation in smaller batches to avoid overwhelming the API
  const batchSize = 2;
  for (let i = 0; i < translations.length; i += batchSize) {
    const batch = translations.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (translation, index) => {
      try {
        const filename = `${Date.now()}_${translation.language}_${i + index}`;
        const customVoiceId = translation.selectedVoiceId || translation.voiceId;
        const audioUrl = await generateAudio(translation.text, translation.language, filename, customVoiceId, customApiKey);
        
        return {
          ...translation,
          audioUrl: audioUrl,
          audioGenerated: true,
          voiceId: customVoiceId
        };
      } catch (error) {
        console.error(`Error generating audio for ${translation.languageName}:`, error);
        return {
          ...translation,
          audioUrl: null,
          audioGenerated: false,
          audioError: error.message
        };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Delay between batches to respect rate limits
    if (i + batchSize < translations.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  return results;
};

const getAvailableVoices = async (customApiKey = null) => {
  try {
    if (!customApiKey) {
      throw new Error('ElevenLabs API key not provided');
    }

    const response = await axios.get(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        'xi-api-key': customApiKey
      }
    });

    return response.data.voices;
  } catch (error) {
    console.error('Error fetching voices:', error);
    throw new Error('Failed to fetch available voices');
  }
};

module.exports = {
  generateAudio,
  generateMultipleAudios,
  getAvailableVoices,
  VOICE_MAPPING
};
