const fs = require('fs');

const htmlPath = 'e:/Tableau/project/alumni_platform/mobile/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const infoModalHtml = `
      <!-- General Info Modal for Job/Event Details -->
      <div id="info-modal"
        style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 2000; justify-content: center; align-items: center;">
        <div
          style="background: white; width: 85%; padding: 20px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
          
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; border-bottom: 1px solid var(--border-light); padding-bottom: 10px;">
            <div style="flex: 1; padding-right: 15px;">
              <h3 id="info-title" style="margin: 0; color: var(--text-main); font-size: 1.1rem; line-height: 1.3;">Details</h3>
              <div id="info-subtitle" style="font-size: 0.8rem; color: var(--text-muted); margin-top: 5px;"></div>
            </div>
            <button onclick="document.getElementById('info-modal').style.display='none'"
              style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--danger);">✕</button>
          </div>
          
          <div id="info-description" style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px; line-height: 1.5; background: var(--bg-surface); padding: 12px; border-radius: 8px; border: 1px dashed var(--border-light);">
            Description goes here...
          </div>
          
          <button id="info-confirm-btn" class="btn-primary" style="width: 100%;">Confirm</button>
        </div>
      </div>
`;

if (!html.includes('id="info-modal"')) {
    html = html.replace('<!-- Custom Modal Popup -->', infoModalHtml + '\n      <!-- Custom Modal Popup -->');
    fs.writeFileSync(htmlPath, html);
    console.log('Info Modal added to HTML.');
}


const jsPath = 'e:/Tableau/project/alumni_platform/mobile/mobile-app.js';
let js = fs.readFileSync(jsPath, 'utf8');

const updatedJs = `
function bindNormalButtonActions() {
    // Helper to open the new Info modal
    function openInfoModal(title, subtitle, description, confirmText, onConfirm) {
        document.getElementById('info-title').innerHTML = title;
        document.getElementById('info-subtitle').innerHTML = subtitle;
        document.getElementById('info-description').innerHTML = description;
        
        const confirmBtn = document.getElementById('info-confirm-btn');
        confirmBtn.textContent = confirmText;
        
        // Remove previous listeners using replacement clone trick
        const newBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
        
        newBtn.onclick = function() {
            document.getElementById('info-modal').style.display = 'none';
            onConfirm();
        };
        
        document.getElementById('info-modal').style.display = 'flex';
    }

    // 1. Re-bind Apply buttons
    document.querySelectorAll('.btn-apply').forEach(btn => {
        // Skip over the ones in the Admin panel that are used for viewing
        if (btn.textContent.includes('Applicants') || btn.textContent.includes('✓')) return;
        
        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (currentRole === 'admin') return;
            
            const card = this.parentElement;
            const jobTitle = card.querySelector('.job-title').textContent;
            
            // Safe extraction of optional text
            const companyEl = card.querySelector('.job-company');
            const company = companyEl ? companyEl.textContent : 'Top Tech Company';
            
            const metaContainer = card.querySelector('.job-meta');
            const metaHtml = metaContainer ? metaContainer.innerHTML : '';
            
            const postedEl = card.querySelector('.job-posted');
            const posted = postedEl ? postedEl.textContent : 'Recently posted';
            
            const desc = \`
                <strong>Role Overview:</strong><br>
                We are actively looking for a talented \${jobTitle} to join our team at \${company}.
                <br><br>
                <div style="font-weight:600; font-size:0.75rem;">\${metaHtml}</div>
                <br>
                <em>\${posted}</em>
            \`;
            
            openInfoModal('ðŸ’¼ ' + jobTitle, company, desc, 'Confirm Application', () => {
                showActionModal('apply', jobTitle);
                this.textContent = 'Applied ✓';
                this.style.background = 'var(--success)';
                this.style.pointerEvents = 'none';
            });
        };
    });

    // 2. Re-bind Register buttons (for Events)
    document.querySelectorAll('.btn-register').forEach(btn => {
        // Skip over Admin, Donate Buttons, or already registered ones
        if (btn.textContent.includes('Registrations') || btn.textContent.includes('Donate') || btn.textContent.includes('✓')) return;

        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (currentRole === 'admin') {
                const title = this.parentElement.querySelector('.event-title').textContent;
                showAdminRegistrations(title);
                return;
            }
            
            const card = this.parentElement;
            const eventTitle = card.querySelector('.event-title').textContent;
            
            const detailsContainer = card.querySelector('.event-details');
            const detailsHtml = detailsContainer ? detailsContainer.innerHTML : '';
            
            const desc = \`
                <strong>Event Highlights:</strong><br>
                Join fellow alumni and students for an engaging networking session and keynote speech regarding "\${eventTitle}". Don't miss out on connecting with peers!
                <br><br>
                <div style="font-weight:600; font-size:0.75rem;">\${detailsHtml}</div>
                <br>
                <span style="color:var(--primary); font-size:0.75rem; font-weight:bold;">✨ Includes Networking & Snacks</span>
            \`;
            
            openInfoModal('🎟️ ' + eventTitle, 'Official Campus Event', desc, 'Confirm Registration', () => {
                showActionModal('register', eventTitle);
                this.textContent = 'Registered ✓';
                this.style.background = 'var(--success)';
                this.style.pointerEvents = 'none';
            });
        };
    });
}
`;

// Replace the old bindNormalButtonActions logic entirely
const regex = /function bindNormalButtonActions\(\) \{[\s\S]*?\}\s*(?=\/\/ Ensure the bindings happen)/;
if (regex.test(js)) {
    js = js.replace(regex, updatedJs + '\n');
    fs.writeFileSync(jsPath, js);
    console.log('Mobile app JS updated for info modals.');
} else {
    // If exact regex fails, warn
    console.log('Could not find existing bindNormalButtonActions to replace.');
}
