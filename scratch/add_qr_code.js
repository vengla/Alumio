const fs = require('fs');

const htmlPath = 'e:/Tableau/project/alumni_platform/mobile/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const regex = /<div style="background: rgba\(0, 100, 255, 0\.05\);[\s\S]*?<\/div>/;

const replacement = `
          <div style="background: rgba(0, 100, 255, 0.05); border: 1px dashed rgba(0, 100, 255, 0.3); border-radius: 8px; padding: 10px; margin-top: 15px; font-size: 0.75rem; text-align: center; color: var(--text-muted); display: flex; align-items: center; justify-content: center; gap: 15px;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=upi://pay?pa=demo@upi&pn=Alumni%20Connect%20Demo" alt="Demo QR" style="border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); width: 80px; height: 80px;">
            <div style="text-align: left;">
              <strong style="color: var(--primary);">📲 Scan to Pay (Mock)</strong><br>
              UPI: <code>test@upi</code><br>
              Card: <code>4111 .... 1111</code><br>
              <span style="font-size: 0.65rem; font-style: italic;">Scan with any app for demo</span>
            </div>
          </div>
`;

if (regex.test(html)) {
    html = html.replace(regex, replacement.trim());
    fs.writeFileSync(htmlPath, html);
    console.log('QR Code added to donation modal');
} else {
    console.log('Target section not found.');
}
