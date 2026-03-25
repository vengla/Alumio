const fs = require('fs');
const path = require('path');

const mobileDir = 'e:/Tableau/project/alumni_platform/mobile';
const htmlPath = path.join(mobileDir, 'index.html');
const cssPath = path.join(mobileDir, 'mobile-styles.css');
const jsPath = path.join(mobileDir, 'mobile-app.js');

// 1. UPDATE HTML
let html = fs.readFileSync(htmlPath, 'utf8');

const modalHtml = `
  <!-- Custom Modal Popup -->
  <div id="action-modal" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 2000; justify-content: center; align-items: center;">
    <div style="background: white; width: 85%; padding: 20px; border-radius: 20px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.3); animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
      <div id="modal-icon" style="font-size: 3rem; margin-bottom: 15px;">✅</div>
      <h3 id="modal-title" style="margin-bottom: 10px; color: var(--text-main);">Success!</h3>
      <p id="modal-desc" style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px; line-height: 1.4;">Your request has been processed.</p>
      <button onclick="document.getElementById('action-modal').style.display='none'" class="btn-primary" style="width: 100%;">Awesome!</button>
    </div>
  </div>
`;

if (!html.includes('id="action-modal"')) {
    html = html.replace('</div>\r\n  </div>\r\n\r\n  <script src="mobile-app.js"></script>', modalHtml + '\r\n    </div>\r\n  </div>\r\n\r\n  <script src="mobile-app.js"></script>');
    fs.writeFileSync(htmlPath, html);
    console.log('HTML updated with modal popup.');
}

// 2. UPDATE CSS
let css = fs.readFileSync(cssPath, 'utf8');
const modalCss = `
/* Modal Animation */
@keyframes popIn {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
}
`;

if (!css.includes('keyframes popIn')) {
    fs.appendFileSync(cssPath, modalCss);
    console.log('CSS updated with modal animations.');
}

// 3. UPDATE JS
let js = fs.readFileSync(jsPath, 'utf8');

const modalJs = `
// ==========================================
// 💡 INTERACTIVE MODAL ACTIONS
// ==========================================

function showActionModal(type, title) {
    const modal = document.getElementById('action-modal');
    const mIcon = document.getElementById('modal-icon');
    const mTitle = document.getElementById('modal-title');
    const mDesc = document.getElementById('modal-desc');
    
    modal.style.display = 'flex';
    
    if (type === 'apply') {
        mIcon.textContent = '📄';
        mTitle.textContent = 'Application Sent!';
        mDesc.textContent = \`Your resume has been successfully submitted for the "\${title}" role.\`;
    } 
    else if (type === 'request') {
        mIcon.textContent = '🤝';
        mTitle.textContent = 'Request Sent!';
        mDesc.textContent = \`A mentorship request has been sent to \${title}. We will notify you when they respond.\`;
    }
    else if (type === 'register') {
        mIcon.textContent = '🎟️';
        mTitle.textContent = 'Registered!';
        mDesc.textContent = \`Your seat for "\${title}" is confirmed. Check your email for details.\`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Attach to Job Apply buttons
    document.querySelectorAll('.btn-apply').forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            const jobTitle = this.parentElement.querySelector('.job-title').textContent;
            showActionModal('apply', jobTitle);
            this.textContent = 'Applied ✓';
            this.style.background = 'var(--success)';
            this.style.pointerEvents = 'none';
        };
    });

    // Attach to Mentor Request buttons
    document.querySelectorAll('.btn-request').forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            const mentorName = this.parentElement.querySelector('.mentor-name').textContent;
            showActionModal('request', mentorName);
            this.textContent = 'Requested ✓';
            this.style.background = 'var(--success)';
            this.style.pointerEvents = 'none';
        };
    });

    // Attach to Event Register buttons
    document.querySelectorAll('.btn-register').forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            const eventTitle = this.parentElement.querySelector('.event-title').textContent;
            // Prevent overriding donate button if it shares the class
            if(this.textContent.includes('Donate')) return; 
            
            showActionModal('register', eventTitle);
            this.textContent = 'Registered ✓';
            this.style.background = 'var(--success)';
            this.style.pointerEvents = 'none';
        };
    });
});
`;

if (!js.includes('showActionModal')) {
    fs.appendFileSync(jsPath, modalJs);
    console.log('JS updated with modal logic.');
}

console.log('Custom popup modals injected successfully!');
