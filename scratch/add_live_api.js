const fs = require('fs');
const path = require('path');

const mobileDir = 'e:/Tableau/project/alumni_platform/mobile';
const htmlPath = path.join(mobileDir, 'index.html');
const jsPath = path.join(mobileDir, 'mobile-app.js');

// 1. Update HTML
let html = fs.readFileSync(htmlPath, 'utf8');

// Insert the API Quote block right above "Recent Activity" on the Dashboard
const apiHtmlBlock = `
          <!-- Live API Integration block -->
          <div class="info-banner" style="background: rgba(255,255,255,0.6); backdrop-filter: blur(15px); border-radius: 16px; margin-bottom: 1.25rem; display: flex; flex-direction: column; text-align: center; border: 1px solid rgba(255,255,255,0.8);">
            <div style="font-size: 0.7rem; color: var(--primary); font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">🌍 Live API Delivery</div>
            <div id="api-quote" style="font-size: 0.9rem; font-style: italic; color: #333; transition: opacity 0.3s;">Fetching inspiration...</div>
            <div id="api-author" style="font-size: 0.75rem; color: var(--primary); margin-top: 6px; font-weight: 600;"></div>
          </div>
`;

if (!html.includes('id="api-quote"')) {
    html = html.replace('<!-- Recent Activity -->', apiHtmlBlock + '<!-- Recent Activity -->');
    fs.writeFileSync(htmlPath, html);
    console.log('HTML updated with API UI component.');
}

// 2. Update JavaScript
let js = fs.readFileSync(jsPath, 'utf8');

const apiJsBlock = `
// ==========================================
// 🔴 LIVE API INTEGRATION (DummyJSON API)
// ==========================================
async function fetchLiveAPI() {
    const quoteEl = document.getElementById('api-quote');
    const authorEl = document.getElementById('api-author');
    if (!quoteEl) return;
    
    try {
        // Fetching random quote from a public API
        const response = await fetch('https://dummyjson.com/quotes/random');
        const data = await response.json();
        
        quoteEl.style.opacity = '0'; // smooth fade out
        
        setTimeout(() => {
            quoteEl.innerText = '"' + data.quote + '"';
            authorEl.innerText = "- " + data.author;
            quoteEl.style.opacity = '1'; // smooth fade in
        }, 300);
        
    } catch (error) {
        quoteEl.innerText = "Error loading live API snippet.";
        console.error("API Fetch Error:", error);
    }
}

// Fetch the API as soon as the app loads
document.addEventListener('DOMContentLoaded', fetchLiveAPI);
`;

if (!js.includes('fetchLiveAPI')) {
    fs.appendFileSync(jsPath, apiJsBlock);
    console.log('JS updated to fetch live API data.');
}

console.log('Successfully integrated live public API!');
