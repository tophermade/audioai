# VIBE Coded Sooo YMMV 🤙
# AI Audio Translator

A comprehensive multilingual text-to-speech application that translates English text into 96+ different languages and generates high-quality audio pronunciations using OpenAI and ElevenLabs APIs. Users provide their own API keys for secure, personalized access.

## Features

- 🌍 **Extensive Language Support**: Translate English text to 96+ languages across all continents
- 🎵 **High-Quality Audio**: Generate natural-sounding speech using ElevenLabs multilingual v2 model
- 📱 **Responsive Design**: Beautiful UI with Bootstrap 5 and intuitive language selection
- 💾 **Local Storage**: Store translation history in browser localStorage
- ⚡ **Real-time Processing**: Live character count and progress tracking
- 📥 **Audio Download**: Download generated audio files in MP3 format
- 🔐 **User-Provided API Keys**: Secure API key management - users provide their own keys
- 🎛️ **Voice Selection**: Choose from available ElevenLabs voices for each language
- 🔒 **Security Features**: Rate limiting, input validation, CORS protection, and Helmet.js
- 📊 **Batch Processing**: Efficient audio generation with intelligent batching and rate limiting

## Supported Languages (96+ Languages)

The application supports 96+ languages across all major regions of the world:

### 🇪🇺 European Languages (32 languages)
- 🇺🇸 English, 🇪🇸 Spanish, 🇫🇷 French, 🇩🇪 German, 🇮🇹 Italian, 🇵🇹 Portuguese, 🇷🇺 Russian, 🇵🇱 Polish
- 🇳🇱 Dutch, 🇸🇪 Swedish, 🇩🇰 Danish, 🇳🇴 Norwegian, 🇫🇮 Finnish, 🇨🇿 Czech, 🇸🇰 Slovak, 🇭🇺 Hungarian
- 🇷🇴 Romanian, 🇧🇬 Bulgarian, 🇭🇷 Croatian, 🇷🇸 Serbian, 🇸🇮 Slovenian, 🇪🇪 Estonian, 🇱🇻 Latvian, 🇱🇹 Lithuanian
- 🇬🇷 Greek, 🇹🇷 Turkish, 🇮🇸 Icelandic, 🇮🇪 Irish, 🏴󠁧󠁢󠁷󠁬󠁳󠁿 Welsh, 🇲🇹 Maltese, 🇪🇸 Basque, 🇪🇸 Catalan
- 🇺🇦 Ukrainian, 🇧🇾 Belarusian, 🇲🇰 Macedonian, 🇦🇱 Albanian, 🇧🇦 Bosnian, 🇲🇪 Montenegrin

### 🌏 Asian Languages (25 languages)
- 🇨🇳 Chinese (Simplified), 🇹🇼 Chinese (Traditional), 🇯🇵 Japanese, 🇰🇷 Korean, 🇮🇳 Hindi, 🇹🇭 Thai, 🇻🇳 Vietnamese
- 🇮🇩 Indonesian, 🇲🇾 Malay, 🇵🇭 Filipino, 🇧🇩 Bengali, 🇵🇰 Urdu, 🇮🇳 Tamil, 🇮🇳 Telugu, 🇮🇳 Marathi
- 🇮🇳 Gujarati, 🇮🇳 Kannada, 🇮🇳 Malayalam, 🇮🇳 Punjabi, 🇲🇲 Burmese, 🇰🇭 Khmer, 🇱🇦 Lao
- 🇱🇰 Sinhala, 🇳🇵 Nepali, 🇲🇳 Mongolian

### 🕌 Middle Eastern Languages (3 languages)
- 🇸🇦 Arabic, 🇮🇱 Hebrew, 🇮🇷 Persian (Farsi)

### 🌍 African Languages (5 languages)
- 🇰🇪 Swahili, 🇿🇦 Afrikaans, 🇿🇦 Zulu, 🇿🇦 Xhosa, 🇪🇹 Amharic

### 🌎 Americas Regional Variants (4 languages)
- 🇧🇷 Portuguese (Brazilian), 🇲🇽 Spanish (Mexican), 🇦🇷 Spanish (Argentinian), 🇨🇦 French (Canadian)

**Default Quick-Select Languages**: English, Chinese, Russian, Polish, Spanish, Portuguese, German, French, Japanese, Korean

## Tech Stack

- **Backend**: Node.js, Express.js, Pug templating
- **Frontend**: Bootstrap 5, jQuery, Font Awesome
- **Storage**: Browser localStorage for translation history
- **APIs**: OpenAI GPT-3.5-turbo for translation, ElevenLabs Multilingual v2 for text-to-speech
- **Audio**: MP3 generation with configurable voice settings and batch processing
- **Security**: Helmet.js, CORS, Express Rate Limiting, input validation
- **Architecture**: User-provided API keys, modular configuration system

## Prerequisites

- Node.js 16+ and npm
- OpenAI API account and key (users provide their own via the web interface)
- ElevenLabs API account and key (users provide their own via the web interface)
- No server-side API key storage required - keys are provided by users for each session

## Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd AiAudio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Copy `env.example` to `.env` and fill in your API keys:
   ```bash
   cp env.example .env
   ```

   Edit `.env` with your server configuration (API keys are provided by users via the interface):
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Rate Limiting (adjust based on your server capacity)
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Run the application**:
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Or production mode
   npm start
   ```

5. **Access the application**:
   Open your browser and go to `http://localhost:3000`

## API Endpoints

### Translation Endpoints

- `POST /api/translate` - Translate text to multiple languages

### Audio Endpoints

- `POST /api/audio/generate` - Generate audio for multiple translations
- `POST /api/audio/generate-single` - Generate audio for single translation
- `GET /api/audio/voices` - Get available ElevenLabs voices
- `GET /api/audio/test` - Test ElevenLabs API connection

## Usage

1. **Enter API Keys**: Provide your OpenAI and ElevenLabs API keys in the interface (stored locally for the session)
2. **Enter Text**: Type or paste English text (up to 5,000 characters)
3. **Select Languages**: Choose from 96+ available languages using the intuitive selection interface
4. **Translate**: Click "Translate" to get translations in all selected languages
5. **Generate Audio**: Click "Generate Audio" to create high-quality speech files
6. **Voice Selection**: Optionally choose specific ElevenLabs voices for each language
7. **Play & Download**: Use the built-in audio players and download buttons
8. **View History**: Check your translation history in the History section (stored locally)

## Configuration

### Language System

The application uses a comprehensive language configuration system in `config/languages.js`:

- **96+ Supported Languages**: Complete language definitions with codes, names, flags, and OpenAI mappings
- **Regional Organization**: Languages grouped by Europe, Asia, Middle East, Africa, and Americas
- **Default Quick-Select**: 10 most commonly used languages for quick access
- **Flexible Mapping**: Support for both standard and regional language variants

### Voice Mapping

The application uses ElevenLabs Multilingual v2 model with configurable voice mapping in `config/elevenlabs.js`:

```javascript
const VOICE_MAPPING = {
  'en': 'bIHbv24MWmeRgasZH58o', // Will (default multilingual voice)
  // Uses the same multilingual voice for all languages by default
  // Users can select different voices through the interface
};
```

**Voice Features:**
- Multilingual v2 model supports all 96+ languages
- Configurable voice settings (stability, similarity_boost, style)
- User-selectable voices through the web interface
- Batch processing with rate limiting (2 audio files per batch, 2-second delays)

### Rate Limiting

Configure rate limiting in your `.env` file:
- `RATE_LIMIT_WINDOW_MS`: Time window in milliseconds
- `RATE_LIMIT_MAX_REQUESTS`: Maximum requests per window

## Development

### Project Structure

```
AiAudio/
├── config/           # Configuration files
│   ├── elevenlabs.js # ElevenLabs API integration
│   ├── languages.js  # Language configurations
│   ├── openai.js     # OpenAI API integration
│   └── validation.js # Environment validation
├── routes/           # API routes
│   ├── audio.js      # Audio generation endpoints
│   ├── history.js    # History page routes
│   └── translation.js # Translation endpoints
├── views/            # Pug templates
│   ├── layout.pug    # Base layout
│   ├── index.pug     # Main page
│   ├── history.pug   # History page
│   └── translation-view.pug # Translation details
├── public/           # Static files
│   ├── css/style.css # Custom styles
│   ├── js/app.js     # Frontend JavaScript
│   └── audio/        # Generated audio files
├── server.js         # Main server file
└── package.json      # Dependencies and scripts
```

### Adding New Languages

1. Add the language to the `SUPPORTED_LANGUAGES` array in `config/languages.js`
2. Include proper language code, name, flag emoji, and OpenAI mapping
3. The system will automatically make it available in the interface
4. Voice mapping uses the multilingual model by default (no additional configuration needed)
5. Update the regional grouping in `getLanguagesByRegion()` if desired

### Development Scripts

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Start production server
npm start
```

## Troubleshooting

### Common Issues

1. **API Key Errors**:
   - Ensure your OpenAI and ElevenLabs API keys are correct
   - Check your API quotas and billing status

2. **Translation History**:
   - History is stored in browser localStorage
   - Clearing browser data will remove translation history

3. **Audio Generation Fails**:
   - Verify ElevenLabs API key and quota
   - Check if voice IDs are valid for your account

4. **Rate Limiting**:
   - Adjust rate limits in `.env` if needed
   - Consider implementing user authentication for higher limits

### Error Logs

Check the console for detailed error messages. The application includes comprehensive error handling and logging.

## Security Considerations

- **User-Provided API Keys**: API keys are provided by users and not stored server-side
- **Session-Based Storage**: API keys are stored locally in the browser for the session only
- **Rate Limiting**: Prevents abuse with configurable request limits per time window
- **Input Validation**: Comprehensive validation prevents malicious content and oversized requests
- **CORS Protection**: Cross-origin request protection for API endpoints
- **Helmet.js**: Security headers for protection against common vulnerabilities
- **Batch Rate Limiting**: Audio generation includes intelligent batching to respect API limits

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Open an issue on GitHub

## Acknowledgments

- [OpenAI](https://openai.com/) for translation capabilities
- [ElevenLabs](https://elevenlabs.io/) for high-quality text-to-speech
- [Bootstrap](https://getbootstrap.com/) for responsive UI components
- [Font Awesome](https://fontawesome.com/) for icons
