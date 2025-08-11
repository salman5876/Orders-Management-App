// Configuration file for sensitive data
// This file should be kept secure and not shared publicly

const CONFIG = {
  // API Configuration
  API_BASE_URL: 'https://thedevknights.com/api',
  QR_API_ENDPOINT: '/game_qr_api.php',
  ORDER_API_ENDPOINT: '/game_qr_api.php',
  
  // Google Drive Links (consider making these dynamic)
  TUTORIAL_VIDEO_LINK: 'https://drive.google.com/file/d/1aIdIViznlep6ZORwhR631nf0KMoiyPMT/view?usp=drive_link',
  GUIDE_FILE_LINK: 'https://drive.google.com/file/d/1pxtpnNABQWr9izLygu6uznqJlrWkl0_r/view?usp=drive_link',
  
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
