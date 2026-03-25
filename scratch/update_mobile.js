const fs = require('fs');
const path = require('path');

const mobileDir = 'e:/Tableau/project/alumni_platform/mobile';

// We will read index.html, inject new screens before the last </div><!-- phone-screen -->
let html = fs.readFileSync(path.join(mobileDir, 'index.html'), 'utf8');

const newScreens = `

      <!-- Donations Screen -->
      <div class="screen-view" id="donations" style="display: none;">
        <div class="mobile-header">
          <button class="back-btn" onclick="showScreen('dashboard')">←</button>
          <h2>Donations & Giving</h2>
        </div>
        <div class="mobile-content">
          <div class="info-banner" style="background: linear-gradient(135deg, #fef08a 0%, #fef9c3 100%); border-color: var(--accent);">
            <div class="banner-icon">❤️</div>
            <div class="banner-content">
              <div class="banner-title">Total Raised: ₹2.5Cr</div>
              <div class="banner-text">Help us reach our ₹5Cr goal</div>
            </div>
          </div>
          
          <div class="event-list">
            <div class="event-card">
              <div class="event-title">Scholarship Fund</div>
              <div class="event-details text-muted" style="font-size:0.875rem;">Support underprivileged students.</div>
              <div class="event-progress">
                <div class="progress-bar" style="width: 65%; background: var(--accent);"></div>
              </div>
              <button class="btn-register" style="background: var(--accent); color: #000;" onclick="alert('Proceeding to Payment Gateay')">Donate Now</button>
            </div>
          </div>
        </div>
        <div class="bottom-nav">
          <button class="nav-btn" onclick="showScreen('dashboard')"><span class="nav-icon">🏠</span><span class="nav-label">Home</span></button>
          <button class="nav-btn" onclick="showScreen('directory')"><span class="nav-icon">👥</span><span class="nav-label">Directory</span></button>
          <button class="nav-btn" onclick="showScreen('jobs')"><span class="nav-icon">💼</span><span class="nav-label">Jobs</span></button>
          <button class="nav-btn" onclick="showScreen('profile')"><span class="nav-icon">⚙️</span><span class="nav-label">Profile</span></button>
        </div>
      </div>

      <!-- Admin Screen -->
      <div class="screen-view" id="admin" style="display: none;">
        <div class="mobile-header">
          <button class="back-btn" onclick="showScreen('dashboard')">←</button>
          <h2>Admin Dashboard</h2>
        </div>
        <div class="mobile-content">
          <div class="stat-grid">
            <div class="stat-card"><div class="stat-value">23</div><div class="stat-label">Pending Approvals</div></div>
            <div class="stat-card"><div class="stat-value">12K+</div><div class="stat-label">Total Alumni</div></div>
          </div>
          <div class="section-header"><h3>Recent Approvals Needed</h3></div>
          <div class="alumni-list">
            <div class="alumni-card">
              <div class="alumni-avatar">JD</div>
              <div class="alumni-info">
                <div class="alumni-name">John Doe</div><div class="alumni-meta">Requires verification</div>
              </div>
              <button class="btn-connect" style="background: var(--success);" onclick="alert('Approved')">Approve</button>
            </div>
          </div>
        </div>
        <div class="bottom-nav">
          <button class="nav-btn active" onclick="showScreen('dashboard')"><span class="nav-icon">🏠</span><span class="nav-label">Home</span></button>
          <button class="nav-btn" onclick="showScreen('directory')"><span class="nav-icon">👥</span><span class="nav-label">Directory</span></button>
          <button class="nav-btn" onclick="showScreen('jobs')"><span class="nav-icon">💼</span><span class="nav-label">Jobs</span></button>
          <button class="nav-btn" onclick="showScreen('profile')"><span class="nav-icon">⚙️</span><span class="nav-label">Settings</span></button>
        </div>
      </div>

      <!-- Profile Screen -->
      <div class="screen-view" id="profile" style="display: none;">
        <div class="mobile-header">
          <button class="back-btn" onclick="showScreen('dashboard')">←</button>
          <h2>My Profile</h2>
        </div>
        <div class="mobile-content">
          <div style="text-align: center; margin-bottom: 2rem;">
            <div class="alumni-avatar" style="width: 100px; height: 100px; margin: 0 auto 1rem auto; font-size: 2.5rem;" id="profile-avatar">JA</div>
            <h2 id="profile-name">John Alumnus</h2>
            <p class="text-muted" id="profile-role">Alumni</p>
          </div>
          <div class="input-group">
            <label>Full Name</label>
            <input type="text" value="John Alumnus">
          </div>
          <div class="input-group">
            <label>Current Company</label>
            <input type="text" value="Tech Corp">
          </div>
          <button class="btn-primary" onclick="alert('Profile Saved')">Save Profile</button>
          <button class="btn-primary" style="background: var(--danger); margin-top: 1rem;" onclick="showScreen('login')">Logout</button>
        </div>
        <div class="bottom-nav">
          <button class="nav-btn" onclick="showScreen('dashboard')"><span class="nav-icon">🏠</span><span class="nav-label">Home</span></button>
          <button class="nav-btn" onclick="showScreen('directory')"><span class="nav-icon">👥</span><span class="nav-label">Directory</span></button>
          <button class="nav-btn" onclick="showScreen('jobs')"><span class="nav-icon">💼</span><span class="nav-label">Jobs</span></button>
          <button class="nav-btn active" onclick="showScreen('profile')"><span class="nav-icon">⚙️</span><span class="nav-label">Profile</span></button>
        </div>
      </div>
`;

// Insert newScreens before the last closing tags
html = html.replace('    </div>\r\n  </div>\r\n\r\n  <script src="mobile-app.js"></script>', newScreens + '\r\n    </div>\r\n  </div>\r\n\r\n  <script src="mobile-app.js"></script>');

fs.writeFileSync(path.join(mobileDir, 'index.html'), html);

// JS Update
let js = fs.readFileSync(path.join(mobileDir, 'mobile-app.js'), 'utf8');

const jsUpdate = `
// Append to quick actions dashboard to handle new navigation
document.addEventListener('DOMContentLoaded', () => {
    const actionGrid = document.querySelector('.action-grid');
    if(actionGrid && !actionGrid.innerHTML.includes('Donations')) {
        actionGrid.innerHTML += \`
            <button class="action-card" onclick="showScreen('donations')">
              <div class="action-icon">❤️</div>
              <div class="action-label">Donations</div>
            </button>
        \`;
    }
    
    // update profile icon navigation
    const settingsBtns = document.querySelectorAll('.nav-btn');
    settingsBtns.forEach(btn => {
        if(btn.innerHTML.includes('Settings') || btn.innerHTML.includes('Profile')) {
            btn.onclick = () => showScreen('profile');
        }
    });
});

// Admin redirect logic
const originalLogin = loginUser;
loginUser = function() {
    originalLogin();
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    if (!email || !password) return;
    
    document.getElementById('profile-name').textContent = document.getElementById('user-name').textContent;
    const parts = document.getElementById('user-name').textContent.split(' ');
    document.getElementById('profile-avatar').textContent = parts[0][0] + (parts[1]?.[0] || '');
    document.getElementById('profile-role').textContent = currentRole.toUpperCase();
    
    if (currentRole === 'admin') {
        const actionGrid = document.querySelector('.action-grid');
        if(actionGrid && !actionGrid.innerHTML.includes('Admin Panel')) {
            actionGrid.innerHTML = \`
                <button class="action-card" onclick="showScreen('admin')">
                  <div class="action-icon">⚙️</div>
                  <div class="action-label">Admin Panel</div>
                </button>
            \` + actionGrid.innerHTML;
        }
    }
};
`;

fs.appendFileSync(path.join(mobileDir, 'mobile-app.js'), jsUpdate);

console.log('Mobile app upgraded successfully!');
