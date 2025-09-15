// ElevenLabs supported languages configuration
// Based on ElevenLabs v3 model with 74+ supported languages

const SUPPORTED_LANGUAGES = [
  // Major European Languages
  { code: 'en', name: 'English', flag: '🇺🇸', openaiCode: 'en' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', openaiCode: 'es' },
  { code: 'fr', name: 'French', flag: '🇫🇷', openaiCode: 'fr' },
  { code: 'de', name: 'German', flag: '🇩🇪', openaiCode: 'de' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', openaiCode: 'it' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', openaiCode: 'pt' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', openaiCode: 'ru' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱', openaiCode: 'pl' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', openaiCode: 'nl' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪', openaiCode: 'sv' },
  { code: 'da', name: 'Danish', flag: '🇩🇰', openaiCode: 'da' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴', openaiCode: 'no' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮', openaiCode: 'fi' },
  { code: 'cs', name: 'Czech', flag: '🇨🇿', openaiCode: 'cs' },
  { code: 'sk', name: 'Slovak', flag: '🇸🇰', openaiCode: 'sk' },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺', openaiCode: 'hu' },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴', openaiCode: 'ro' },
  { code: 'bg', name: 'Bulgarian', flag: '🇧🇬', openaiCode: 'bg' },
  { code: 'hr', name: 'Croatian', flag: '🇭🇷', openaiCode: 'hr' },
  { code: 'sr', name: 'Serbian', flag: '🇷🇸', openaiCode: 'sr' },
  { code: 'sl', name: 'Slovenian', flag: '🇸🇮', openaiCode: 'sl' },
  { code: 'et', name: 'Estonian', flag: '🇪🇪', openaiCode: 'et' },
  { code: 'lv', name: 'Latvian', flag: '🇱🇻', openaiCode: 'lv' },
  { code: 'lt', name: 'Lithuanian', flag: '🇱🇹', openaiCode: 'lt' },
  { code: 'el', name: 'Greek', flag: '🇬🇷', openaiCode: 'el' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', openaiCode: 'tr' },

  // Asian Languages
  { code: 'zh', name: 'Chinese (Simplified)', flag: '🇨🇳', openaiCode: 'zh' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', flag: '🇹🇼', openaiCode: 'zh-TW' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', openaiCode: 'ja' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', openaiCode: 'ko' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', openaiCode: 'hi' },
  { code: 'th', name: 'Thai', flag: '🇹🇭', openaiCode: 'th' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', openaiCode: 'vi' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩', openaiCode: 'id' },
  { code: 'ms', name: 'Malay', flag: '🇲🇾', openaiCode: 'ms' },
  { code: 'tl', name: 'Filipino', flag: '🇵🇭', openaiCode: 'tl' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩', openaiCode: 'bn' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰', openaiCode: 'ur' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', openaiCode: 'ta' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳', openaiCode: 'te' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳', openaiCode: 'mr' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳', openaiCode: 'gu' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳', openaiCode: 'kn' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳', openaiCode: 'ml' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳', openaiCode: 'pa' },

  // Middle Eastern Languages
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', openaiCode: 'ar' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱', openaiCode: 'he' },
  { code: 'fa', name: 'Persian (Farsi)', flag: '🇮🇷', openaiCode: 'fa' },

  // African Languages
  { code: 'sw', name: 'Swahili', flag: '🇰🇪', openaiCode: 'sw' },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦', openaiCode: 'af' },
  { code: 'zu', name: 'Zulu', flag: '🇿🇦', openaiCode: 'zu' },
  { code: 'xh', name: 'Xhosa', flag: '🇿🇦', openaiCode: 'xh' },
  { code: 'am', name: 'Amharic', flag: '🇪🇹', openaiCode: 'am' },

  // Additional European Languages
  { code: 'is', name: 'Icelandic', flag: '🇮🇸', openaiCode: 'is' },
  { code: 'ga', name: 'Irish', flag: '🇮🇪', openaiCode: 'ga' },
  { code: 'cy', name: 'Welsh', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', openaiCode: 'cy' },
  { code: 'mt', name: 'Maltese', flag: '🇲🇹', openaiCode: 'mt' },
  { code: 'eu', name: 'Basque', flag: '🇪🇸', openaiCode: 'eu' },
  { code: 'ca', name: 'Catalan', flag: '🇪🇸', openaiCode: 'ca' },
  { code: 'gl', name: 'Galician', flag: '🇪🇸', openaiCode: 'gl' },

  // Additional Languages
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦', openaiCode: 'uk' },
  { code: 'be', name: 'Belarusian', flag: '🇧🇾', openaiCode: 'be' },
  { code: 'mk', name: 'Macedonian', flag: '🇲🇰', openaiCode: 'mk' },
  { code: 'sq', name: 'Albanian', flag: '🇦🇱', openaiCode: 'sq' },
  { code: 'bs', name: 'Bosnian', flag: '🇧🇦', openaiCode: 'bs' },
  { code: 'me', name: 'Montenegrin', flag: '🇲🇪', openaiCode: 'me' },

  // Americas
  { code: 'pt-BR', name: 'Portuguese (Brazilian)', flag: '🇧🇷', openaiCode: 'pt' },
  { code: 'es-MX', name: 'Spanish (Mexican)', flag: '🇲🇽', openaiCode: 'es' },
  { code: 'es-AR', name: 'Spanish (Argentinian)', flag: '🇦🇷', openaiCode: 'es' },
  { code: 'fr-CA', name: 'French (Canadian)', flag: '🇨🇦', openaiCode: 'fr' },

  // Additional Asian Languages
  { code: 'my', name: 'Burmese', flag: '🇲🇲', openaiCode: 'my' },
  { code: 'km', name: 'Khmer', flag: '🇰🇭', openaiCode: 'km' },
  { code: 'lo', name: 'Lao', flag: '🇱🇦', openaiCode: 'lo' },
  { code: 'si', name: 'Sinhala', flag: '🇱🇰', openaiCode: 'si' },
  { code: 'ne', name: 'Nepali', flag: '🇳🇵', openaiCode: 'ne' },
  { code: 'mn', name: 'Mongolian', flag: '🇲🇳', openaiCode: 'mn' }
];

// Default languages for quick selection (the original hardcoded ones + English)
const DEFAULT_LANGUAGES = [
  'en', 'zh', 'ru', 'pl', 'es', 'pt', 'de', 'fr', 'ja', 'ko'
];

// Get language by code
function getLanguageByCode(code) {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
}

// Get languages by codes
function getLanguagesByCodes(codes) {
  return codes.map(code => getLanguageByCode(code)).filter(Boolean);
}

// Get all supported languages
function getAllLanguages() {
  return SUPPORTED_LANGUAGES;
}

// Get default languages
function getDefaultLanguages() {
  return getLanguagesByCodes(DEFAULT_LANGUAGES);
}

// Group languages by region
function getLanguagesByRegion() {
  return {
    europe: SUPPORTED_LANGUAGES.filter(lang => 
      ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'pl', 'nl', 'sv', 'da', 'no', 'fi', 'cs', 'sk', 'hu', 'ro', 'bg', 'hr', 'sr', 'sl', 'et', 'lv', 'lt', 'el', 'tr', 'is', 'ga', 'cy', 'mt', 'eu', 'ca', 'gl', 'uk', 'be', 'mk', 'sq', 'bs', 'me'].includes(lang.code)
    ),
    asia: SUPPORTED_LANGUAGES.filter(lang => 
      ['zh', 'zh-TW', 'ja', 'ko', 'hi', 'th', 'vi', 'id', 'ms', 'tl', 'bn', 'ur', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'my', 'km', 'lo', 'si', 'ne', 'mn'].includes(lang.code)
    ),
    middleEast: SUPPORTED_LANGUAGES.filter(lang => 
      ['ar', 'he', 'fa'].includes(lang.code)
    ),
    africa: SUPPORTED_LANGUAGES.filter(lang => 
      ['sw', 'af', 'zu', 'xh', 'am'].includes(lang.code)
    ),
    americas: SUPPORTED_LANGUAGES.filter(lang => 
      ['pt-BR', 'es-MX', 'es-AR', 'fr-CA'].includes(lang.code)
    )
  };
}

module.exports = {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGES,
  getLanguageByCode,
  getLanguagesByCodes,
  getAllLanguages,
  getDefaultLanguages,
  getLanguagesByRegion
};
