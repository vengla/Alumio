const fs = require('fs');
const path = require('path');

const file = 'e:/Tableau/project/alumni_platform/mobile/index.html';
let html = fs.readFileSync(file, 'utf8');

const targetStr = `<button class="btn-primary" onclick="loginUser()">Login</button>
          <p class="text-center text-muted" style="margin-top: 1rem;">
            Don't have an account? <a href="#" style="color: var(--primary);">Register</a>
          </p>`;

const replacementStr = `<button class="btn-primary" onclick="loginUser()">Login</button>
          <p class="text-center text-muted" style="margin-top: 1rem;">
            Don't have an account? <a href="#" style="color: var(--primary);">Register</a>
          </p>
          <div style="background: rgba(255,255,255,0.7); backdrop-filter: blur(5px); padding: 0.875rem; border-radius: var(--radius); margin-top: 1.5rem; border: 1px dashed var(--primary); text-align: center;">
            <p style="font-size: 0.8rem; font-weight: 600; color: var(--primary); margin-bottom: 0.5rem;">📱 Demo Mode Access</p>
            <p style="font-size: 0.75rem; color: #555; margin-bottom: 2px;">Email: <strong>demo@app.com</strong></p>
            <p style="font-size: 0.75rem; color: #555;">Password: <strong>123456</strong></p>
            <p style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.5rem; font-style: italic;">(Note: We accept any credentials right now! Features will change based on your selected role above.)</p>
          </div>`;

if (html.includes(targetStr)) {
    html = html.replace(targetStr, replacementStr);
    fs.writeFileSync(file, html);
    console.log('Login credentials text added.');
} else {
    // try CRLF
    const targetStrWin = targetStr.replace(/\n/g, '\r\n');
    if (html.includes(targetStrWin)) {
        html = html.replace(targetStrWin, replacementStr.replace(/\n/g, '\r\n'));
        fs.writeFileSync(file, html);
        console.log('Login credentials text added (CRLF).');
    } else {
        console.error('Target string not found!');
    }
}
