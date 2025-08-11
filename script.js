/* Navigation */
const views = {
  home: document.getElementById('home'),
  game: document.getElementById('gameFilesView'),
  qr: document.getElementById('qrView'),
  orders: document.getElementById('ordersView'),
  mergeFiles: document.getElementById('mergeFilesView'),
};

function showView(key) {
  Object.values(views).forEach(v => v.classList.remove('active'));
  if (key === 'game') views.game.classList.add('active');
  else if (key === 'qr') views.qr.classList.add('active');
  else if (key === 'orders') views.orders.classList.add('active');
  else if (key === 'mergeFiles') views.mergeFiles.classList.add('active');
  else views.home.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Home action cards navigation
document.querySelectorAll('.action-card').forEach(card => {
  card.addEventListener('click', () => {
    const target = card.getAttribute('data-target');
    showView(target);
  });
  card.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const target = card.getAttribute('data-target');
      showView(target);
    }
  });
});

document.querySelectorAll('[data-back]').forEach(btn => btn.addEventListener('click', () => showView('home')));

/* Generate PDF for Game Files */
const pdfButton = document.getElementById('btnGeneratePdf');

pdfButton.addEventListener('click', async () => {
  await generateAndSavePDF();
});

async function generateAndSavePDF() {
  const gameName = document.getElementById('gameName').value.trim();
  const gameSize = document.getElementById('gameSize').value.trim();
  const linksRaw = document.getElementById('gameLinks').value.trim();

  if (!gameName && !linksRaw) {
    alert('Please enter at least a game name or some links.');
    return;
  }

  const links = linksRaw
    ? linksRaw.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
    : [];

  // Create PDF with enhanced structure and borders
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'letter' }); // 612x792 points

  // Page dimensions
  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 30;
  const contentWidth = pageWidth - (margin * 2);
  let cursorY = margin + 30;

  // Draw complete border around page
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(2);
  doc.rect(margin, margin, contentWidth, pageHeight - (margin * 2));

  // 1. Red warning text at top (centered, bold)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 0, 0); // Red color
  const warningText = "PLEASE DON'T SHARE QR CODE IMAGE IN REVIEW";
  const warningWidth = doc.getTextWidth(warningText);
  doc.text(warningText, (pageWidth - warningWidth) / 2, cursorY);
  cursorY += 30;

  // 2. Product Name (all caps, bold)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); // Black color
  const productText = `PRODUCT NAME: ${gameName.toUpperCase()}`;
  doc.text(productText, margin + 20, cursorY);
  cursorY += 25;

  // 3. First black divider line (5px)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(2);
  doc.line(margin + 20, cursorY, pageWidth - margin - 20, cursorY);
  cursorY += 25;

  // 4. File Size information
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  const sizeText = gameSize ? `File Size: ${gameSize}` : `File Size: ${links.length > 1 ? `${links.length} parts` : 'Single file'}`;
  doc.text(sizeText, margin + 20, cursorY);
  cursorY += 25;

  // 5. Second black divider line (5px)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(2);
  doc.line(margin + 20, cursorY, pageWidth - margin - 20, cursorY);
  cursorY += 25;

  // 6. Note about password (red, bold, caps)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 0, 0); // Red color
  const noteText = "NOTE: PASSWORD IS WRITTEN ON GUIDE GIVEN INSIDE PARCEL";
  doc.text(noteText, margin + 20, cursorY);
  cursorY += 25;

  // 7. Third black divider line (5px)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(2);
  doc.line(margin + 20, cursorY, pageWidth - margin - 20, cursorY);
  cursorY += 25;

  // 8. Links section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text("Links:", margin + 20, cursorY);
  cursorY += 20;

  // Add each link
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 255); // Blue color for links
  
  links.forEach((link, index) => {
    // Check if link fits on current page
    if (cursorY > pageHeight - margin - 50) {
      doc.addPage();
      cursorY = margin + 30;
      // Draw border on new page
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(2);
      doc.rect(margin, margin, contentWidth, pageHeight - (margin * 2));
    }
    
    doc.text(link, margin + 20, cursorY);
    
    // Add clickable link
    const linkWidth = doc.getTextWidth(link);
    doc.link(margin + 20, cursorY - 10, linkWidth, 15, { url: link });
    
    cursorY += 18;
  });

  // 9. Fourth black divider line (5px)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(2);
  doc.line(margin + 20, cursorY, pageWidth - margin - 20, cursorY);
  cursorY += 25;

  // 10. Expired links warning (red, bold)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 0, 0); // Red color
  const expiredText = "NOTE: IF LINKS ARE EXPIRED OR NOT WORKING CONTACT TO SELLER";
  doc.text(expiredText, margin + 20, cursorY);
  cursorY += 25;

  // 11. Fifth black divider line (5px)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(2);
  doc.line(margin + 20, cursorY, pageWidth - margin - 20, cursorY);
  cursorY += 25;


  // 13. Tutorial Video Link
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text("Tutorial Video Link:", margin + 20, cursorY);
  cursorY += 15;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 255);
  const tutorialLink = CONFIG.TUTORIAL_VIDEO_LINK;
  doc.text(tutorialLink, margin + 20, cursorY);
  doc.link(margin + 20, cursorY - 10, doc.getTextWidth(tutorialLink), 15, { url: tutorialLink });
  cursorY += 25;

  // 14. Seventh black divider line (5px)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(2);
  doc.line(margin + 20, cursorY, pageWidth - margin - 20, cursorY);
  cursorY += 25;

  // 15. Guide File Link
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text("Guide File Link:", margin + 20, cursorY);
  cursorY += 15;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 255);
  const guideLink = CONFIG.GUIDE_FILE_LINK;
  doc.text(guideLink, margin + 20, cursorY);
  doc.link(margin + 20, cursorY - 10, doc.getTextWidth(guideLink), 15, { url: guideLink });
  cursorY += 25;

  // 16. Final black divider line (5px)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(2);
  doc.line(margin + 20, cursorY, pageWidth - margin - 20, cursorY);

  const safeName = (gameName || 'game').replace(/[^a-z0-9\-_. ]/gi, '_');
  
  // Download locally
  doc.save(`${safeName}.pdf`);
}



/* QR Code Generation */
const qrBtn = document.getElementById('btnGenerateQr');
const qrCanvasHolder = document.getElementById('qrCanvas');
const qrNameEl = document.getElementById('qrName');
const qrResult = document.getElementById('qrResult');
const btnDownloadQr = document.getElementById('btnDownloadQr');
const btnUploadQr = document.getElementById('btnUploadQr');
const API_URL = CONFIG.API_BASE_URL + CONFIG.QR_API_ENDPOINT;

let qrInstance = null;

qrBtn.addEventListener('click', () => {
  const gameName = document.getElementById('qrGameName').value.trim();
  const link = document.getElementById('qrLink').value.trim();
  if (!link) { alert('Please enter a link'); return; }

  // Clear previous
  qrCanvasHolder.innerHTML = '';
  qrNameEl.textContent = '';

  const size = 160; // Fixed to fit 186x230 card with 8px padding
  qrInstance = new QRCode(qrCanvasHolder, {
    text: link,
    width: size,
    height: size,
    colorDark: '#0b0b0b',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H,
  });

  qrNameEl.textContent = gameName || 'QR';
  qrResult.classList.remove('hidden');
});

// Helper to get QR image element
function getQrImageElement() {
  return new Promise((resolve, reject) => {
    const img = qrCanvasHolder.querySelector('img');
    const canvas = qrCanvasHolder.querySelector('canvas');
    if (img) {
      if (img.complete) return resolve(img);
      img.onload = () => resolve(img);
      img.onerror = reject;
      return;
    }
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = dataUrl;
      return;
    }
    reject(new Error('QR not found'));
  });
}

// Draw rounded rect path
function roundedRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

// Ellipsis for text to fit max width
function ellipsize(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let end = text.length;
  let start = 0;
  let result = text;
  while (start < end) {
    const mid = Math.floor((start + end) / 2);
    const candidate = text.slice(0, mid) + '…';
    if (ctx.measureText(candidate).width <= maxWidth) {
      result = candidate;
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }
  return result;
}



btnDownloadQr.addEventListener('click', async () => {
  const name = (document.getElementById('qrGameName').value.trim() || 'QR').toUpperCase();
  const link = document.getElementById('qrLink').value.trim();
  if (!link) { alert('Please generate the QR first.'); return; }

  try {
    const img = await getQrImageElement();
    const cardW = 186;
    const cardH = 230;
    const padding = 8;
    const qrSize = 160; // fixed

    // spacing
    const qrTopMargin = 16;         // space above QR
    const qrBottomMargin = 8;       // space between QR and divider
    const dividerBottomMargin = 18;  // space between divider and text

    const canvas = document.createElement('canvas');
    canvas.width = cardW;
    canvas.height = cardH;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cardW, cardH);

    // Outer rounded border (transparent)
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'transparent';
    roundedRectPath(ctx, 1, 1, cardW - 2, cardH - 2, 8);
    ctx.stroke();

    // Inner inset border (3px black)
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000000';
    roundedRectPath(ctx, 5, 5, cardW - 10, cardH - 10, 6);
    ctx.stroke();

    // QR image (centered horizontally, with top margin)
    const qrX = (cardW - qrSize) / 2;
    ctx.drawImage(img, qrX, qrTopMargin, qrSize, qrSize);

    // Divider line (3px thick, black)
    ctx.fillStyle = '#000000';
    const dividerX = Math.floor(cardW * 0.1);
    const dividerW = Math.floor(cardW * 0.8);
    const dividerY = qrTopMargin + qrSize + qrBottomMargin;
    ctx.fillRect(dividerX, dividerY, dividerW, 3);

    // Game name (bottom, uppercase, with space after divider)
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 14px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
    const maxTextWidth = cardW - padding * 2;
    const text = ellipsize(ctx, name, maxTextWidth);
    const textY = dividerY + 3 + dividerBottomMargin; // divider height + margin
    ctx.fillText(text, cardW / 2, textY);

    // Download PNG
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `${name.replace(/[^a-z0-9\-_. ]/gi, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (err) {
    alert('Please generate the QR first.');
  }
});


// Upload QR (186x230) and name to DB
btnUploadQr.addEventListener('click', async () => {
  const name = (document.getElementById('qrGameName').value.trim() || 'QR').toUpperCase();
  const link = document.getElementById('qrLink').value.trim();
  if (!name) { alert('Please enter game name.'); return; }
  if (!link) { alert('Please generate the QR first.'); return; }

  try {
    const img = await getQrImageElement();
    const cardW = 186;
    const cardH = 230;
    const padding = 8;
    const qrSize = 160; // fixed

    // spacing
    const qrTopMargin = 16;         // space above QR
    const qrBottomMargin = 8;       // space between QR and divider
    const dividerBottomMargin = 18;  // space between divider and text

    const canvas = document.createElement('canvas');
    canvas.width = cardW;
    canvas.height = cardH;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cardW, cardH);

    // Outer rounded border (transparent)
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'transparent';
    roundedRectPath(ctx, 1, 1, cardW - 2, cardH - 2, 8);
    ctx.stroke();

    // Inner inset border (3px black)
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000000';
    roundedRectPath(ctx, 5, 5, cardW - 10, cardH - 10, 6);
    ctx.stroke();

    // QR image (centered horizontally, with top margin)
    const qrX = (cardW - qrSize) / 2;
    ctx.drawImage(img, qrX, qrTopMargin, qrSize, qrSize);

    // Divider line (3px thick, black)
    ctx.fillStyle = '#000000';
    const dividerX = Math.floor(cardW * 0.1);
    const dividerW = Math.floor(cardW * 0.8);
    const dividerY = qrTopMargin + qrSize + qrBottomMargin;
    ctx.fillRect(dividerX, dividerY, dividerW, 3);

    // Game name (uppercase, centered, with margin after divider)
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 14px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
    const maxTextWidth = cardW - padding * 2;
    const text = ellipsize(ctx, name, maxTextWidth);
    const textY = dividerY + 3 + dividerBottomMargin; // divider height + gap
    ctx.fillText(text, cardW / 2, textY);

    // Convert to Base64
    const imageBase64 = canvas.toDataURL('image/png');

    // Send to API
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, image: imageBase64 })
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok && (data.success || data.id || data.message === 'Game added successfully!')) {
      alert('Game QR uploaded successfully.');
    } else {
      alert('Upload failed. Please check your API endpoint.');
    }
  } catch (e) {
    alert('Network or generation error while uploading.');
  }
});

// Order Management System
const ORDER_API_URL = CONFIG.API_BASE_URL + CONFIG.ORDER_API_ENDPOINT;
let gameNames = []; // Will store game names from database

// Global storage for pre-fetched QR code images and pre-processed PDFs
let preFetchedQrCodes = new Map(); // Store: gameName -> Image object
let preProcessedPdfs = new Map(); // Store: 'pdf1'/'pdf2'/'packPdf' -> Image object

// Pre-process PDF when uploaded
async function preProcessPdf(pdfFile, pdfKey) {
  console.log(`Pre-processing PDF: ${pdfKey}`);
  
  try {
    // Convert PDF to image immediately
    const pdfImage = await convertPdfToImage(pdfFile);
    
    // Store in memory for instant access
    preProcessedPdfs.set(pdfKey, pdfImage);
    console.log(`PDF ${pdfKey} processed and stored in memory:`, pdfImage.width, 'x', pdfImage.height);
    
    // Update debug info
    updateDebugInfo();
    
  } catch (error) {
    console.error(`Error pre-processing PDF ${pdfKey}:`, error);
    alert(`Error processing PDF ${pdfKey}. Please try again.`);
  }
}

// Pre-fetch QR code when a game is selected
async function preFetchQrCode(gameName) {
  if (preFetchedQrCodes.has(gameName)) {
    console.log(`QR code for ${gameName} already in memory`);
    return;
  }
  
  console.log(`Pre-fetching QR code for: ${gameName}`);
  
  try {
    // Fetch QR code from your API
    const response = await fetch(`${ORDER_API_URL}?name=${encodeURIComponent(gameName)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`API response for ${gameName}:`, data);
      
      // Handle different API response structures
      let gameData = null;
      
      if (Array.isArray(data)) {
        // If API returns an array, find the matching game
        console.log(`API returned array of ${data.length} items, searching for: ${gameName}`);
        console.log(`First few items in array:`, data.slice(0, 3));
        gameData = data.find(game => 
          game.name && game.name.toLowerCase() === gameName.toLowerCase()
        );
        console.log(`Found game data:`, gameData);
        
        // If not found by exact name, try partial match
        if (!gameData) {
          console.log(`Exact match not found, trying partial match...`);
          gameData = data.find(game => 
            game.name && game.name.toLowerCase().includes(gameName.toLowerCase())
          );
          console.log(`Partial match result:`, gameData);
        }
      } else if (data.name && data.image) {
        // If API returns single game object
        gameData = data;
      } else if (data.games && Array.isArray(data.games)) {
        // If API returns {games: [...]}
        gameData = data.games.find(game => 
          game.name && game.name.toLowerCase() === gameName.toLowerCase()
        );
      }
      
      if (gameData && gameData.image) {
        console.log(`Found image for ${gameName}, converting base64...`);
        // Convert base64 to image and store in memory
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = gameData.image; // This is your base64 image data
        });
        console.log(`QR image loaded for ${gameName}:`, img.width, 'x', img.height);
        
        // Store in memory for instant access
        preFetchedQrCodes.set(gameName, img);
        console.log(`QR code for ${gameName} stored in memory`);
        
      } else {
        console.log(`No image found for ${gameName}, generating fallback`);
        // Generate fallback QR code and store in memory
        const fallbackQr = await generateFallbackQr(gameName);
        preFetchedQrCodes.set(gameName, fallbackQr);
        console.log(`Fallback QR for ${gameName} stored in memory`);
      }
    } else {
      console.log(`API failed for ${gameName}, generating fallback`);
      // Generate fallback QR code and store in memory
      const fallbackQr = await generateFallbackQr(gameName);
      preFetchedQrCodes.set(gameName, fallbackQr);
      console.log(`Fallback QR for ${gameName} stored in memory`);
    }
  } catch (error) {
    console.error(`Error fetching QR for ${gameName}:`, error);
    // Generate fallback QR code and store in memory
    const fallbackQr = await generateFallbackQr(gameName);
    preFetchedQrCodes.set(gameName, fallbackQr);
    console.log(`Fallback QR for ${gameName} stored in memory`);
  }
}

// Order type switching
document.getElementById('btnSingleOrder').addEventListener('click', () => {
  document.querySelectorAll('.order-type-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('btnSingleOrder').classList.add('active');
  document.getElementById('singleOrderForm').classList.remove('hidden');
  document.getElementById('packOrderForm').classList.add('hidden');
});

document.getElementById('btnPackOrder').addEventListener('click', () => {
  document.querySelectorAll('.order-type-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('btnPackOrder').classList.add('active');
  document.getElementById('singleOrderForm').classList.add('hidden');
  document.getElementById('packOrderForm').classList.remove('hidden');
  generatePackDropdowns();
});

document.getElementById('btnBigPackOrder').addEventListener('click', () => {
  document.querySelectorAll('.order-type-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('btnBigPackOrder').classList.add('active');
  document.getElementById('singleOrderForm').classList.add('hidden');
  document.getElementById('packOrderForm').classList.add('hidden');
  document.getElementById('bigPackOrderForm').classList.remove('hidden');
  generateBigPackDropdowns();
});

// Fetch game names from database
async function fetchGameNames() {
  try {
    const response = await fetch(ORDER_API_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      // Assuming the API returns an array of games with 'name' property
      gameNames = data.map(game => game.name) || [];
    } else {
      // Fallback: use some sample names for testing
      gameNames = [
        'Euro Truck Simulator 2',
        'Grand Theft Auto V',
        'Minecraft',
        'Red Dead Redemption 2',
        'The Witcher 3',
        'Cyberpunk 2077',
        'Assassin\'s Creed Valhalla',
        'Call of Duty: Warzone',
        'FIFA 23',
        'NBA 2K23',
        'Fortnite',
        'Apex Legends',
        'Valorant',
        'League of Legends',
        'Counter-Strike 2'
      ];
    }
  } catch (error) {
    console.error('Error fetching game names:', error);
    // Use fallback names
    gameNames = [
      'Euro Truck Simulator 2',
      'Grand Theft Auto V',
      'Minecraft',
      'Red Dead Redemption 2',
      'The Witcher 3'
    ];
  }
}

// Generate 12 dropdowns for pack orders
function generatePackDropdowns() {
  const packDropdowns = document.querySelector('.pack-dropdowns');
  packDropdowns.innerHTML = '';
  
  for (let i = 1; i <= 12; i++) {
    const dropdownItem = document.createElement('div');
    dropdownItem.className = 'game-dropdown-item';
    dropdownItem.innerHTML = `
      <label>Game ${i}</label>
      <div class="searchable-dropdown">
        <input type="text" class="dropdown-search" placeholder="Search games..." />
        <div class="dropdown-options hidden">
          <!-- Options will be populated from DB -->
        </div>
        <div class="selected-game">Select a game</div>
      </div>
    `;
    packDropdowns.appendChild(dropdownItem);
  }
  
  // Initialize all dropdowns
  initializeDropdowns();
}

// Generate 28 dropdowns for big pack orders
function generateBigPackDropdowns() {
  const bigPackDropdowns = document.querySelector('.big-pack-dropdowns');
  bigPackDropdowns.innerHTML = '';
  
  for (let i = 1; i <= 28; i++) {
    const dropdownItem = document.createElement('div');
    dropdownItem.className = 'game-dropdown-item';
    dropdownItem.innerHTML = `
      <label>Game ${i}</label>
      <div class="searchable-dropdown">
        <input type="text" class="dropdown-search" placeholder="Search games..." />
        <div class="dropdown-options hidden">
          <!-- Options will be populated from DB -->
        </div>
        <div class="selected-game">Select a game</div>
      </div>
    `;
    bigPackDropdowns.appendChild(dropdownItem);
  }
  
  // Initialize all dropdowns
  initializeDropdowns();
}

// Initialize searchable dropdowns
function initializeDropdowns() {
  const dropdowns = document.querySelectorAll('.searchable-dropdown');
  
  dropdowns.forEach(dropdown => {
    const searchInput = dropdown.querySelector('.dropdown-search');
    const optionsContainer = dropdown.querySelector('.dropdown-options');
    const selectedGame = dropdown.querySelector('.selected-game');
    
    // Initially hide search input and show selected game
    searchInput.style.display = 'none';
    selectedGame.style.display = 'block';
    
    // Populate options
    populateDropdownOptions(optionsContainer);
    
    // Search functionality
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      filterDropdownOptions(optionsContainer, searchTerm);
    });
    
    // Show search input and options when clicking on selected game
    selectedGame.addEventListener('click', () => {
      searchInput.style.display = 'block';
      selectedGame.style.display = 'none';
      optionsContainer.classList.remove('hidden');
      searchInput.focus();
    });
    
    // Hide options when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        optionsContainer.classList.add('hidden');
        searchInput.style.display = 'none';
        selectedGame.style.display = 'block';
        searchInput.value = '';
      }
    });
    
    // Handle Enter key on search input
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const firstVisibleOption = optionsContainer.querySelector('.dropdown-option:not([style*="display: none"])');
        if (firstVisibleOption) {
          selectGame(firstVisibleOption.textContent, dropdown);
        }
      }
    });
  });
}

// Select a game from dropdown
function selectGame(gameName, dropdown) {
  const searchInput = dropdown.querySelector('.dropdown-search');
  const selectedGame = dropdown.querySelector('.selected-game');
  const optionsContainer = dropdown.querySelector('.dropdown-options');
  
  selectedGame.textContent = gameName;
  searchInput.value = gameName;
  
  optionsContainer.classList.add('hidden');
  searchInput.style.display = 'none';
  selectedGame.style.display = 'block';
  
  // Pre-fetch QR code immediately when game is selected
  console.log(`Game selected: ${gameName}, pre-fetching QR code...`);
  preFetchQrCode(gameName);
  
  updateDebugInfo();
}

// Populate dropdown options with game names
function populateDropdownOptions(optionsContainer) {
  optionsContainer.innerHTML = '';
  
  if (gameNames.length === 0) {
    // Show loading or no data message
    const noDataOption = document.createElement('div');
    noDataOption.className = 'dropdown-option';
    noDataOption.textContent = 'No games available';
    noDataOption.style.color = '#9db0d1';
    noDataOption.style.fontStyle = 'italic';
    optionsContainer.appendChild(noDataOption);
    return;
  }
  
  gameNames.forEach(gameName => {
    const option = document.createElement('div');
    option.className = 'dropdown-option';
    option.textContent = gameName;
    option.addEventListener('click', () => {
      selectGame(gameName, option.closest('.searchable-dropdown'));
    });
    
    optionsContainer.appendChild(option);
  });
}

// Filter dropdown options based on search term
function filterDropdownOptions(optionsContainer, searchTerm) {
  const options = optionsContainer.querySelectorAll('.dropdown-option');
  
  options.forEach(option => {
    const gameName = option.textContent.toLowerCase();
    if (gameName.includes(searchTerm)) {
      option.style.display = 'block';
    } else {
      option.style.display = 'none';
    }
  });
}

// Handle single order generation
async function handleSingleOrderGeneration() {
  const selectedGames = getSelectedGames('#singleOrderForm');
  if (selectedGames.length !== 8) {
    alert('Please select exactly 8 games for single order (4 in each section).');
    return;
  }

  // Check if both PDFs are uploaded
  const pdf1 = document.getElementById('singlePdfUpload1').files[0];
  const pdf2 = document.getElementById('singlePdfUpload2').files[0];
  
  if (!pdf1 || !pdf2) {
    alert('Please upload both PDF files.');
    return;
  }

  // Show loading state
  const btn = document.getElementById('btnGenerateSingleOrder');
  btn.classList.add('loading');
  btn.textContent = 'Generating Order...';

  try {
    await generateSingleOrder(pdf1, pdf2, selectedGames);
    if (document.getElementById('qrStatus')) {
      document.getElementById('qrStatus').textContent = 'Order generated successfully!';
    }
  } catch (error) {
    console.error('Error generating order:', error);
    alert('Error generating order. Please try again.');
    if (document.getElementById('qrStatus')) {
      document.getElementById('qrStatus').textContent = 'Error generating order';
    }
  } finally {
    btn.classList.remove('loading');
    btn.textContent = 'Generate Order';
  }
}

// Handle pack order generation
async function handlePackOrderGeneration() {
  const selectedGames = getSelectedGames('#packOrderForm');
  if (selectedGames.length !== 12) {
    alert('Please select exactly 12 games for pack order.');
    return;
  }

  // Check if PDF is uploaded
  const packPdf = document.getElementById('packPdfUpload').files[0];
  
  if (!packPdf) {
    alert('Please upload a PDF file.');
    return;
  }

  // Show loading state
  const btn = document.getElementById('btnGeneratePackOrder');
  btn.classList.add('loading');
  btn.textContent = 'Generating Order...';

  try {
    await generatePackOrder(packPdf, selectedGames);
    if (document.getElementById('qrStatus')) {
      document.getElementById('qrStatus').textContent = 'Pack order generated successfully!';
    }
  } catch (error) {
    console.error('Error generating pack order:', error);
    alert('Error generating pack order. Please try again.');
    if (document.getElementById('qrStatus')) {
      document.getElementById('qrStatus').textContent = 'Error generating pack order';
    }
  } finally {
    btn.classList.remove('loading');
    btn.textContent = 'Generate Order';
  }
}

// Handle big pack order generation
async function handleBigPackOrderGeneration() {
  const selectedGames = getSelectedGames('#bigPackOrderForm');
  if (selectedGames.length !== 28) {
    alert('Please select exactly 28 games for big pack order.');
    return;
  }

  // Check if PDF is uploaded
  const bigPackPdf = document.getElementById('bigPackPdfUpload').files[0];
  
  if (!bigPackPdf) {
    alert('Please upload a PDF file.');
    return;
  }

  // Show loading state
  const btn = document.getElementById('btnGenerateBigPackOrder');
  btn.classList.add('loading');
  btn.textContent = 'Generating Order...';

  try {
    await generateBigPackOrder(bigPackPdf, selectedGames);
    if (document.getElementById('qrStatus')) {
      document.getElementById('qrStatus').textContent = 'Big pack order generated successfully!';
    }
  } catch (error) {
    console.error('Error generating big pack order:', error);
    alert('Error generating big pack order. Please try again.');
    if (document.getElementById('qrStatus')) {
      document.getElementById('qrStatus').textContent = 'Error generating big pack order';
    }
  } finally {
    btn.classList.remove('loading');
    btn.textContent = 'Generate Order';
  }
}

// Generate single order with A4 layout
async function generateSingleOrder(pdf1, pdf2, selectedGames) {
  console.log('Starting order generation for:', selectedGames);
  
  // Check if PDFs are already processed in memory
  let pdf1Image, pdf2Image;
  
  if (preProcessedPdfs.has('pdf1')) {
    console.log('Using pre-processed PDF 1 from memory');
    pdf1Image = preProcessedPdfs.get('pdf1');
  } else {
    console.log('PDF 1 not in memory, converting now...');
    pdf1Image = await convertPdfToImage(pdf1);
  }
  
  if (preProcessedPdfs.has('pdf2')) {
    console.log('Using pre-processed PDF 2 from memory');
    pdf2Image = preProcessedPdfs.get('pdf2');
  } else {
    console.log('PDF 2 not in memory, converting now...');
    pdf2Image = await convertPdfToImage(pdf2);
  }
  
  console.log('PDF 1 dimensions:', pdf1Image.width, 'x', pdf1Image.height);
  console.log('PDF 2 dimensions:', pdf2Image.width, 'x', pdf2Image.height);
  
  // Fetch QR codes for selected games
  console.log('Fetching QR codes for games...');
  const qrCodes = await fetchQrCodesForGames(selectedGames);
  console.log('QR codes fetched:', qrCodes.length);
  
  if (qrCodes.length !== 8) {
    throw new Error(`Could not fetch all QR codes. Expected 8, got ${qrCodes.length}`);
  }
  
  // Generate A4 PDF with 4 quadrants
  console.log('Generating A4 PDF...');
  generateA4OrderPdf(pdf1Image, pdf2Image, qrCodes, selectedGames);
}

// Generate pack order with A4 layout
async function generatePackOrder(packPdf, selectedGames) {
  console.log('Starting pack order generation for:', selectedGames);
  
  // Check if PDF is already processed in memory
  let pdfImage;
  
  if (preProcessedPdfs.has('packPdf')) {
    console.log('Using pre-processed pack PDF from memory');
    pdfImage = preProcessedPdfs.get('packPdf');
  } else {
    console.log('Pack PDF not in memory, converting now...');
    pdfImage = await convertPdfToImage(packPdf);
  }
  
  console.log('Pack PDF dimensions:', pdfImage.width, 'x', pdfImage.height);
  
  // Fetch QR codes for selected games
  console.log('Fetching QR codes for games...');
  const qrCodes = await fetchQrCodesForGames(selectedGames);
  console.log('QR codes fetched:', qrCodes.length);
  
  if (qrCodes.length !== 12) {
    throw new Error(`Could not fetch all QR codes. Expected 12, got ${qrCodes.length}`);
  }
  
  // Generate A4 PDF with 4 quadrants
  console.log('Generating A4 PDF...');
  generateA4PackOrderPdf(pdfImage, qrCodes, selectedGames);
}

// Generate A4 PDF with 4 quadrants layout for pack order
function generateA4PackOrderPdf(pdfImage, qrCodes, gameNames) {
  console.log('Generating pack PDF with:', { qrCodes: qrCodes.length, gameNames });
  console.log('QR codes array:', qrCodes);
  
  // Create canvas for precise positioning (like old technique)
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  // Canvas dimensions (A4 equivalent in pixels)
  const canvasWidth = 800;
  const canvasHeight = 1000;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  
  // Fill canvas with white background
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // TOP LEFT - PDF
  context.drawImage(pdfImage, -15, -15, 360, 520); // Left upper (matching old technique)
  
  // TOP RIGHT - Section 1 QR codes (4 QR codes - games 1-4)
  const marginX = 15; // Horizontal margin between images
  const marginY = 10; // Vertical margin between images
  const imgWidth = 186; // Width of each QR code (exact as requested)
  const imgHeight = 230; // Height of each QR code (exact as requested)
  const marginLeft = 60;
  
  // Place Section 1 QR codes (games 1-4) in top right
  for (let i = 0; i < 4; i++) {
    const x = 340 + marginLeft + (i % 2) * (imgWidth + marginX); // Right side positions
    const y = Math.floor(i / 2) * (imgHeight + marginY) + 10; // Upper right side
    
    console.log(`Placing QR ${i} at position:`, { x, y, gameName: gameNames[i] });
    
    if (qrCodes[i] && qrCodes[i].src) {
      console.log(`Adding QR ${i} to PDF with src:`, qrCodes[i].src.substring(0, 50) + '...');
      context.drawImage(qrCodes[i], x, y, imgWidth, imgHeight); // Draw with exact 186x230 size
    } else {
      console.error(`QR code ${i} is invalid:`, qrCodes[i]);
    }
  }
  
  // BOTTOM LEFT - Section 2 QR codes (4 QR codes - games 5-8)
  for (let i = 4; i < 8; i++) {
    const x = 10 + (i - 4) % 2 * (imgWidth + marginX); // Left side positions (fixed: start from 10 instead of -15)
    const y = 505 + Math.floor((i - 4) / 2) * (imgHeight + marginY) + 10; // Lower left side
    
    console.log(`Placing QR ${i} at position:`, { x, y, gameName: gameNames[i] });
    
    if (qrCodes[i] && qrCodes[i].src) {
      console.log(`Adding QR ${i} to PDF with src:`, qrCodes[i].src.substring(0, 50) + '...');
      context.drawImage(qrCodes[i], x, y, imgWidth, imgHeight); // Draw with exact 186x230 size
    } else {
      console.error(`QR code ${i} is invalid:`, qrCodes[i]);
    }
  }
  
  // BOTTOM RIGHT - Section 3 QR codes (4 QR codes - games 9-12)
  for (let i = 8; i < 12; i++) {
    const x = 340 + marginLeft + ((i - 8) % 2) * (imgWidth + marginX); // Right side positions
    const y = 505 + Math.floor((i - 8) / 2) * (imgHeight + marginY) + 10; // Lower right side
    
    console.log(`Placing QR ${i} at position:`, { x, y, gameName: gameNames[i] });
    
    if (qrCodes[i] && qrCodes[i].src) {
      console.log(`Adding QR ${i} to PDF with src:`, qrCodes[i].src.substring(0, 50) + '...');
      context.drawImage(qrCodes[i], x, y, imgWidth, imgHeight); // Draw with exact 186x230 size
    } else {
      console.error(`QR code ${i} is invalid:`, qrCodes[i]);
    }
  }
  
  console.log('Pack PDF generation complete. Converting to PDF...');
  
  // Convert canvas to PDF using jsPDF (like old technique)
  saveCanvasAsPDF(canvas);
}

// Generate A4 PDF with 4 quadrants layout for big pack order
async function generateA4BigPackOrderPdf(pdfImage, qrCodes, gameNames) {
  console.log('Generating big pack PDF with:', { qrCodes: qrCodes.length, gameNames });
  console.log('QR codes array:', qrCodes);
  
  // Create canvas for precise positioning (like old technique)
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  // Canvas dimensions (A4 equivalent in pixels)
  const canvasWidth = 800;
  const canvasHeight = 1000;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  
  // Fill canvas with white background
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // TOP LEFT - PDF
  context.drawImage(pdfImage, -15, -15, 360, 520); // Left upper (matching old technique)
  
  // TOP RIGHT - Section 1 QR codes (4 QR codes - games 1-4)
  const marginX = 15; // Horizontal margin between images
  const marginY = 10; // Vertical margin between images
  const imgWidth = 186; // Width of each QR code (exact as requested)
  const imgHeight = 230; // Height of each QR code (exact as requested)
  const marginLeft = 60;
  
  // Place Section 1 QR codes (games 1-4) in top right
  for (let i = 0; i < 4; i++) {
    const x = 340 + marginLeft + (i % 2) * (imgWidth + marginX); // Right side positions
    const y = Math.floor(i / 2) * (imgHeight + marginY) + 10; // Upper right side
    
    console.log(`Placing QR ${i} at position:`, { x, y, gameName: gameNames[i] });
    
    if (qrCodes[i] && qrCodes[i].src) {
      console.log(`Adding QR ${i} to PDF with src:`, qrCodes[i].src.substring(0, 50) + '...');
      context.drawImage(qrCodes[i], x, y, imgWidth, imgHeight); // Draw with exact 186x230 size
    } else {
      console.error(`QR code ${i} is invalid:`, qrCodes[i]);
    }
  }
  
  // BOTTOM LEFT - Section 2 QR codes (4 QR codes - games 5-8)
  for (let i = 4; i < 8; i++) {
    const x = 10 + (i - 4) % 2 * (imgWidth + marginX); // Left side positions (fixed: start from 10 instead of -15)
    const y = 505 + Math.floor((i - 4) / 2) * (imgHeight + marginY) + 10; // Lower left side
    
    console.log(`Placing QR ${i} at position:`, { x, y, gameName: gameNames[i] });
    
    if (qrCodes[i] && qrCodes[i].src) {
      console.log(`Adding QR ${i} to PDF with src:`, qrCodes[i].src.substring(0, 50) + '...');
      context.drawImage(qrCodes[i], x, y, imgWidth, imgHeight); // Draw with exact 186x230 size
    } else {
      console.error(`QR code ${i} is invalid:`, qrCodes[i]);
    }
  }
  
  // BOTTOM RIGHT - Section 3 QR codes (4 QR codes - games 9-12)
  for (let i = 8; i < 12; i++) {
    const x = 340 + marginLeft + ((i - 8) % 2) * (imgWidth + marginX); // Right side positions
    const y = 505 + Math.floor((i - 8) / 2) * (imgHeight + marginY) + 10; // Lower right side
    
    console.log(`Placing QR ${i} at position:`, { x, y, gameName: gameNames[i] });
    
    if (qrCodes[i] && qrCodes[i].src) {
      console.log(`Adding QR ${i} to PDF with src:`, qrCodes[i].src.substring(0, 50) + '...');
      context.drawImage(qrCodes[i], x, y, imgWidth, imgHeight); // Draw with exact 186x230 size
    } else {
      console.error(`QR code ${i} is invalid:`, qrCodes[i]);
    }
  }
  
  // TOP LEFT - PDF (Page 2)
  context.drawImage(pdfImage, -15, 490, 360, 520); // Left upper (matching old technique)
  
  // TOP RIGHT - Section 1 QR codes (4 QR codes - games 13-16)
  for (let i = 12; i < 16; i++) {
    const x = 340 + marginLeft + (i % 2) * (imgWidth + marginX); // Right side positions
    const y = Math.floor((i - 12) / 2) * (imgHeight + marginY) + 10; // Upper right side
    
    console.log(`Placing QR ${i} at position:`, { x, y, gameName: gameNames[i] });
    
    if (qrCodes[i] && qrCodes[i].src) {
      console.log(`Adding QR ${i} to PDF with src:`, qrCodes[i].src.substring(0, 50) + '...');
      context.drawImage(qrCodes[i], x, y, imgWidth, imgHeight); // Draw with exact 186x230 size
    } else {
      console.error(`QR code ${i} is invalid:`, qrCodes[i]);
    }
  }
  
  // BOTTOM LEFT - Section 2 QR codes (4 QR codes - games 17-20)
  for (let i = 16; i < 20; i++) {
    const x = 10 + (i % 2) * (imgWidth + marginX); // Left side positions (fixed: start from 10 instead of -15)
    const y = 505 + Math.floor((i - 16) / 2) * (imgHeight + marginY) + 10; // Lower left side
    
    console.log(`Placing QR ${i} at position:`, { x, y, gameName: gameNames[i] });
    
    if (qrCodes[i] && qrCodes[i].src) {
      console.log(`Adding QR ${i} to PDF with src:`, qrCodes[i].src.substring(0, 50) + '...');
      context.drawImage(qrCodes[i], x, y, imgWidth, imgHeight); // Draw with exact 186x230 size
    } else {
      console.error(`QR code ${i} is invalid:`, qrCodes[i]);
    }
  }
  
  // BOTTOM RIGHT - Section 3 QR codes (4 QR codes - games 21-24)
  for (let i = 20; i < 24; i++) {
    const x = 340 + marginLeft + ((i - 20) % 2) * (imgWidth + marginX); // Right side positions
    const y = 505 + Math.floor((i - 20) / 2) * (imgHeight + marginY) + 10; // Lower right side
    
    console.log(`Placing QR ${i} at position:`, { x, y, gameName: gameNames[i] });
    
    if (qrCodes[i] && qrCodes[i].src) {
      console.log(`Adding QR ${i} to PDF with src:`, qrCodes[i].src.substring(0, 50) + '...');
      context.drawImage(qrCodes[i], x, y, imgWidth, imgHeight); // Draw with exact 186x230 size
    } else {
      console.error(`QR code ${i} is invalid:`, qrCodes[i]);
    }
  }
  
  // TOP LEFT - PDF (Page 2)
  context.drawImage(pdfImage, -15, 490, 360, 520); // Left upper (matching old technique)
  
  // TOP RIGHT - Section 1 QR codes (4 QR codes - games 25-28)
  for (let i = 24; i < 28; i++) {
    const x = 340 + marginLeft + (i % 2) * (imgWidth + marginX); // Right side positions
    const y = Math.floor((i - 24) / 2) * (imgHeight + marginY) + 10; // Upper right side
    
    console.log(`Placing QR ${i} at position:`, { x, y, gameName: gameNames[i] });
    
    if (qrCodes[i] && qrCodes[i].src) {
      console.log(`Adding QR ${i} to PDF with src:`, qrCodes[i].src.substring(0, 50) + '...');
      context.drawImage(qrCodes[i], x, y, imgWidth, imgHeight); // Draw with exact 186x230 size
    } else {
      console.error(`QR code ${i} is invalid:`, qrCodes[i]);
    }
  }
  
  // BOTTOM LEFT - Section 2 QR codes (4 QR codes - games 29-32)
  for (let i = 28; i < 32; i++) {
    const x = 10 + (i % 2) * (imgWidth + marginX); // Left side positions (fixed: start from 10 instead of -15)
    const y = 505 + Math.floor((i - 28) / 2) * (imgHeight + marginY) + 10; // Lower left side
    
    console.log(`Placing QR ${i} at position:`, { x, y, gameName: gameNames[i] });
    
    if (qrCodes[i] && qrCodes[i].src) {
      console.log(`Adding QR ${i} to PDF with src:`, qrCodes[i].src.substring(0, 50) + '...');
      context.drawImage(qrCodes[i], x, y, imgWidth, imgHeight); // Draw with exact 186x230 size
    } else {
      console.error(`QR code ${i} is invalid:`, qrCodes[i]);
    }
  }
  
  // BOTTOM RIGHT - Section 3 QR codes (4 QR codes - games 33-36)
  for (let i = 32; i < 36; i++) {
    const x = 340 + marginLeft + ((i - 32) % 2) * (imgWidth + marginX); // Right side positions
    const y = 505 + Math.floor((i - 32) / 2) * (imgHeight + marginY) + 10; // Lower right side
    
    console.log(`Placing QR ${i} at position:`, { x, y, gameName: gameNames[i] });
    
    if (qrCodes[i] && qrCodes[i].src) {
      console.log(`Adding QR ${i} to PDF with src:`, qrCodes[i].src.substring(0, 50) + '...');
      context.drawImage(qrCodes[i], x, y, imgWidth, imgHeight); // Draw with exact 186x230 size
    } else {
      console.error(`QR code ${i} is invalid:`, qrCodes[i]);
    }
  }
  
  console.log('Big pack PDF generation complete. Converting to PDF...');
  
  // Convert canvas to PDF using jsPDF (like old technique)
  saveCanvasAsPDF(canvas);
}

// Generate big pack order with 2-page A4 layout
async function generateBigPackOrder(bigPackPdf, selectedGames) {
  console.log('Starting big pack order generation for:', selectedGames);
  
  // Check if PDF is already processed in memory
  let pdfImage;
  
  if (preProcessedPdfs.has('bigPackPdf')) {
    console.log('Using pre-processed big pack PDF from memory');
    pdfImage = preProcessedPdfs.get('bigPackPdf');
  } else {
    console.log('Big pack PDF not in memory, converting now...');
    pdfImage = await convertPdfToImage(bigPackPdf);
  }
  
  console.log('Big pack PDF dimensions:', pdfImage.width, 'x', pdfImage.height);
  
  // Fetch QR codes for selected games
  console.log('Fetching QR codes for games...');
  const qrCodes = await fetchQrCodesForGames(selectedGames);
  console.log('QR codes fetched:', qrCodes.length);
  
  if (qrCodes.length !== 28) {
    throw new Error(`Could not fetch all QR codes. Expected 28, got ${qrCodes.length}`);
  }
  
  // Generate 2-page A4 PDF
  console.log('Generating 2-page A4 PDF...');
  generate2PageBigPackOrderPdf(pdfImage, qrCodes, selectedGames);
}

// Generate 2-page A4 PDF for big pack order
function generate2PageBigPackOrderPdf(pdfImage, qrCodes, gameNames) {
  console.log('Generating 2-page big pack PDF with:', { qrCodes: qrCodes.length, gameNames });
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'px', format: [800, 1000] });
  
  // Canvas dimensions (A4 equivalent in pixels)
  const canvasWidth = 800;
  const canvasHeight = 1000;
  
  // PAGE 1
  const canvas1 = document.createElement('canvas');
  const context1 = canvas1.getContext('2d');
  canvas1.width = canvasWidth;
  canvas1.height = canvasHeight;
  
  // Fill canvas with white background
  context1.fillStyle = '#ffffff';
  context1.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Add "Page 1" text
  context1.fillStyle = '#000000';
  context1.font = '16px Arial';
  context1.fillText('Page 1', 10, 25);
  
  // TOP LEFT - PDF
  context1.drawImage(pdfImage, -15, -15, 360, 520);
  
  // TOP RIGHT - Section 1 QR codes (4 QR codes - games 1-4)
  const marginX = 15;
  const marginY = 10;
  const imgWidth = 186;
  const imgHeight = 230;
  const marginLeft = 60;
  
  // Place Section 1 QR codes (games 1-4) in top right
  for (let i = 0; i < 4; i++) {
    const x = 340 + marginLeft + (i % 2) * (imgWidth + marginX);
    const y = Math.floor(i / 2) * (imgHeight + marginY) + 10;
    
    if (qrCodes[i] && qrCodes[i].src) {
      context1.drawImage(qrCodes[i], x, y, imgWidth, imgHeight);
    }
  }
  
  // BOTTOM LEFT - Section 2 QR codes (4 QR codes - games 5-8)
  for (let i = 4; i < 8; i++) {
    const x = 10 + (i - 4) % 2 * (imgWidth + marginX);
    const y = 505 + Math.floor((i - 4) / 2) * (imgHeight + marginY) + 10;
    
    if (qrCodes[i] && qrCodes[i].src) {
      context1.drawImage(qrCodes[i], x, y, imgWidth, imgHeight);
    }
  }
  
  // BOTTOM RIGHT - Section 3 QR codes (4 QR codes - games 9-12)
  for (let i = 8; i < 12; i++) {
    const x = 340 + marginLeft + ((i - 8) % 2) * (imgWidth + marginX);
    const y = 505 + Math.floor((i - 8) / 2) * (imgHeight + marginY) + 10;
    
    if (qrCodes[i] && qrCodes[i].src) {
      context1.drawImage(qrCodes[i], x, y, imgWidth, imgHeight);
    }
  }
  
  // Convert canvas to image for PDF
  const page1Image = canvas1.toDataURL('image/jpeg', 0.8);
  
  // Add page 1 to PDF
  doc.addImage(page1Image, 'JPEG', 0, 0, canvasWidth, canvasHeight);
  
  // PAGE 2
  doc.addPage([canvasWidth, canvasHeight]);
  
  const canvas2 = document.createElement('canvas');
  const context2 = canvas2.getContext('2d');
  canvas2.width = canvasWidth;
  canvas2.height = canvasHeight;
  
  // Fill canvas with white background
  context2.fillStyle = '#ffffff';
  context2.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Add "Page 2" text
  context2.fillStyle = '#000000';
  context2.font = '16px Arial';
  context2.fillText('Page 2', 10, 25);
  
  // TOP LEFT - Section 4 QR codes (4 QR codes - games 13-16)
  for (let i = 12; i < 16; i++) {
    const x = 10 + (i - 12) % 2 * (imgWidth + marginX);
    const y = Math.floor((i - 12) / 2) * (imgHeight + marginY) + 10;
    
    if (qrCodes[i] && qrCodes[i].src) {
      context2.drawImage(qrCodes[i], x, y, imgWidth, imgHeight);
    }
  }
  
  // TOP RIGHT - Section 5 QR codes (4 QR codes - games 17-20)
  for (let i = 16; i < 20; i++) {
    const x = 340 + marginLeft + ((i - 16) % 2) * (imgWidth + marginX);
    const y = Math.floor((i - 16) / 2) * (imgHeight + marginY) + 10;
    
    if (qrCodes[i] && qrCodes[i].src) {
      context2.drawImage(qrCodes[i], x, y, imgWidth, imgHeight);
    }
  }
  
  // BOTTOM LEFT - Section 6 QR codes (4 QR codes - games 21-24)
  for (let i = 20; i < 24; i++) {
    const x = 10 + (i - 20) % 2 * (imgWidth + marginX);
    const y = 505 + Math.floor((i - 20) / 2) * (imgHeight + marginY) + 10;
    
    if (qrCodes[i] && qrCodes[i].src) {
      context2.drawImage(qrCodes[i], x, y, imgWidth, imgHeight);
    }
  }
  
  // BOTTOM RIGHT - Section 7 QR codes (4 QR codes - games 25-28)
  for (let i = 24; i < 28; i++) {
    const x = 340 + marginLeft + ((i - 24) % 2) * (imgWidth + marginX);
    const y = 505 + Math.floor((i - 24) / 2) * (imgHeight + marginY) + 10;
    
    if (qrCodes[i] && qrCodes[i].src) {
      context2.drawImage(qrCodes[i], x, y, imgWidth, imgHeight);
    }
  }
  
  // Convert canvas to image for PDF
  const page2Image = canvas2.toDataURL('image/jpeg', 0.8);
  
  // Add page 2 to PDF
  doc.addImage(page2Image, 'JPEG', 0, 0, canvasWidth, canvasHeight);
  
  console.log('2-page big pack PDF generation complete. Saving...');
  
  // Save the PDF
  doc.save('big-pack-order.pdf');
}

// Convert PDF to image using PDF.js
async function convertPdfToImage(pdfFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async function(e) {
      try {
        const typedarray = new Uint8Array(e.target.result);
        
        // Load PDF document
        const loadingTask = pdfjsLib.getDocument({data: typedarray});
        const pdf = await loadingTask.promise;
        
        // Get first page
        const page = await pdf.getPage(1);
        
        // Set viewport for rendering (balanced quality + speed)
        const viewport = page.getViewport({scale: 0.8}); // Reduced to 0.8 for speed + quality balance
        
        // Create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Render PDF page to canvas
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        
        await page.render(renderContext).promise;
        
        // Convert canvas to image with balanced quality + speed
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = canvas.toDataURL('image/jpeg', 0.85); // Use JPEG with 0.85 quality for speed + quality balance
        
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(pdfFile);
  });
}

// Fetch QR codes for selected games from database
async function fetchQrCodesForGames(gameNames) {
  const qrCodes = [];
  
  for (const gameName of gameNames) {
    try {
      console.log(`Fetching QR for: ${gameName}`);
      
      // Check if QR code is already in memory
      if (preFetchedQrCodes.has(gameName)) {
        console.log(`QR for ${gameName} found in memory. Using pre-fetched image.`);
        qrCodes.push(preFetchedQrCodes.get(gameName));
      } else {
        // Fetch QR code from your API
        const response = await fetch(`${ORDER_API_URL}?name=${encodeURIComponent(gameName)}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`API response for ${gameName}:`, data);
          
          // Handle different API response structures
          let gameData = null;
          
          if (Array.isArray(data)) {
            // If API returns an array, find the matching game
            console.log(`API returned array of ${data.length} items, searching for: ${gameName}`);
            console.log(`First few items in array:`, data.slice(0, 3));
            gameData = data.find(game => 
              game.name && game.name.toLowerCase() === gameName.toLowerCase()
            );
            console.log(`Found game data:`, gameData);
            
            // If not found by exact name, try partial match
            if (!gameData) {
              console.log(`Exact match not found, trying partial match...`);
              gameData = data.find(game => 
                game.name && game.name.toLowerCase().includes(gameName.toLowerCase())
              );
              console.log(`Partial match result:`, gameData);
            }
          } else if (data.name && data.image) {
            // If API returns single game object
            gameData = data;
          } else if (data.games && Array.isArray(data.games)) {
            // If API returns {games: [...]}
            gameData = data.games.find(game => 
              game.name && game.name.toLowerCase() === gameName.toLowerCase()
            );
          }
          
          if (gameData && gameData.image) {
            console.log(`Found image for ${gameName}, converting base64...`);
            // Convert base64 to image - FIXED: Properly handle base64 data
            const img = new Image();
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = gameData.image; // This is your base64 image data
            });
            console.log(`QR image loaded for ${gameName}:`, img.width, 'x', img.height);
            qrCodes.push(img);
          } else {
            console.log(`No image found for ${gameName}, generating fallback`);
            // Generate fallback QR code
            const fallbackQr = await generateFallbackQr(gameName);
            qrCodes.push(fallbackQr);
          }
        } else {
          console.log(`API failed for ${gameName}, generating fallback`);
          // Generate fallback QR code
          const fallbackQr = await generateFallbackQr(gameName);
          qrCodes.push(fallbackQr);
        }
      }
    } catch (error) {
      console.error(`Error fetching QR for ${gameName}:`, error);
      // Generate fallback QR code
      const fallbackQr = await generateFallbackQr(gameName);
      qrCodes.push(fallbackQr);
    }
  }
  
  console.log('All QR codes loaded:', qrCodes.length);
  return qrCodes;
}

// Generate fallback QR code if database fetch fails
async function generateFallbackQr(gameName) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 160;
    
    // Generate QR code
    const qr = new QRCode(canvas, {
      text: `Game: ${gameName}`,
      width: 160,
      height: 160,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H,
    });
    
    // Convert to image
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = canvas.toDataURL('image/png');
  });
}

// Generate A4 PDF with 4 quadrants layout
function generateA4OrderPdf(pdf1Image, pdf2Image, qrCodes, gameNames) {
  console.log('Generating PDF with:', { qrCodes: qrCodes.length, gameNames });
  console.log('QR codes array:', qrCodes);
  
  // Create canvas for precise positioning (like old technique)
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  // Canvas dimensions (A4 equivalent in pixels)
  const canvasWidth = 800;
  const canvasHeight = 1000;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  
  // Fill canvas with white background
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // SECTION 1: Top Left - PDF 1
  context.drawImage(pdf1Image, -15, -15, 360, 520); // Left upper (matching old technique)
  
  // SECTION 1: Top Right - Section 1 QR codes (4 QR codes)
  const marginX = 15; // Horizontal margin between images
  const marginY = 10; // Vertical margin between images
  const imgWidth = 186; // Width of each QR code (exact as requested)
  const imgHeight = 230; // Height of each QR code (exact as requested)
  const marginLeft = 60;
  
  // Place Section 1 QR codes (games 1-4) in top right
  for (let i = 0; i < 4; i++) {
    const x = 340 + marginLeft + (i % 2) * (imgWidth + marginX); // Right side positions
    const y = Math.floor(i / 2) * (imgHeight + marginY) + 10; // Upper right side
    
    console.log(`Placing QR ${i} at position:`, { x, y, gameName: gameNames[i] });
    
    if (qrCodes[i] && qrCodes[i].src) {
      console.log(`Adding QR ${i} to PDF with src:`, qrCodes[i].src.substring(0, 50) + '...');
      context.drawImage(qrCodes[i], x, y, imgWidth, imgHeight); // Draw with exact 186x230 size
    } else {
      console.error(`QR code ${i} is invalid:`, qrCodes[i]);
    }
  }
  
  // SECTION 2: Bottom Left - PDF 2
  context.drawImage(pdf2Image, -15, 490, 360, 520); // Left bottom (matching old technique)
  
  // SECTION 2: Bottom Right - Section 2 QR codes (4 QR codes)
  for (let i = 4; i < 8; i++) {
    const x = 340 + marginLeft + ((i - 4) % 2) * (imgWidth + marginX); // Right side positions
    const y = 505 + Math.floor((i - 4) / 2) * (imgHeight + marginY) + 10; // Lower right side
    
    console.log(`Placing QR ${i} at position:`, { x, y, gameName: gameNames[i] });
    
    if (qrCodes[i] && qrCodes[i].src) {
      console.log(`Adding QR ${i} to PDF with src:`, qrCodes[i].src.substring(0, 50) + '...');
      context.drawImage(qrCodes[i], x, y, imgWidth, imgHeight); // Draw with exact 186x230 size
    } else {
      console.error(`QR code ${i} is invalid:`, qrCodes[i]);
    }
  }
  
  console.log('Canvas generation complete. Converting to PDF...');
  
  // Convert canvas to PDF using jsPDF (like old technique)
  saveCanvasAsPDF(canvas);
}

// Save canvas as PDF (ultra-fast approach)
function saveCanvasAsPDF(canvas) {
  const { jsPDF } = window.jspdf;
  
  // Create a fast resolution canvas (reduced scale for speed)
  const scale = 1.5; // Reduced from 2.0 to 1.5 for maximum speed
  const scaledCanvas = document.createElement('canvas');
  scaledCanvas.width = canvas.width * scale;
  scaledCanvas.height = canvas.height * scale;
  const context = scaledCanvas.getContext('2d');
  context.scale(scale, scale);
  context.drawImage(canvas, 0, 0);
  
  // Convert the scaled canvas to a data URL with fast settings
  const imageData = scaledCanvas.toDataURL('image/jpeg', 0.8); // Use JPEG with 0.8 quality for maximum speed
  
  // Create the PDF with fast resolution settings
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height]
  });
  
  pdf.addImage(imageData, 'JPEG', 0, 0, canvas.width, canvas.height, undefined, 'FAST'); // 'FAST' for maximum speed
  pdf.save('game-order.pdf');
}



// Get selected games from a form
function getSelectedGames(formSelector) {
  const form = document.querySelector(formSelector);
  const selectedGames = [];
  
  form.querySelectorAll('.selected-game').forEach(selected => {
    if (selected.textContent !== 'Select a game') {
      selectedGames.push(selected.textContent);
    }
  });
  
  return selectedGames;
}

// Generate order (placeholder function)
function generateOrder(type, games) {
  console.log(`Generating ${type} order with games:`, games);
  alert(`${type === 'single' ? 'Single' : 'Pack'} order generated successfully!\nGames: ${games.join(', ')}`);
  
  // Here you would typically:
  // 1. Process the PDF upload
  // 2. Send order data to your backend
  // 3. Generate order confirmation
  // 4. Handle payment processing
}

// Check if all selected games have QR codes ready
function areAllQrCodesReady() {
  const selectedGames = getSelectedGames('#singleOrderForm');
  const readyCount = selectedGames.filter(game => preFetchedQrCodes.has(game)).length;
  const totalCount = selectedGames.length;
  
  console.log(`QR codes ready: ${readyCount}/${totalCount}`);
  return readyCount === totalCount;
}

// Update debug information
function updateDebugInfo() {
  const gameCountElement = document.getElementById('gameCount');
  const selectedGamesElement = document.getElementById('selectedGames');
  const qrStatusElement = document.getElementById('qrStatus');
  
  // Only update if debug elements exist
  if (!gameCountElement || !selectedGamesElement || !qrStatusElement) {
    console.log('Debug elements not found, skipping debug info update');
    return;
  }
  
  gameCountElement.textContent = gameNames.length;
  
  const selectedGames = getSelectedGames('#singleOrderForm');
  const selectedGamesText = selectedGames.join(', ') || 'None';
  selectedGamesElement.textContent = selectedGamesText;
  
  // Show QR code pre-fetch status
  if (selectedGames.length > 0) {
    const readyCount = selectedGames.filter(game => preFetchedQrCodes.has(game)).length;
    const qrStatus = `QR codes ready: ${readyCount}/${selectedGames.length}`;
    qrStatusElement.textContent = qrStatus;
  } else {
    qrStatusElement.textContent = 'No games selected';
  }
  
  // Show PDF processing status
  updatePdfStatus();
}

// Update PDF status
function updatePdfStatus() {
  const pdfStatusElement = document.getElementById('pdfStatus');
  
  // Only update if debug element exists
  if (!pdfStatusElement) {
    return;
  }
  
  const pdf1 = document.getElementById('singlePdfUpload1')?.files[0];
  const pdf2 = document.getElementById('singlePdfUpload2')?.files[0];
  const packPdf = document.getElementById('packPdfUpload')?.files[0];
  const bigPackPdf = document.getElementById('bigPackPdfUpload')?.files[0];
  
  let status = '';
  let pdfReadyCount = 0;
  let totalPdfs = 0;
  
  if (pdf1 && pdf2) {
    totalPdfs = 2;
    if (preProcessedPdfs.has('pdf1')) pdfReadyCount++;
    if (preProcessedPdfs.has('pdf2')) pdfReadyCount++;
    status = `PDF 1: ${pdf1.name} (${preProcessedPdfs.has('pdf1') ? 'Ready' : 'Processing...'}), PDF 2: ${pdf2.name} (${preProcessedPdfs.has('pdf2') ? 'Ready' : 'Processing...'})`;
  } else if (packPdf) {
    totalPdfs = 1;
    if (preProcessedPdfs.has('packPdf')) pdfReadyCount++;
    status = `Pack PDF: ${packPdf.name} (${preProcessedPdfs.has('packPdf') ? 'Ready' : 'Processing...'})`;
  } else if (bigPackPdf) {
    totalPdfs = 1;
    if (preProcessedPdfs.has('bigPackPdf')) pdfReadyCount++;
    status = `Big Pack PDF: ${bigPackPdf.name} (${preProcessedPdfs.has('bigPackPdf') ? 'Ready' : 'Processing...'})`;
  } else {
    status = 'No PDFs uploaded';
  }
  
  if (totalPdfs > 0) {
    status += ` | PDFs ready: ${pdfReadyCount}/${totalPdfs}`;
  }
  
  pdfStatusElement.textContent = status;
}

// Initialize the system when the page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('Order Management System Initialized');
  
  // Set API URL in debug section (only if debug elements exist)
  const apiUrlElement = document.getElementById('apiUrl');
  if (apiUrlElement) {
    apiUrlElement.textContent = ORDER_API_URL;
  }
  
  // Initialize with fallback names first
  gameNames = [
    'Euro Truck Simulator 2',
    'Grand Theft Auto V',
    'Minecraft',
    'Red Dead Redemption 2',
    'The Witcher 3',
    'Cyberpunk 2077',
    'Assassin\'s Creed Valhalla',
    'Call of Duty: Warzone',
    'FIFA 23',
    'NBA 2K23',
    'Fortnite',
    'Apex Legends',
    'Valorant',
    'League of Legends',
    'Counter-Strike 2'
  ];
  
  // Initialize dropdowns immediately with fallback data
  initializeDropdowns();
  
  // Update debug info only if debug elements exist
  if (document.getElementById('gameCount')) {
    updateDebugInfo();
  }
  
  // Then try to fetch fresh data from API
  fetchGameNames().then(() => {
    if (document.getElementById('gameCount')) {
      updateDebugInfo();
    }
    initializeDropdowns();
  }).catch(() => {
    console.log('Using fallback game names');
  });
  
  // Set up PDF upload event listeners for pre-processing
  setupPdfUploadListeners();
  
  // Set up event listeners
  setupEventListeners();
  
  // Initialize merge files functionality
  initializeMergeFiles();
});

// Set up PDF upload listeners for automatic pre-processing
function setupPdfUploadListeners() {
  // Single Order PDF uploads
  const singlePdf1 = document.getElementById('singlePdfUpload1');
  const singlePdf2 = document.getElementById('singlePdfUpload2');
  
  if (singlePdf1) {
    singlePdf1.addEventListener('change', (e) => {
      if (e.target.files[0]) {
        console.log('PDF 1 uploaded, pre-processing...');
        preProcessPdf(e.target.files[0], 'pdf1');
      }
    });
  }
  
  if (singlePdf2) {
    singlePdf2.addEventListener('change', (e) => {
      if (e.target.files[0]) {
        console.log('PDF 2 uploaded, pre-processing...');
        preProcessPdf(e.target.files[0], 'pdf2');
      }
    });
  }
  
  // Pack Order PDF upload
  const packPdf = document.getElementById('packPdfUpload');
  if (packPdf) {
    packPdf.addEventListener('change', (e) => {
      if (e.target.files[0]) {
        console.log('Pack PDF uploaded, pre-processing...');
        preProcessPdf(e.target.files[0], 'packPdf');
      }
    });
  }

  // Big Pack Order PDF upload
  const bigPackPdf = document.getElementById('bigPackPdfUpload');
  if (bigPackPdf) {
    bigPackPdf.addEventListener('change', (e) => {
      if (e.target.files[0]) {
        console.log('Big Pack PDF uploaded, pre-processing...');
        preProcessPdf(e.target.files[0], 'bigPackPdf');
      }
    });
  }
}

// Set up all event listeners
function setupEventListeners() {
  // Order type switching
  document.getElementById('btnSingleOrder').addEventListener('click', () => {
    document.querySelectorAll('.order-type-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btnSingleOrder').classList.add('active');
    document.getElementById('singleOrderForm').classList.remove('hidden');
    document.getElementById('packOrderForm').classList.add('hidden');
  });

  document.getElementById('btnPackOrder').addEventListener('click', () => {
    document.querySelectorAll('.order-type-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btnPackOrder').classList.add('active');
    document.getElementById('singleOrderForm').classList.add('hidden');
    document.getElementById('packOrderForm').classList.remove('hidden');
    generatePackDropdowns();
  });

  document.getElementById('btnBigPackOrder').addEventListener('click', () => {
    document.querySelectorAll('.order-type-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btnBigPackOrder').classList.add('active');
    document.getElementById('singleOrderForm').classList.add('hidden');
    document.getElementById('packOrderForm').classList.add('hidden');
    document.getElementById('bigPackOrderForm').classList.remove('hidden');
    generateBigPackDropdowns();
  });

  // Generate order buttons
  document.getElementById('btnGenerateSingleOrder').addEventListener('click', async () => {
    await handleSingleOrderGeneration();
  });

  document.getElementById('btnGeneratePackOrder').addEventListener('click', async () => {
    await handlePackOrderGeneration();
  });

  document.getElementById('btnGenerateBigPackOrder').addEventListener('click', async () => {
    await handleBigPackOrderGeneration();
  });

  // Debug buttons (only if they exist)
  const btnTestApi = document.getElementById('btnTestApi');
  if (btnTestApi) {
    btnTestApi.addEventListener('click', testApiConnection);
  }

  const btnRefreshGames = document.getElementById('btnRefreshGames');
  if (btnRefreshGames) {
    btnRefreshGames.addEventListener('click', refreshGameList);
  }
}

// Test API connection
async function testApiConnection() {
  const btn = document.getElementById('btnTestApi');
  if (btn) {
    btn.textContent = 'Testing...';
    btn.disabled = true;
  }
  
  try {
    const response = await fetch(ORDER_API_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      alert(`API Connection Successful!\nResponse: ${JSON.stringify(data, null, 2)}`);
    } else {
      alert(`API Connection Failed!\nStatus: ${response.status}\nStatus Text: ${response.statusText}`);
    }
  } catch (error) {
    alert(`API Connection Error!\n${error.message}`);
  } finally {
    if (btn) {
      btn.textContent = 'Test API Connection';
      btn.disabled = false;
    }
  }
}

// Refresh game list
async function refreshGameList() {
  const btn = document.getElementById('btnRefreshGames');
  if (btn) {
    btn.textContent = 'Refreshing...';
    btn.disabled = true;
  }
  
  try {
    await fetchGameNames();
    initializeDropdowns();
    if (document.getElementById('gameCount')) {
      updateDebugInfo();
    }
    alert(`Game list refreshed! Found ${gameNames.length} games.`);
  } catch (error) {
    alert(`Error refreshing games: ${error.message}`);
  } finally {
    if (btn) {
      btn.textContent = 'Refresh Game List';
      btn.disabled = false;
    }
  }
}

// Merge Files functionality
let selectedFiles = [];

// Initialize merge files functionality
function initializeMergeFiles() {
  const fileInput = document.getElementById('pdfFileInput');
  const mergeBtn = document.getElementById('btnMergePdfs');
  const clearBtn = document.getElementById('btnClearFiles');
  const fileUploadArea = document.querySelector('.file-upload-area');

  // File input change handler
  fileInput.addEventListener('change', handleFileSelection);

  // Merge button click handler
  mergeBtn.addEventListener('click', mergePdfs);

  // Clear button click handler
  clearBtn.addEventListener('click', clearAllFiles);

  // Drag and drop functionality
  fileUploadArea.addEventListener('dragover', handleDragOver);
  fileUploadArea.addEventListener('dragleave', handleDragLeave);
  fileUploadArea.addEventListener('drop', handleDrop);
}

// Handle file selection
function handleFileSelection(event) {
  const files = Array.from(event.target.files);
  addFilesToList(files);
}

// Handle drag over
function handleDragOver(event) {
  event.preventDefault();
  event.currentTarget.classList.add('dragover');
}

// Handle drag leave
function handleDragLeave(event) {
  event.preventDefault();
  event.currentTarget.classList.remove('dragover');
}

// Handle drop
function handleDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.remove('dragover');
  
  const files = Array.from(event.dataTransfer.files).filter(file => file.type === 'application/pdf');
  addFilesToList(files);
}

// Add files to the list
function addFilesToList(files) {
  files.forEach(file => {
    if (file.type === 'application/pdf') {
      selectedFiles.push(file);
    }
  });
  updateFileList();
  updateMergeButton();
}

// Update file list display
function updateFileList() {
  const fileList = document.getElementById('fileList');
  const fileCount = document.getElementById('fileCount');
  
  fileCount.textContent = selectedFiles.length;
  fileList.innerHTML = '';

  selectedFiles.forEach((file, index) => {
    const fileItem = createFileItem(file, index);
    fileList.appendChild(fileItem);
  });
}

// Create file item element
function createFileItem(file, index) {
  const fileItem = document.createElement('div');
  fileItem.className = 'file-item';
  
  const fileSize = formatFileSize(file.size);
  
  fileItem.innerHTML = `
    <div class="file-info">
      <div class="file-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="file-details">
        <div class="file-name">${file.name}</div>
        <div class="file-size">${fileSize}</div>
      </div>
    </div>
    <div class="file-actions">
      <button class="move-up-btn" onclick="moveFileUp(${index})" ${index === 0 ? 'disabled' : ''}>↑</button>
      <button class="move-down-btn" onclick="moveFileDown(${index})" ${index === selectedFiles.length - 1 ? 'disabled' : ''}>↓</button>
      <button class="remove-btn" onclick="removeFile(${index})">×</button>
    </div>
  `;
  
  return fileItem;
}

// Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Move file up in the list
function moveFileUp(index) {
  if (index > 0) {
    const temp = selectedFiles[index];
    selectedFiles[index] = selectedFiles[index - 1];
    selectedFiles[index - 1] = temp;
    updateFileList();
  }
}

// Move file down in the list
function moveFileDown(index) {
  if (index < selectedFiles.length - 1) {
    const temp = selectedFiles[index];
    selectedFiles[index] = selectedFiles[index + 1];
    selectedFiles[index + 1] = temp;
    updateFileList();
  }
}

// Remove file from list
function removeFile(index) {
  selectedFiles.splice(index, 1);
  updateFileList();
  updateMergeButton();
}

// Clear all files
function clearAllFiles() {
  selectedFiles = [];
  updateFileList();
  updateMergeButton();
  document.getElementById('pdfFileInput').value = '';
}

// Update merge button state
function updateMergeButton() {
  const mergeBtn = document.getElementById('btnMergePdfs');
  mergeBtn.disabled = selectedFiles.length < 2;
}

// Merge PDFs
async function mergePdfs() {
  if (selectedFiles.length < 2) {
    alert('Please select at least 2 PDF files to merge.');
    return;
  }

  const mergeBtn = document.getElementById('btnMergePdfs');
  mergeBtn.disabled = true;
  mergeBtn.textContent = 'Merging...';

  try {
    const { jsPDF } = window.jspdf;
    const mergedPdf = new jsPDF();

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      console.log(`Processing file ${i + 1}/${selectedFiles.length}: ${file.name}`);

      // Convert PDF to images and add to merged PDF
      const pdfImages = await convertPdfToImages(file);
      
      for (let j = 0; j < pdfImages.length; j++) {
        if (i > 0 || j > 0) {
          mergedPdf.addPage();
        }
        
        const img = pdfImages[j];
        const imgAspectRatio = img.width / img.height;
        const pdfAspectRatio = mergedPdf.internal.pageSize.getWidth() / mergedPdf.internal.pageSize.getHeight();
        
        let imgWidth, imgHeight;
        if (imgAspectRatio > pdfAspectRatio) {
          imgWidth = mergedPdf.internal.pageSize.getWidth() - 20;
          imgHeight = imgWidth / imgAspectRatio;
        } else {
          imgHeight = mergedPdf.internal.pageSize.getHeight() - 20;
          imgWidth = imgHeight * imgAspectRatio;
        }
        
        const x = (mergedPdf.internal.pageSize.getWidth() - imgWidth) / 2;
        const y = (mergedPdf.internal.pageSize.getHeight() - imgHeight) / 2;
        
        mergedPdf.addImage(img, 'JPEG', x, y, imgWidth, imgHeight);
      }
    }

    // Save the merged PDF
    mergedPdf.save('merged-document.pdf');
    
  } catch (error) {
    console.error('Error merging PDFs:', error);
    alert('Error merging PDF files. Please try again.');
  } finally {
    mergeBtn.disabled = false;
    mergeBtn.textContent = 'Merge PDFs';
  }
}

// Convert PDF to images (all pages)
async function convertPdfToImages(pdfFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async function(e) {
      try {
        const typedarray = new Uint8Array(e.target.result);
        const loadingTask = pdfjsLib.getDocument({data: typedarray});
        const pdf = await loadingTask.promise;
        
        const images = [];
        
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({scale: 1.0});
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          
          await page.render(renderContext).promise;
          
          const img = new Image();
          await new Promise((resolveImg) => {
            img.onload = resolveImg;
            img.src = canvas.toDataURL('image/jpeg', 0.8);
          });
          
          images.push(img);
        }
        
        resolve(images);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(pdfFile);
  });
}


