const fs = require('fs');

const htmlPath = 'e:/Tableau/project/alumni_platform/mobile/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const adminDonorsHtml = `
          <!-- Admin Only: Donor List & Timeline -->
          <div id="admin-donors-section" style="display: none; margin-top: 20px;">
            <div class="section-header">
              <h3 style="color: var(--primary);">📊 Recent Donations</h3>
            </div>
            
            <div class="alumni-list" style="margin-bottom: 20px;">
              <div class="alumni-card" style="border-left: 4px solid var(--accent); position: relative;">
                <div class="alumni-avatar" style="background: var(--bg-surface); color: var(--text-main); font-weight: bold; border: 2px solid var(--accent);">
                  ₹1L
                </div>
                <div class="alumni-info">
                  <div class="alumni-name">Michael Chang</div>
                  <div class="alumni-role" style="font-size: 0.8rem; color: var(--text-muted);">Alumni  •  Class of '10</div>
                  <div class="alumni-meta" style="color: var(--text-main); font-size: 0.75rem; font-weight: 500;">Scholarship Fund</div>
                </div>
                <span style="font-size: 0.7rem; color: var(--text-muted); position: absolute; top: 10px; right: 10px;">Today, 10:30 AM</span>
              </div>
              
              <div class="alumni-card" style="border-left: 4px solid var(--accent); position: relative;">
                <div class="alumni-avatar" style="background: var(--bg-surface); color: var(--text-main); font-weight: bold; border: 2px solid var(--accent);">
                  ₹50k
                </div>
                <div class="alumni-info">
                  <div class="alumni-name">Anita Patel</div>
                  <div class="alumni-role" style="font-size: 0.8rem; color: var(--text-muted);">Alumni  •  Class of '15</div>
                  <div class="alumni-meta" style="color: var(--text-main); font-size: 0.75rem; font-weight: 500;">General Endowment</div>
                </div>
                <span style="font-size: 0.7rem; color: var(--text-muted); position: absolute; top: 10px; right: 10px;">Yesterday</span>
              </div>
              
              <div class="alumni-card" style="border-left: 4px solid var(--accent); position: relative;">
                <div class="alumni-avatar" style="background: var(--bg-surface); color: var(--text-main); font-weight: bold; border: 2px solid var(--accent);">
                  ₹10k
                </div>
                <div class="alumni-info">
                  <div class="alumni-name">Rajesh Kumar</div>
                  <div class="alumni-role" style="font-size: 0.8rem; color: var(--text-muted);">Senior SDE @ Google</div>
                  <div class="alumni-meta" style="color: var(--text-main); font-size: 0.75rem; font-weight: 500;">Scholarship Fund</div>
                </div>
                <span style="font-size: 0.7rem; color: var(--text-muted); position: absolute; top: 10px; right: 10px;">2 days ago</span>
              </div>
            </div>
          </div>
`;

if (!html.includes('id="admin-donors-section"')) {
    html = html.replace(/\<div class="event-list"\>/, adminDonorsHtml + '\n          <div class="event-list">');
    fs.writeFileSync(htmlPath, html);
    console.log('Admin Donors section added to HTML.');
}


const jsPath = 'e:/Tableau/project/alumni_platform/mobile/mobile-app.js';
let js = fs.readFileSync(jsPath, 'utf8');

const adminDonorsJs = `
// ==========================================
// 💸 ADMIN DONORS VIEW LOGIC
// ==========================================
const originalLoginForAdminDonors = loginUser;
loginUser = function() {
    if (typeof originalLoginForAdminDonors === 'function') originalLoginForAdminDonors();
    
    const adminDonorsSec = document.getElementById('admin-donors-section');
    if (adminDonorsSec) {
        if (currentRole === 'admin') {
            adminDonorsSec.style.display = 'block';
        } else {
            adminDonorsSec.style.display = 'none';
        }
    }
};
`;

if (!js.includes('ADMIN DONORS VIEW LOGIC')) {
    fs.appendFileSync(jsPath, "\n" + adminDonorsJs);
    console.log('Appended Admin Donors logic to JS');
} else {
    console.log('Admin Donors logic already attached.');
}
