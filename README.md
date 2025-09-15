# AI Audio Translator

A comprehensive multilingual text-to-speech application that translates English text into 9 different languages and generates high-quality audio pronunciations using OpenAI and ElevenLabs APIs.

## Features

- 🌍 **Multilingual Translation**: Translate English text to 9 languages
- 🎵 **High-Quality Audio**: Generate natural-sounding speech using ElevenLabs
- 📱 **Responsive Design**: Beautiful UI with Bootstrap 5
- 💾 **Local Storage**: Store translation history in browser localStorage
- ⚡ **Real-time Processing**: Live character count and progress tracking
- 📥 **Audio Download**: Download generated audio files
- 🔒 **Security Features**: Rate limiting, input validation, and CORS protection

## Supported Languages

- 🇨🇳 Simplified Chinese (zh-CN)
- 🇷🇺 Russian (ru)
- 🇵🇱 Polish (pl)
- 🇪🇸 Spanish (es)
- 🇵🇹 Portuguese (pt)
- 🇩🇪 German (de)
- 🇫🇷 French (fr)
- 🇯🇵 Japanese (ja)
- 🇰🇷 Korean (ko)

## Tech Stack

- **Backend**: Node.js, Express.js, Pug templating
- **Frontend**: Bootstrap 5, jQuery, Font Awesome
- **Storage**: Browser localStorage for translation history
- **APIs**: OpenAI GPT-3.5-turbo, ElevenLabs Text-to-Speech
- **Security**: Helmet, CORS, Rate Limiting

## Prerequisites

- Node.js 16+ and npm
- Users provide their own OpenAI and ElevenLabs API keys via the web interface

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

   Edit `.env` with your configuration (optional - API keys are now provided by users):
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Rate Limiting
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

1. **Enter Text**: Type or paste English text (up to 5,000 characters)
2. **Select Languages**: Choose which languages to translate to
3. **Translate**: Click "Translate" to get translations
4. **Generate Audio**: Click "Generate Audio" to create speech files
5. **Play & Download**: Use the audio players and download buttons
6. **View History**: Check your translation history in the History section

## Configuration

### Voice Mapping

The application uses predefined voice IDs for different languages. You can customize these in `config/elevenlabs.js`:

```javascript
const VOICE_MAPPING = {
  'en': 'pNInz6obpgDQGcFmaJgB', // Adam (English)
  'zh-CN': '21m00Tcm4TlvDq8ikWAM', // Rachel
  // ... other languages
};
```

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

1. Add the language to the `languages` array in `server.js`
2. Add appropriate voice mapping in `config/elevenlabs.js`
3. Update the language flags in `public/js/app.js` if desired
4. Add language-specific CSS styling in `public/css/style.css`

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

- API keys are stored in environment variables
- Rate limiting prevents abuse
- Input validation prevents malicious content
- CORS protection for cross-origin requests
- Helmet.js for security headers

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
