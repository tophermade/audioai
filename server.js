const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import configuration and validation
const { performStartupValidation } = require('./config/validation');
const { getAllLanguages, getLanguagesByRegion } = require('./config/languages');

// Import routes
const translationRoutes = require('./routes/translation');
const audioRoutes = require('./routes/audio');
const historyRoutes = require('./routes/history');


const app = express();
const PORT = process.env.PORT || 3000;

// Detect if running in Electron
const isElectron = process.env.ELECTRON_MODE === 'true' || process.versions.electron;


// Security middleware - adjusted for Electron
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://stackpath.bootstrapcdn.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://code.jquery.com", "https://stackpath.bootstrapcdn.com"],
      fontSrc: ["'self'", "https://cdn.jsdelivr.net", "https://stackpath.bootstrapcdn.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
      mediaSrc: ["'self'", "blob:", "data:"],
      connectSrc: ["'self'", "https://api.openai.com", "https://api.elevenlabs.io"],
      ...(isElectron && {
        // Allow Electron-specific protocols
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://code.jquery.com", "https://stackpath.bootstrapcdn.com", "'unsafe-eval'"]
      })
    }
  }
}));

// Rate limiting removed

// CORS
app.use(cors());

// Body parser
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Set view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  const allLanguages = getAllLanguages();
  const languagesByRegion = getLanguagesByRegion();
  
  res.render('index', { 
    title: 'AI Audio Translator',
    languages: allLanguages,
    languagesByRegion: languagesByRegion
  });
});

app.use('/api/translate', translationRoutes);
app.use('/api/audio', audioRoutes);
app.use('/history', historyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Startup validation and server start
const startServer = async () => {
  try {
    // Perform startup validation
    await performStartupValidation();
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      if (!isElectron) {
        console.log(`🌐 Visit http://localhost:${PORT} to use the application`);
        console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
      } else {
        console.log(`🖥️  Running in Electron mode`);
      }
    });

    // Graceful shutdown for Electron
    if (isElectron) {
      process.on('SIGTERM', () => {
        console.log('🛑 Shutting down server gracefully...');
        server.close(() => {
          console.log('✅ Server closed');
          process.exit(0);
        });
      });
    }
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
