const fs = require('fs');

const htmlPath = 'e:/Tableau/project/alumni_platform/mobile/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const targetStr = '<button onclick="processDonation()" style="background: var(--accent); color: #000; padding:12px; width:100%; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">Proceed to Donate</button>';

const replacementStr = targetStr + `
          <div style="background: rgba(0, 100, 255, 0.05); border: 1px dashed rgba(0, 100, 255, 0.3); border-radius: 8px; padding: 10px; margin-top: 15px; font-size: 0.75rem; text-align: center; color: var(--text-muted);">
            <strong>💳 Demo Payment Info</strong><br>
            Any UPI ID (e.g., <code>test@upi</code>) <br> or Card No: <code>4111 1111 1111 1111</code>
          </div>
`;

if (!html.includes('Demo Payment Info')) {
    html = html.replace(targetStr, replacementStr);
    fs.writeFileSync(htmlPath, html);
    console.log('Demo payment instructions added to modal.');
} else {
    console.log('Already added.');
}
