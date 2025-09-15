// Configuration validation and startup checks

const validateEnvironment = () => {
  const errors = [];
  const warnings = [];

  // Check optional environment variables (API keys are now user-provided)
  if (!process.env.PORT) {
    warnings.push('PORT not set - using default port 3000');
  }

  // Check rate limiting configuration
  const rateLimitWindow = parseInt(process.env.RATE_LIMIT_WINDOW_MS);
  const rateLimitMax = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS);

  if (rateLimitWindow && rateLimitWindow < 60000) {
    warnings.push('RATE_LIMIT_WINDOW_MS is very low (< 1 minute) - this may cause issues');
  }

  if (rateLimitMax && rateLimitMax > 1000) {
    warnings.push('RATE_LIMIT_MAX_REQUESTS is very high - consider lowering for security');
  }

  return { errors, warnings };
};

const validateAPIs = async () => {
  const results = {
    openai: { status: 'info', message: 'API keys provided by users via web interface' },
    elevenlabs: { status: 'info', message: 'API keys provided by users via web interface' }
  };

  return results;
};

const logValidationResults = (envValidation, apiValidation) => {
  console.log('\n=== AI Audio Translator - Startup Validation ===\n');

  // Environment validation
  if (envValidation.errors.length > 0) {
    console.log('❌ CRITICAL ERRORS:');
    envValidation.errors.forEach(error => console.log(`   • ${error}`));
    console.log('');
  }

  if (envValidation.warnings.length > 0) {
    console.log('⚠️  WARNINGS:');
    envValidation.warnings.forEach(warning => console.log(`   • ${warning}`));
    console.log('');
  }

  // API validation
  console.log('🔌 API CONNECTION STATUS:');
  Object.entries(apiValidation).forEach(([service, result]) => {
    const icon = result.status === 'success' ? '✅' : result.status === 'error' ? '❌' : result.status === 'info' ? 'ℹ️' : '⚠️';
    console.log(`   ${icon} ${service.toUpperCase()}: ${result.message}`);
  });

  console.log('\n=== Validation Complete ===\n');

  // Return whether app can start
  return envValidation.errors.length === 0;
};

const performStartupValidation = async () => {
  try {
    const envValidation = validateEnvironment();
    const apiValidation = await validateAPIs();
    
    const canStart = logValidationResults(envValidation, apiValidation);
    
    if (!canStart) {
      console.log('❌ Application cannot start due to critical errors.');
      console.log('Please fix the above errors and restart the application.\n');
      process.exit(1);
    }

    return { envValidation, apiValidation };
  } catch (error) {
    console.error('❌ Startup validation failed:', error.message);
    process.exit(1);
  }
};

module.exports = {
  validateEnvironment,
  validateAPIs,
  performStartupValidation
};
