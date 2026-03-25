const fs = require('fs');
const path = require('path');

const file = 'e:/Tableau/project/alumni_platform/mobile/index.html';
let html = fs.readFileSync(file, 'utf8');

// The block we added earlier
const targetRegex = /<div style="background: rgba\(255,255,255,0\.7\); backdrop-filter: blur\(5px\); padding: 0\.875rem; border-radius: var\(--radius\); margin-top: 1\.5rem; border: 1px dashed var\(--primary\); text-align: center;">[\s\S]*?<\/div>/m;

const replacementStr = `<div style="background: rgba(255,255,255,0.7); backdrop-filter: blur(5px); padding: 0.875rem; border-radius: var(--radius); margin-top: 1.5rem; border: 1px dashed var(--primary); text-align: left;">
            <p style="font-size: 0.8rem; font-weight: 600; color: var(--primary); margin-bottom: 0.5rem; text-align: center;">📱 Demo Mode Access</p>
            <div style="display: flex; justify-content: space-between; font-size: 0.70rem; color: #444; margin-bottom: 4px; border-bottom: 1px solid #eee; padding-bottom: 4px;">
              <strong>🎓 Alumni:</strong> <span>alumni@demo.com</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.70rem; color: #444; margin-bottom: 4px; border-bottom: 1px solid #eee; padding-bottom: 4px;">
              <strong>📚 Student:</strong> <span>student@demo.com</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.70rem; color: #444; margin-bottom: 4px; border-bottom: 1px solid #eee; padding-bottom: 4px;">
              <strong>⚙️ Admin:</strong> <span>admin@demo.com</span>
            </div>
            <p style="font-size: 0.7rem; color: #555; text-align: center; margin-top: 6px;">
              Password for all: <strong>123456</strong>
            </p>
            <p style="font-size: 0.65rem; color: var(--text-muted); margin-top: 0.5rem; font-style: italic; text-align: center; line-height: 1.2;">
              (Tip: Select a role tab above to change the dashboard features!)
            </p>
          </div>`;

if (targetRegex.test(html)) {
    html = html.replace(targetRegex, replacementStr);
    fs.writeFileSync(file, html);
    console.log('Login credentials detailed matrix added successfully.');
} else {
    console.error('Target regex not found. Attempting fallback.');
}
