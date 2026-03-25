const fs = require('fs');
const path = require('path');

const mobileDir = 'e:/Tableau/project/alumni_platform/mobile';
const htmlPath = path.join(mobileDir, 'index.html');
const jsPath = path.join(mobileDir, 'mobile-app.js');

// 1. UPDATE HTML - Add Registration List Modal
let html = fs.readFileSync(htmlPath, 'utf8');

const regModalHtml = `
  <!-- Registrations List Modal (Admin Only) -->
  <div id="admin-registrations-modal" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 2000; justify-content: center; align-items: center;">
    <div style="background: white; width: 90%; max-height: 80%; padding: 20px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); display: flex; flex-direction: column;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); padding-bottom: 10px; margin-bottom: 15px;">
        <h3 id="reg-event-title" style="margin: 0; color: var(--primary); font-size: 1.1rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Event Registrations</h3>
        <button onclick="document.getElementById('admin-registrations-modal').style.display='none'" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--danger);">✕</button>
      </div>
      
      <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;">
        <div class="activity-item" style="margin: 0;">
          <div class="activity-icon" style="background: linear-gradient(135deg, var(--primary), var(--accent)); color: white; font-weight: bold; font-size: 0.9rem;">JD</div>
          <div class="activity-content">
            <div class="activity-text" style="font-weight: 600;">John Doe</div>
            <div class="activity-time">CS '22 • Registered 2h ago</div>
          </div>
        </div>
        <div class="activity-item" style="margin: 0;">
          <div class="activity-icon" style="background: linear-gradient(135deg, var(--primary), var(--accent)); color: white; font-weight: bold; font-size: 0.9rem;">PS</div>
          <div class="activity-content">
            <div class="activity-text" style="font-weight: 600;">Priya Sharma</div>
            <div class="activity-time">EE '17 • Registered 1d ago</div>
          </div>
        </div>
        <div class="activity-item" style="margin: 0;">
          <div class="activity-icon" style="background: linear-gradient(135deg, var(--primary), var(--accent)); color: white; font-weight: bold; font-size: 0.9rem;">RK</div>
          <div class="activity-content">
            <div class="activity-text" style="font-weight: 600;">Rajesh Kumar</div>
            <div class="activity-time">CS '15 • Registered 2d ago</div>
          </div>
        </div>
      </div>
      
      <button class="btn-primary" style="margin-top: 15px; padding: 10px;" onclick="alert('Exporting to Excel...')">Export Data</button>
    </div>
  </div>
`;

if (!html.includes('id="admin-registrations-modal"')) {
    html = html.replace('</div>\r\n  </div>\r\n\r\n  <script src="mobile-app.js"></script>', regModalHtml + '\r\n    </div>\r\n  </div>\r\n\r\n  <script src="mobile-app.js"></script>');
    fs.writeFileSync(htmlPath, html);
    console.log('HTML updated with admin registrations modal.');
}

// 2. UPDATE JS
let js = fs.readFileSync(jsPath, 'utf8');

const regListJs = `
// ==========================================
// 📊 ADMIN REGISTRATIONS LIST VIEW
// ==========================================

function showAdminRegistrations(eventTitle) {
    document.getElementById('reg-event-title').textContent = eventTitle;
    document.getElementById('admin-registrations-modal').style.display = 'flex';
}

const originalLoginForAdminEvents = loginUser;
loginUser = function() {
    if (typeof originalLoginForAdminEvents === 'function') originalLoginForAdminEvents();
    
    // We already hid the buttons for admins previously, so let's unhide the ones on events and transform them!
    if (currentRole === 'admin') {
        const eventCards = document.querySelectorAll('.event-card');
        eventCards.forEach(card => {
            const btn = card.querySelector('.btn-register');
            if(btn && !btn.textContent.includes('Donate')) {
                btn.style.display = 'block'; // Make it visible again
                btn.textContent = 'View Registrations';
                btn.style.background = '#475569'; // distinctive gray-blue color
                
                // Override the onclick to open the admin view
                btn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation(); // Stop the generic success modal from opening
                    const title = card.querySelector('.event-title').textContent;
                    showAdminRegistrations(title);
                };
            }
        });
    }
};
`;

if (!js.includes('showAdminRegistrations')) {
    fs.appendFileSync(jsPath, regListJs);
    console.log('JS updated to show registrations for Admins.');
}
