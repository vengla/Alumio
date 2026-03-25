const fs = require('fs');

const htmlPath = 'e:/Tableau/project/alumni_platform/mobile/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const targetHtml = `<textarea id="msg-content" rows="4" placeholder="Type your message here..."`;

const replaceHtml = `
          <label style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); margin-bottom: 5px; display: block; text-align: left;">Quick Reply Templates:</label>
          <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 15px; justify-content: flex-start;">
              <button onclick="setMsgOption('Are we still on for our mentoring session?')" style="padding: 5px 10px; background: var(--bg-surface); border: 1px solid var(--border-light); color: var(--text-main); border-radius: 12px; font-size: 0.75rem; cursor: pointer;">📅 Meeting Check</button>
              <button onclick="setMsgOption('Could you please review the attached document?')" style="padding: 5px 10px; background: var(--bg-surface); border: 1px solid var(--border-light); color: var(--text-main); border-radius: 12px; font-size: 0.75rem; cursor: pointer;">📄 Review Work</button>
              <button onclick="setMsgOption('Just checking in on your job hunt progress!')" style="padding: 5px 10px; background: var(--bg-surface); border: 1px solid var(--border-light); color: var(--text-main); border-radius: 12px; font-size: 0.75rem; cursor: pointer;">👋 Progress Check</button>
              <button onclick="setMsgOption('Here is a referral link that might help you.')" style="padding: 5px 10px; background: var(--bg-surface); border: 1px solid var(--border-light); color: var(--text-main); border-radius: 12px; font-size: 0.75rem; cursor: pointer;">🔗 Referral Link</button>
          </div>
          <textarea id="msg-content" rows="4" placeholder="Type your message here..."`;

if (!html.includes('Quick Reply Templates:')) {
    html = html.replace(targetHtml, replaceHtml);
    fs.writeFileSync(htmlPath, html);
    console.log('Added quick reply templates to the HTML');
}

const jsPath = 'e:/Tableau/project/alumni_platform/mobile/mobile-app.js';
let js = fs.readFileSync(jsPath, 'utf8');

const msgJs = `
function setMsgOption(text) {
    const msgBox = document.getElementById('msg-content');
    if(msgBox) msgBox.value = text;
}
`;

if (!js.includes('function setMsgOption')) {
    fs.appendFileSync(jsPath, "\n" + msgJs);
    console.log('Added setMsgOption JS logic');
}
