const OpenAI = require('openai');

const translateText = async (text, targetLanguage, targetLanguageName, customApiKey = null) => {
  try {
    if (!customApiKey) {
      throw new Error('OpenAI API key not provided');
    }

    // Create OpenAI instance with the provided API key
    const openaiClient = new OpenAI({
      apiKey: customApiKey,
    });

    const prompt = `Translate the following English text to ${targetLanguageName}. Return only the translation without any additional text or explanations:

"${text}"`;

    const response = await openaiClient.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the given text accurately to ${targetLanguageName}. Return only the translation without any additional commentary.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    const translation = response.choices[0].message.content.trim();
    
    // Remove quotes if they wrap the entire translation
    return translation.replace(/^["']|["']$/g, '');
  } catch (error) {
    console.error(`Translation error for ${targetLanguageName}:`, error);
    throw new Error(`Failed to translate to ${targetLanguageName}: ${error.message}`);
  }
};

const translateToMultipleLanguages = async (text, languages, customApiKey = null) => {
  if (!customApiKey) {
    throw new Error('OpenAI API key is required for translation');
  }
  
  const translations = [];
  
  // Process translations in batches to avoid rate limits
  const batchSize = 3;
  for (let i = 0; i < languages.length; i += batchSize) {
    const batch = languages.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (lang) => {
      try {
        const translatedText = await translateText(text, lang.code, lang.name, customApiKey);
        return {
          language: lang.code,
          languageName: lang.name,
          text: translatedText,
          audioUrl: null,
          audioGenerated: false
        };
      } catch (error) {
        console.error(`Error translating to ${lang.name}:`, error);
        return {
          language: lang.code,
          languageName: lang.name,
          text: `Error: ${error.message}`,
          audioUrl: null,
          audioGenerated: false
        };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    translations.push(...batchResults);
    
    // Small delay between batches to be respectful to the API
    if (i + batchSize < languages.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return translations;
};

module.exports = {
  translateText,
  translateToMultipleLanguages
};
