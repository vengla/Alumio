const fs = require('fs');
const path = require('path');

const mobileDir = 'e:/Tableau/project/alumni_platform/mobile';
const htmlPath = path.join(mobileDir, 'index.html');
const jsPath = path.join(mobileDir, 'mobile-app.js');

let html = fs.readFileSync(htmlPath, 'utf8');

const regHtml = `
      <!-- Registration Screen -->
      <div class="screen-view" id="register" style="display: none; background: white;">
        <div class="mobile-header">
          <button class="back-btn" onclick="showScreen('login')">←</button>
          <h2>Create Account</h2>
          <p>Join the Alumni Connect network</p>
        </div>
        <div class="mobile-content" style="padding: 1.5rem;">
          <div class="role-selector" style="margin-bottom: 1.5rem;">
            <button class="role-btn active" id="reg-role-alumni" onclick="selectRegRole('alumni')">Alumni</button>
            <button class="role-btn" id="reg-role-student" onclick="selectRegRole('student')">Student</button>
          </div>
          
          <div class="input-group">
            <label>Full Name</label>
            <input type="text" placeholder="First Last" id="reg-name">
          </div>
          <div class="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="your.name@alumni.edu" id="reg-email">
          </div>
          <div class="input-group" style="display: flex; gap: 10px;">
            <div style="flex: 1;">
              <label>Graduation Year</label>
              <input type="number" placeholder="e.g. 2024" id="reg-year">
            </div>
            <div style="flex: 1;">
              <label>Department</label>
              <input type="text" placeholder="e.g. CS" id="reg-dept">
            </div>
          </div>
          <div class="input-group">
            <label>Password</label>
            <input type="password" placeholder="Create a password" id="reg-password">
          </div>
          
          <div class="info-banner" style="background: rgba(0, 51, 102, 0.05); padding: 15px; border-radius: 10px; margin-top: 10px; margin-bottom: 20px; font-size: 0.8rem; color: var(--text-muted); border: 1px solid rgba(0,0,0,0.05);">
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="font-size: 1.2rem;">🛡️</span>
              <span>All new accounts must undergo manually verified by an Administrator to ensure campus exclusivity.</span>
            </div>
          </div>

          <button class="btn-primary" onclick="submitRegistration()">Submit Application</button>
        </div>
      </div>
`;

// Insert the register screen HTML before Dashboard
if (!html.includes('id="register"')) {
    html = html.replace('<!-- Dashboard Screen -->', regHtml + '\n      <!-- Dashboard Screen -->');

    // Change the link on the Login page to point to 'showScreen('register')' instead of '#'
    html = html.replace('<a href="#" style="color: var(--primary);">Register</a>', '<a href="#" style="color: var(--primary);" onclick="showScreen(\'register\'); return false;">Register</a>');

    fs.writeFileSync(htmlPath, html);
    console.log('Registration screen injected.');
}


let js = fs.readFileSync(jsPath, 'utf8');

const regJs = `
// ==========================================
// 📝 NEW REGISTRATION FLOW
// ==========================================
let currentRegRole = 'alumni';

function selectRegRole(role) {
    currentRegRole = role;
    document.getElementById('reg-role-alumni').classList.remove('active');
    document.getElementById('reg-role-student').classList.remove('active');
    document.getElementById('reg-role-' + role).classList.add('active');
}

// Global array to hold pending registrations dynamically
window.pendingRegistrations = [];

function submitRegistration() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const year = document.getElementById('reg-year').value;
    const dept = document.getElementById('reg-dept').value;
    const password = document.getElementById('reg-password').value;
    
    if(!name || !email || !password || !year || !dept) {
        alert("Please fill in all details to submit your application.");
        return;
    }
    
    // Save to pending mock database
    window.pendingRegistrations.unshift({
        name: name,
        email: email,
        role: currentRegRole,
        meta: \`\${dept.toUpperCase()} '\${year.slice(-2)} • Verification Pending\`
    });
    
    // Show success popup with instructions
    document.getElementById('modal-icon').textContent = '🛡️';
    document.getElementById('modal-title').textContent = 'Application Pending';
    document.getElementById('modal-desc').textContent = \`Your registration request has been submitted securely. You will receive an email once an Administrator has verified and approved your account. You cannot log in until then.\`;
    
    const popup = document.getElementById('action-modal');
    popup.style.display = 'flex';
    
    // Override the "Awesome!" button temporarily to send them back to login
    const popupBtn = popup.querySelector('.btn-primary');
    const oldOnclick = popupBtn.onclick;
    
    popupBtn.onclick = function() {
        popup.style.display = 'none';
        showScreen('login');
        
        // Clear inputs
        document.getElementById('reg-name').value = '';
        document.getElementById('reg-email').value = '';
        document.getElementById('reg-year').value = '';
        document.getElementById('reg-dept').value = '';
        document.getElementById('reg-password').value = '';
        
        // Restore old popup onclick
        popupBtn.onclick = oldOnclick;
    };
}

// Intercept Admin Login to inject dynamic pending registrations
const originalLoginForRegistration = loginUser;
loginUser = function() {
    if (typeof originalLoginForRegistration === 'function') originalLoginForRegistration();
    
    if (currentRole === 'admin') {
        const alumniList = document.querySelector('.alumni-list');
        if (alumniList && window.pendingRegistrations) {
            // First, see if we already injected dynamic ones. Remove them if so (to avoid duplicates on relogin)
            document.querySelectorAll('.dynamic-pending').forEach(el => el.remove());
            
            // Generate HTML for each pending user
            let injectHtml = '';
            window.pendingRegistrations.forEach(user => {
                const initials = user.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();
                injectHtml += \`
                <div class="alumni-card dynamic-pending" style="border-left: 4px solid var(--warning);">
                  <div class="alumni-avatar" style="background: linear-gradient(135deg, var(--warning), #f59e0b);">\${initials}</div>
                  <div class="alumni-info">
                    <div class="alumni-name">\${user.name} <span style="font-size:0.6rem; background: #eee; padding: 2px 5px; border-radius: 4px; margin-left: 5px;">\${user.role.toUpperCase()}</span></div>
                    <div class="alumni-meta">\${user.meta}</div>
                  </div>
                  <button class="btn-connect" style="background: var(--success);" onclick="
                    this.textContent='Approved'; 
                    this.parentElement.style.opacity='0.6'; 
                    this.style.pointerEvents='none';
                    alert('\${user.name} has been approved and notified!');
                  ">Approve</button>
                </div>
                \`;
            });
            
            // Prepend new mock applications to the static "John Doe" one
            alumniList.innerHTML = injectHtml + alumniList.innerHTML;
            
            // Update the pending count stat
            const pendingCountEl = document.querySelector('.stat-card .stat-value');
            if(pendingCountEl) {
                pendingCountEl.textContent = 23 + window.pendingRegistrations.length;
            }
        }
    }
};
`;

if (!js.includes('NEW REGISTRATION FLOW')) {
    fs.appendFileSync(jsPath, regJs);
    console.log('Registration JS logic appended.');
}
