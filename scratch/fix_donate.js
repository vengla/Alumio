const fs = require('fs');
const path = require('path');

const htmlPath = 'e:/Tableau/project/alumni_platform/mobile/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// Update Donate Now button
html = html.replace(/onclick="alert\('Proceeding to Payment Gateway'\)">Donate Now<\/button>/g, `onclick="handleDonation(this, 'Scholarship Fund')">Donate Now</button>`);
fs.writeFileSync(htmlPath, html);

const jsPath = 'e:/Tableau/project/alumni_platform/mobile/mobile-app.js';
let js = fs.readFileSync(jsPath, 'utf8');

const donateJs = `
// ==========================================
// 💰 DONATION LOGIC
// ==========================================
function handleDonation(btn, fundName) {
    if (currentRole === 'admin') return;
    
    // Customize modal for donation
    const modal = document.getElementById('action-modal');
    document.getElementById('modal-icon').textContent = '❤️';
    document.getElementById('modal-title').textContent = 'Thank You!';
    document.getElementById('modal-desc').textContent = \`Your donation to the "\${fundName}" has been successfully processed. A receipt has been sent to your email.\`;
    
    modal.style.display = 'flex';
    
    btn.textContent = 'Donated ✓';
    btn.style.background = 'var(--success)';
    btn.style.pointerEvents = 'none';
}
`;

if (!js.includes('DONATION LOGIC')) {
    fs.appendFileSync(jsPath, donateJs);
    console.log('Donation logic added.');
}
