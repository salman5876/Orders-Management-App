// Template configuration file
// Copy this file to config.js and fill in your actual values
// DO NOT commit config.js to version control

const CONFIG = {
  // API Configuration
  API_BASE_URL: 'https://your-api-domain.com/api',
  QR_API_ENDPOINT: '/game_qr_api.php',
  ORDER_API_ENDPOINT: '/game_qr_api.php',
  
  // Google Drive Links (replace with your actual links)
  TUTORIAL_VIDEO_LINK: 'https://drive.google.com/file/d/YOUR_TUTORIAL_FILE_ID/view?usp=drive_link',
  GUIDE_FILE_LINK: 'https://drive.google.com/file/d/YOUR_GUIDE_FILE_ID/view?usp=drive_link',
  
  // Security Settings
  ENABLE_DEBUG: false,
  LOG_API_CALLS: false,
  
  // Rate Limiting (if needed)
  MAX_REQUESTS_PER_MINUTE: 60,
  
  // Feature Flags
  ENABLE_QR_UPLOAD: true,
  ENABLE_ORDER_GENERATION: true,
  ENABLE_PDF_GENERATION: true
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
