// AI Audio Translator - Frontend JavaScript

$(document).ready(function() {
    // Global variables
    let currentTranslations = [];
    let currentTranslationId = null;
    let availableVoices = [];
    let selectedVoices = {};
    
    // LocalStorage management for translation history
    const STORAGE_KEY = 'aiAudioTranslationHistory';
    const API_KEYS_STORAGE_KEY = 'aiAudioAPIKeys';
    const MAX_HISTORY_ITEMS = 100; // Limit history to prevent localStorage overflow
    
    // Language flag mapping for visual appeal
    const languageFlags = {
        'zh-CN': '🇨🇳',
        'ru': '🇷🇺',
        'pl': '🇵🇱',
        'es': '🇪🇸',
        'pt': '🇵🇹',
        'de': '🇩🇪',
        'fr': '🇫🇷',
        'ja': '🇯🇵',
        'ko': '🇰🇷'
    };

    // Initialize event listeners and language selection
    initializeEventListeners();
    initializeLanguageSelection();
    initializeAPIKeys();
    
    // LocalStorage helper functions
    function saveTranslationToHistory(translationData) {
        try {
            const history = getTranslationHistory();
            const newTranslation = {
                id: generateTranslationId(),
                originalText: translationData.originalText,
                originalLanguage: 'en',
                translations: translationData.translations,
                createdAt: new Date().toISOString(),
                status: 'completed'
            };
            
            // Add to beginning of history
            history.unshift(newTranslation);
            
            // Keep only the most recent MAX_HISTORY_ITEMS
            if (history.length > MAX_HISTORY_ITEMS) {
                history.splice(MAX_HISTORY_ITEMS);
            }
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
            return newTranslation.id;
        } catch (error) {
            console.error('Failed to save translation to history:', error);
            return null;
        }
    }
    
    function getTranslationHistory() {
        try {
            const history = localStorage.getItem(STORAGE_KEY);
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('Failed to load translation history:', error);
            return [];
        }
    }
    
    function getTranslationById(id) {
        const history = getTranslationHistory();
        return history.find(item => item.id === id) || null;
    }
    
    function deleteTranslationFromHistory(id) {
        try {
            const history = getTranslationHistory();
            const filteredHistory = history.filter(item => item.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredHistory));
            return true;
        } catch (error) {
            console.error('Failed to delete translation from history:', error);
            return false;
        }
    }
    
    function updateTranslationInHistory(id, updatedTranslations) {
        try {
            const history = getTranslationHistory();
            const index = history.findIndex(item => item.id === id);
            if (index !== -1) {
                history[index].translations = updatedTranslations;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to update translation in history:', error);
            return false;
        }
    }
    
    function generateTranslationId() {
        return 'trans_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // API Key management functions
    function initializeAPIKeys() {
        // Load saved API keys from localStorage
        const savedKeys = getAPIKeys();
        if (savedKeys.openai) {
            $('#openaiKey').val(savedKeys.openai);
        }
        if (savedKeys.elevenlabs) {
            $('#elevenlabsKey').val(savedKeys.elevenlabs);
        }
        
        // Check if keys are present and update UI
        updateKeyStatus();
    }
    
    function getAPIKeys() {
        try {
            const keys = localStorage.getItem(API_KEYS_STORAGE_KEY);
            return keys ? JSON.parse(keys) : { openai: '', elevenlabs: '' };
        } catch (error) {
            console.error('Failed to load API keys:', error);
            return { openai: '', elevenlabs: '' };
        }
    }
    
    function saveAPIKeys(openaiKey, elevenlabsKey) {
        try {
            const keys = { openai: openaiKey, elevenlabs: elevenlabsKey };
            localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(keys));
            return true;
        } catch (error) {
            console.error('Failed to save API keys:', error);
            return false;
        }
    }
    
    function clearAPIKeys() {
        try {
            localStorage.removeItem(API_KEYS_STORAGE_KEY);
            $('#openaiKey').val('');
            $('#elevenlabsKey').val('');
            updateKeyStatus();
            return true;
        } catch (error) {
            console.error('Failed to clear API keys:', error);
            return false;
        }
    }
    
    function updateKeyStatus() {
        const keys = getAPIKeys();
        const hasOpenAI = keys.openai && keys.openai.trim() !== '';
        const hasElevenLabs = keys.elevenlabs && keys.elevenlabs.trim() !== '';
        
        if (hasOpenAI && hasElevenLabs) {
            $('#keysSaved').removeClass('d-none');
            $('#keysMissing').addClass('d-none');
        } else {
            $('#keysSaved').addClass('d-none');
            $('#keysMissing').removeClass('d-none');
        }
    }
    
    function validateAPIKeys() {
        const openaiKey = $('#openaiKey').val().trim();
        const elevenlabsKey = $('#elevenlabsKey').val().trim();
        
        if (!openaiKey || !elevenlabsKey) {
            showAlert('Please enter both OpenAI and ElevenLabs API keys.', 'warning');
            return false;
        }
        
        if (!openaiKey.startsWith('sk-')) {
            showAlert('OpenAI API key should start with "sk-"', 'warning');
            return false;
        }
        
        if (!elevenlabsKey.startsWith('sk_')) {
            showAlert('ElevenLabs API key should start with "sk_"', 'warning');
            return false;
        }
        
        return true;
    }
    
    // API Key event handlers
    function handleSaveKeys() {
        const openaiKey = $('#openaiKey').val().trim();
        const elevenlabsKey = $('#elevenlabsKey').val().trim();
        
        if (!validateAPIKeys()) {
            return;
        }
        
        if (saveAPIKeys(openaiKey, elevenlabsKey)) {
            showAlert('API keys saved successfully!', 'success');
            updateKeyStatus();
        } else {
            showAlert('Failed to save API keys. Please try again.', 'danger');
        }
    }
    
    function handleClearKeys() {
        if (confirm('Are you sure you want to clear all API keys? This will prevent the application from working.')) {
            if (clearAPIKeys()) {
                showAlert('API keys cleared successfully!', 'info');
            } else {
                showAlert('Failed to clear API keys. Please try again.', 'danger');
            }
        }
    }
    
    function handleShowKeys() {
        const showKeys = $('#showKeys').is(':checked');
        $('#openaiKey, #elevenlabsKey').attr('type', showKeys ? 'text' : 'password');
    }
    
    function initializeEventListeners() {
        // Translation form submission
        $('#translationForm').on('submit', handleTranslationSubmit);
        
        // Audio generation button
        $('#generateAudioBtn').on('click', handleAudioGeneration);
        
        // Voice selection buttons
        $('#loadVoicesBtn').on('click', loadAvailableVoices);
        
        // Character counter for input text
        $('#inputText').on('input', updateCharacterCount);
        
        // Language selection buttons
        $('#selectDefaultBtn').on('click', selectDefaultLanguages);
        $('#selectAllBtn').on('click', selectAllLanguages);
        $('#clearAllBtn').on('click', clearAllLanguages);
        
        // API Key management buttons
        $('#saveKeysBtn').on('click', handleSaveKeys);
        $('#clearKeysBtn').on('click', handleClearKeys);
        $('#showKeys').on('change', handleShowKeys);
        $('#openaiKey, #elevenlabsKey').on('input', updateKeyStatus);
        
        // Event delegation for dynamically created buttons
        $(document).on('click', '.download-btn', handleDownloadClick);
        $(document).on('click', '.preview-voice-btn', handlePreviewVoiceClick);
        $(document).on('click', '.close-voice-preview-btn', handleCloseVoicePreviewClick);
        $(document).on('click', '.retry-audio-btn', handleRetryAudioClick);
        $(document).on('change', '.language-checkbox', updateLanguageSelection);
    }
    
    function updateCharacterCount() {
        const text = $('#inputText').val();
        const count = text.length;
        const maxLength = 5000;
        
        $('#charCount').text(count);
        
        // Update styling based on character count
        const charCountElement = $('#charCount');
        charCountElement.removeClass('text-warning text-danger text-success');
        
        if (count > maxLength * 0.9) {
            charCountElement.addClass('text-danger');
        } else if (count > maxLength * 0.8) {
            charCountElement.addClass('text-warning');
        } else if (count > 0) {
            charCountElement.addClass('text-success');
        }
    }
    
    async function handleTranslationSubmit(e) {
        e.preventDefault();
        
        // Check if API keys are available
        const keys = getAPIKeys();
        if (!keys.openai || !keys.elevenlabs) {
            showAlert('Please enter and save your API keys before translating.', 'warning');
            return;
        }
        
        const text = $('#inputText').val().trim();
        const selectedLanguages = getSelectedLanguages();
        
        if (!text) {
            showAlert('Please enter some text to translate.', 'warning');
            return;
        }
        
        if (selectedLanguages.length === 0) {
            showAlert('Please select at least one language for translation.', 'warning');
            return;
        }
        
        if (text.length > 5000) {
            showAlert('Text must be less than 5000 characters.', 'danger');
            return;
        }
        
        // Show loading state
        showLoadingState(true);
        showProgressSection(true);
        updateProgress(10, 'Starting translation process...');
        
        try {
            // Call translation API with selected languages and user's API keys
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    text: text,
                    targetLanguages: selectedLanguages,
                    openaiKey: keys.openai,
                    elevenlabsKey: keys.elevenlabs
                })
            });
            
            updateProgress(50, 'Processing translations...');
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Translation failed');
            }
            
            const data = await response.json();
            
            updateProgress(90, 'Finalizing results...');
            
            if (data.success) {
                currentTranslations = data.translations;
                
                // Save to localStorage instead of relying on database ID
                currentTranslationId = saveTranslationToHistory({
                    originalText: data.originalText,
                    translations: data.translations
                });
                
                displayTranslationResults(data.originalText, data.translations);
                displayVoiceSelection(data.translations);
                updateProgress(100, 'Translation completed successfully!');
                
                // Hide progress after a short delay
                setTimeout(() => {
                    showProgressSection(false);
                }, 2000);
                
            } else {
                throw new Error(data.message || 'Translation failed');
            }
            
        } catch (error) {
            console.error('Translation error:', error);
            showAlert(`Translation failed: ${error.message}`, 'danger');
            showProgressSection(false);
        } finally {
            showLoadingState(false);
        }
    }
    
    function displayTranslationResults(originalText, translations) {
        // Show original text
        $('#originalTextContent').text(originalText);
        $('#originalTextDisplay').show();
        
        // Clear previous results
        $('#translationResults').empty();
        
        // Display each translation
        translations.forEach((translation, index) => {
            const flag = languageFlags[translation.language] || '🌐';
            const cardHtml = `
                <div class="col-lg-6 col-md-12 mb-3">
                    <div class="card translation-card lang-${translation.language}">
                        <div class="card-header">
                            <h5 class="card-title mb-0">
                                <span class="language-flag">${flag}</span>
                                ${translation.languageName}
                                <small class="opacity-75">(${translation.language})</small>
                            </h5>
                        </div>
                        <div class="card-body">
                            <div class="translation-text" id="translation-${index}">${translation.text}</div>
                            <div class="audio-controls" id="audio-controls-${index}" style="display: none;">
                                <audio controls class="audio-player" id="audio-${index}">
                                    Your browser does not support the audio element.
                                </audio>
                                <button class="btn btn-sm btn-success download-btn" data-language="${translation.language}" data-index="${index}">
                                    <i class="fas fa-download me-1"></i>Download
                                </button>
                            </div>
                            <div class="text-center mt-2" id="audio-status-${index}">
                                <small class="text-muted">Audio not generated yet</small>
                            </div>
                            <div class="text-center mt-2" id="retry-audio-${index}" style="display: none;">
                                <button class="btn btn-sm btn-warning retry-audio-btn" data-language="${translation.language}" data-index="${index}">
                                    <i class="fas fa-redo me-1"></i>Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            $('#translationResults').append(cardHtml);
        });
        
        // Show results and voice selection sections
        $('#resultsSection').show();
        $('#voiceSelectionSection').show();
        
        // Show audio section button - it will be enabled after voices are loaded
        $('#audioSection').show();
        $('#generateAudioBtn').prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Loading voices...');
    }
    
    function displayVoiceSelection(translations) {
        // Clear previous voice selection
        $('#voiceSelectionCards').empty();
        
        translations.forEach((translation, index) => {
            const flag = languageFlags[translation.language] || '🌐';
            const voiceCardHtml = `
                <div class="col-lg-6 col-md-12 mb-3">
                    <div class="card">
                        <div class="card-header bg-info text-white">
                            <h6 class="card-title mb-0">
                                <span class="language-flag">${flag}</span>
                                ${translation.languageName}
                                <small class="opacity-75">(${translation.language})</small>
                            </h6>
                        </div>
                        <div class="card-body">
                            <div class="mb-2">
                                <label class="form-label small">Select Voice:</label>
                                <select class="form-select form-select-sm" id="voiceSelect-${index}" data-language="${translation.language}">
                                    <option value="">Loading voices...</option>
                                </select>
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted">Default: Will (Conversational & Laid Back)</small>
                                <button class="btn btn-sm btn-outline-primary preview-voice-btn" data-language="${translation.language}" data-index="${index}">
                                    <i class="fas fa-play me-1"></i>Preview
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            $('#voiceSelectionCards').append(voiceCardHtml);
        });
        
        // Load voices for all selects
        loadAvailableVoices();
        
        // Add event listeners for voice selection changes
        setTimeout(() => {
            currentTranslations.forEach((translation, index) => {
                $(`#voiceSelect-${index}`).on('change', function() {
                    checkAudioGenerationReady();
                });
            });
        }, 1000);
    }
    
    async function loadAvailableVoices() {
        // Check if API keys are available
        const keys = getAPIKeys();
        if (!keys.elevenlabs) {
            showAlert('Please enter and save your ElevenLabs API key before loading voices.', 'warning');
            return;
        }
        
        showVoicesLoadingState(true);
        
        try {
            const response = await fetch(`/api/audio/voices?elevenlabsKey=${encodeURIComponent(keys.elevenlabs)}`);
            const data = await response.json();
            
            if (data.success) {
                availableVoices = data.voices;
                populateVoiceSelects();
                showAlert('Available voices loaded successfully!', 'success');
            } else {
                throw new Error(data.message || 'Failed to load voices');
            }
            
        } catch (error) {
            console.error('Error loading voices:', error);
            showAlert(`Failed to load voices: ${error.message}`, 'danger');
            
            // Fallback to default voices
            populateVoiceSelectsWithDefaults();
        } finally {
            showVoicesLoadingState(false);
        }
    }
    
    function populateVoiceSelects() {
        currentTranslations.forEach((translation, index) => {
            const select = $(`#voiceSelect-${index}`);
            select.empty();
            
            // Add default option (Will's voice)
            select.append('<option value="" selected>Will (Default)</option>');
            
            // Add available voices
            availableVoices.forEach(voice => {
                const selected = selectedVoices[translation.language] === voice.voice_id ? 'selected' : '';
                select.append(`<option value="${voice.voice_id}" ${selected}>${voice.name}</option>`);
            });
        });
        
        // Enable audio generation button since we have default voices
        checkAudioGenerationReady();
    }
    
    function populateVoiceSelectsWithDefaults() {
        currentTranslations.forEach((translation, index) => {
            const select = $(`#voiceSelect-${index}`);
            select.empty();
            select.append('<option value="" selected>Will (Default)</option>');
            select.append('<option value="" disabled>Voice loading failed - using defaults</option>');
        });
        
        // Enable audio generation button since we have default voices
        checkAudioGenerationReady();
    }
    
    function showVoicesLoadingState(show) {
        const button = $('#loadVoicesBtn');
        const spinner = $('#voicesLoadingSpinner');
        
        if (show) {
            button.prop('disabled', true);
            spinner.removeClass('d-none');
        } else {
            button.prop('disabled', false);
            spinner.addClass('d-none');
        }
    }
    
    function collectSelectedVoices() {
        const translationsWithVoices = currentTranslations.map((translation, index) => {
            const voiceSelect = $(`#voiceSelect-${index}`);
            const selectedVoiceId = voiceSelect.val();
            
            // Store the selected voice for this language
            if (selectedVoiceId) {
                selectedVoices[translation.language] = selectedVoiceId;
            }
            
            return {
                ...translation,
                selectedVoiceId: selectedVoiceId || null
            };
        });
        
        return translationsWithVoices;
    }
    
    // Event handlers for dynamically created buttons
    function handleDownloadClick(e) {
        e.preventDefault();
        e.stopPropagation();
        const language = $(this).data('language');
        const index = $(this).data('index');
        
        if (index !== undefined) {
            // This is from the main translation results
            const translation = currentTranslations[index];
            if (translation && translation.audioUrl) {
                downloadAudio(language, translation.audioUrl);
            } else {
                showAlert('Audio not available for download.', 'warning');
            }
        } else {
            // This is from the history modal
            const audioUrl = $(this).data('audio-url');
            downloadAudio(language, audioUrl);
        }
    }
    
    function handlePreviewVoiceClick(e) {
        e.preventDefault();
        e.stopPropagation();
        const language = $(this).data('language');
        const index = $(this).data('index');
        previewVoice(language, index);
    }
    
    function handleCloseVoicePreviewClick(e) {
        e.preventDefault();
        e.stopPropagation();
        const voiceId = $(this).data('voice-id');
        closeVoicePreview(voiceId);
    }
    
    function handleRetryAudioClick(e) {
        e.preventDefault();
        e.stopPropagation();
        const language = $(this).data('language');
        const index = $(this).data('index');
        retryAudioGeneration(language, index);
    }
    
    // Voice preview function
    function previewVoice(language, index) {
        const voiceSelect = $(`#voiceSelect-${index}`);
        const selectedVoiceId = voiceSelect.val();
        
        if (!selectedVoiceId) {
            showAlert('Please select a voice first to preview.', 'warning');
            return;
        }
        
        // Find the voice details
        const voice = availableVoices.find(v => v.voice_id === selectedVoiceId);
        if (!voice) {
            showAlert('Voice not found.', 'error');
            return;
        }
        
        // Create preview text (sample text in the target language)
        const previewText = getPreviewText(language);
        
        // Generate preview audio
        generateVoicePreview(previewText, selectedVoiceId, voice.name);
    }
    
    function getPreviewText(language) {
        const previewTexts = {
            'zh-CN': '你好，这是一个语音预览。',
            'ru': 'Привет, это превью голоса.',
            'pl': 'Cześć, to jest podgląd głosu.',
            'es': 'Hola, esta es una vista previa de voz.',
            'pt': 'Olá, esta é uma prévia de voz.',
            'de': 'Hallo, das ist eine Sprachvorschau.',
            'fr': 'Bonjour, ceci est un aperçu vocal.',
            'ja': 'こんにちは、これは音声プレビューです。',
            'ko': '안녕하세요, 이것은 음성 미리보기입니다.'
        };
        
        return previewTexts[language] || 'Hello, this is a voice preview.';
    }
    
    async function generateVoicePreview(text, voiceId, voiceName) {
        try {
            showAlert(`Generating preview for ${voiceName}...`, 'info');
            
            const response = await fetch('/api/audio/generate-single', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    language: 'en', // Use English for preview
                    languageName: 'Preview',
                    voiceId: voiceId
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Preview generation failed');
            }
            
            const data = await response.json();
            
            if (data.success) {
                // Create temporary audio player for preview
                const previewHtml = `
                    <div class="alert alert-info mt-2" id="voicePreview-${voiceId}">
                        <div class="d-flex align-items-center justify-content-between">
                            <span><i class="fas fa-volume-up me-2"></i>Voice Preview: ${voiceName}</span>
                            <button class="btn btn-sm btn-outline-secondary close-voice-preview-btn" data-voice-id="${voiceId}">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <audio controls class="audio-player mt-2" style="width: 100%;">
                            <source src="${data.audioUrl}" type="audio/mpeg">
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                `;
                
                // Insert preview below the voice selection card
                $(`#voiceSelect-${Object.keys(selectedVoices).length}`).closest('.card').after(previewHtml);
                
                showAlert(`Voice preview ready for ${voiceName}!`, 'success');
            } else {
                throw new Error(data.message || 'Preview generation failed');
            }
            
        } catch (error) {
            console.error('Voice preview error:', error);
            showAlert(`Voice preview failed: ${error.message}`, 'danger');
        }
    }
    
    // Close voice preview function
    function closeVoicePreview(voiceId) {
        $(`#voicePreview-${voiceId}`).remove();
    }
    
    function checkAudioGenerationReady() {
        // Check if voice selects are populated (they should always have default selected)
        let hasSelection = false;
        
        currentTranslations.forEach((translation, index) => {
            const voiceSelect = $(`#voiceSelect-${index}`);
            if (voiceSelect.length && voiceSelect.val() !== undefined) {
                hasSelection = true;
            }
        });
        
        if (hasSelection) {
            $('#generateAudioBtn').prop('disabled', false).html('<i class="fas fa-play me-2"></i>Generate Audio with Will\'s Voice');
        } else {
            $('#generateAudioBtn').prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Loading voices...');
        }
    }
    
    async function handleAudioGeneration() {
        // Check if API keys are available
        const keys = getAPIKeys();
        if (!keys.openai || !keys.elevenlabs) {
            showAlert('Please enter and save your API keys before generating audio.', 'warning');
            return;
        }
        
        if (currentTranslations.length === 0) {
            showAlert('No translations available for audio generation.', 'warning');
            return;
        }
        
        // Collect selected voices
        const translationsWithVoices = collectSelectedVoices();
        
        // Show loading state
        showAudioLoadingState(true);
        showProgressSection(true);
        updateProgress(10, 'Starting audio generation...');
        
        try {
            const response = await fetch('/api/audio/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    translations: translationsWithVoices,
                    translationId: currentTranslationId,
                    openaiKey: keys.openai,
                    elevenlabsKey: keys.elevenlabs
                })
            });
            
            updateProgress(50, 'Generating audio files...');
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Audio generation failed');
            }
            
            const data = await response.json();
            
            updateProgress(90, 'Processing audio results...');
            
            if (data.success) {
                currentTranslations = data.translations;
                
                // Update localStorage with audio URLs
                if (currentTranslationId) {
                    updateTranslationInHistory(currentTranslationId, data.translations);
                }
                
                displayAudioResults(data.translations);
                updateProgress(100, 'Audio generation completed!');
                
                // Hide progress after a short delay
                setTimeout(() => {
                    showProgressSection(false);
                }, 2000);
                
            } else {
                throw new Error(data.message || 'Audio generation failed');
            }
            
        } catch (error) {
            console.error('Audio generation error:', error);
            showAlert(`Audio generation failed: ${error.message}`, 'danger');
            showProgressSection(false);
        } finally {
            showAudioLoadingState(false);
        }
    }
    
    function displayAudioResults(translations) {
        let successCount = 0;
        let failureCount = 0;
        
        translations.forEach((translation, index) => {
            const audioControls = $(`#audio-controls-${index}`);
            const audioStatus = $(`#audio-status-${index}`);
            const retrySection = $(`#retry-audio-${index}`);
            const audioPlayer = $(`#audio-${index}`);
            
            if (translation.audioGenerated && translation.audioUrl) {
                // Show audio player
                audioPlayer.attr('src', translation.audioUrl);
                audioControls.show();
                audioStatus.html('<small class="text-success"><i class="fas fa-check-circle me-1"></i>Audio ready</small>');
                retrySection.hide();
                successCount++;
            } else {
                // Show error state with retry button
                audioStatus.html('<small class="text-danger"><i class="fas fa-exclamation-circle me-1"></i>Audio generation failed</small>');
                retrySection.show();
                failureCount++;
            }
        });
        
        // Show appropriate completion message
        if (failureCount === 0) {
            showAlert('Audio generation completed! You can now play and download the audio files.', 'success');
        } else if (successCount === 0) {
            showAlert('Audio generation failed for all languages. Please try again or check your ElevenLabs API key.', 'danger');
        } else {
            showAlert(`Audio generation completed with ${successCount} successes and ${failureCount} failures. Use the "Try Again" buttons to retry failed languages.`, 'warning');
        }
    }
    
    // Utility functions
    function showLoadingState(show) {
        const button = $('#translateBtn');
        const spinner = $('#loadingSpinner');
        
        if (show) {
            button.prop('disabled', true);
            spinner.removeClass('d-none');
        } else {
            button.prop('disabled', false);
            spinner.addClass('d-none');
        }
    }
    
    function showAudioLoadingState(show) {
        const button = $('#generateAudioBtn');
        const spinner = $('#audioLoadingSpinner');
        
        if (show) {
            button.prop('disabled', true);
            spinner.removeClass('d-none');
        } else {
            button.prop('disabled', false);
            spinner.addClass('d-none');
        }
    }
    
    function showProgressSection(show) {
        if (show) {
            $('#progressSection').show();
        } else {
            $('#progressSection').hide();
        }
    }
    
    function updateProgress(percentage, text) {
        $('#progressBar')
            .css('width', percentage + '%')
            .attr('aria-valuenow', percentage);
        $('#progressText').text(text);
    }
    
    function showAlert(message, type) {
        // Remove existing alerts
        $('.custom-alert').remove();
        
        const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show custom-alert" role="alert">
                <i class="fas fa-${getAlertIcon(type)} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        $('main .container').prepend(alertHtml);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            $('.custom-alert').alert('close');
        }, 5000);
    }
    
    function getAlertIcon(type) {
        const icons = {
            'success': 'check-circle',
            'danger': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    // Retry audio generation for a single language
    async function retryAudioGeneration(language, index) {
        // Check if API keys are available
        const keys = getAPIKeys();
        if (!keys.openai || !keys.elevenlabs) {
            showAlert('Please enter and save your API keys before generating audio.', 'warning');
            return;
        }
        
        const translation = currentTranslations[index];
        if (!translation) {
            showAlert('Translation not found for retry.', 'error');
            return;
        }

        // Show loading state for this specific language
        const retryBtn = $(`#retry-audio-${index} .retry-audio-btn`);
        const originalText = retryBtn.html();
        retryBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-1"></i>Retrying...');
        
        // Hide the retry button and show loading status
        $(`#retry-audio-${index}`).hide();
        $(`#audio-status-${index}`).html('<small class="text-info"><i class="fas fa-spinner fa-spin me-1"></i>Retrying audio generation...</small>');

        try {
            // Get the selected voice for this language
            const voiceSelect = $(`#voiceSelect-${index}`);
            const selectedVoiceId = voiceSelect.val();
            
            // Generate audio for this single translation
            const response = await fetch('/api/audio/generate-single', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: translation.text,
                    language: language,
                    languageName: translation.languageName,
                    voiceId: selectedVoiceId,
                    openaiKey: keys.openai,
                    elevenlabsKey: keys.elevenlabs
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Audio generation failed');
            }

            const data = await response.json();
            
            if (data.success) {
                // Update the translation with the new audio URL
                currentTranslations[index].audioUrl = data.audioUrl;
                currentTranslations[index].audioGenerated = true;
                
                // Update localStorage with the new audio URL
                if (currentTranslationId) {
                    updateTranslationInHistory(currentTranslationId, currentTranslations);
                }
                
                // Update the UI
                const audioControls = $(`#audio-controls-${index}`);
                const audioPlayer = audioControls.find('audio');
                const downloadBtn = audioControls.find('.download-btn');
                
                // Update audio player
                audioPlayer.attr('src', data.audioUrl);
                audioControls.show();
                
                // Update status
                $(`#audio-status-${index}`).html('<small class="text-success"><i class="fas fa-check-circle me-1"></i>Audio ready</small>');
                
                // Hide retry button
                $(`#retry-audio-${index}`).hide();
                
                showAlert(`Audio generated successfully for ${translation.languageName}!`, 'success');
            } else {
                throw new Error(data.message || 'Audio generation failed');
            }
            
        } catch (error) {
            console.error('Retry audio generation error:', error);
            
            // Show error status and retry button
            $(`#audio-status-${index}`).html('<small class="text-danger"><i class="fas fa-exclamation-circle me-1"></i>Audio generation failed</small>');
            $(`#retry-audio-${index}`).show();
            
            showAlert(`Retry failed for ${translation.languageName}: ${error.message}`, 'danger');
        } finally {
            // Reset button state
            retryBtn.prop('disabled', false).html(originalText);
        }
    }

    // Download audio function
    function downloadAudio(language, audioUrl) {
        if (audioUrl) {
            const link = document.createElement('a');
            link.href = audioUrl;
            link.download = `translation_${language}_${Date.now()}.mp3`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showAlert(`Audio file for ${language} downloaded!`, 'success');
        } else {
            showAlert('Audio URL not available for download.', 'warning');
        }
    }
    
    // Error handling for audio elements
    $(document).on('error', 'audio', function() {
        const audioElement = $(this);
        const index = audioElement.attr('id').split('-')[1];
        $(`#audio-status-${index}`).html('<small class="text-danger"><i class="fas fa-exclamation-circle me-1"></i>Audio playback error</small>');
    });
    
    // Handle audio load events
    $(document).on('loadeddata', 'audio', function() {
        const audioElement = $(this);
        const index = audioElement.attr('id').split('-')[1];
        $(`#audio-status-${index}`).html('<small class="text-success"><i class="fas fa-volume-up me-1"></i>Ready to play</small>');
    });

    // Language selection functions
    function initializeLanguageSelection() {
        // This will be populated by the server-side template
        // The languages are passed from the server in the template
    }

    function selectDefaultLanguages() {
        // Default languages: English, Chinese, Russian, Polish, Spanish, Portuguese, German, French, Japanese, Korean
        const defaultCodes = ['en', 'zh', 'ru', 'pl', 'es', 'pt', 'de', 'fr', 'ja', 'ko'];
        $('.language-checkbox').prop('checked', false);
        defaultCodes.forEach(code => {
            $(`.language-checkbox[value="${code}"]`).prop('checked', true);
        });
        updateLanguageSelection();
        showAlert('Selected 10 default languages', 'info');
    }

    function selectAllLanguages() {
        $('.language-checkbox').prop('checked', true);
        updateLanguageSelection();
        const count = $('.language-checkbox:checked').length;
        showAlert(`Selected all ${count} languages`, 'info');
    }

    function clearAllLanguages() {
        $('.language-checkbox').prop('checked', false);
        updateLanguageSelection();
        showAlert('Cleared all language selections', 'warning');
    }

    function updateLanguageSelection() {
        const selectedCount = $('.language-checkbox:checked').length;
        const translateBtn = $('#translateBtn');
        
        if (selectedCount === 0) {
            translateBtn.prop('disabled', true);
            translateBtn.html('<i class="fas fa-language me-2"></i>Select at least one language');
        } else {
            translateBtn.prop('disabled', false);
            translateBtn.html(`<i class="fas fa-language me-2"></i>Translate into ${selectedCount} language${selectedCount > 1 ? 's' : ''} <div class="spinner-border spinner-border-sm ms-2 d-none" id="loadingSpinner"></div>`);
        }
    }

    function getSelectedLanguages() {
        const selected = [];
        $('.language-checkbox:checked').each(function() {
            const checkbox = $(this);
            selected.push({
                code: checkbox.val(),
                name: checkbox.data('name'),
                flag: checkbox.data('flag'),
                openaiCode: checkbox.data('openai-code')
            });
        });
        return selected;
    }
});
