const fs = require('fs');
const path = require('path');

const jsPath = 'e:/Tableau/project/alumni_platform/mobile/mobile-app.js';
let js = fs.readFileSync(jsPath, 'utf8');

const fixJs = `
// ==========================================
// 🛠️ FIX FOR BUTTON INTERACTIVITY
// ==========================================
function bindNormalButtonActions() {
    // 1. Re-bind Apply buttons
    document.querySelectorAll('.btn-apply').forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (currentRole === 'admin') return;
            const jobTitle = this.parentElement.querySelector('.job-title').textContent;
            showActionModal('apply', jobTitle);
            this.textContent = 'Applied ✓';
            this.style.background = 'var(--success)';
            this.style.pointerEvents = 'none';
        };
    });

    // 2. Re-bind Request buttons
    document.querySelectorAll('.btn-request').forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (currentRole === 'admin') return;
            const mentorName = this.parentElement.querySelector('.mentor-name').textContent;
            showActionModal('request', mentorName);
            this.textContent = 'Requested ✓';
            this.style.background = 'var(--success)';
            this.style.pointerEvents = 'none';
        };
    });

    // 3. Re-bind Register buttons
    document.querySelectorAll('.btn-register').forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (currentRole === 'admin' && !this.textContent.includes('Donate')) {
                const title = this.parentElement.querySelector('.event-title').textContent;
                showAdminRegistrations(title);
                return;
            }
            if(this.textContent.includes('Donate')) return;
            
            const eventTitle = this.parentElement.querySelector('.event-title').textContent;
            showActionModal('register', eventTitle);
            this.textContent = 'Registered ✓';
            this.style.background = 'var(--success)';
            this.style.pointerEvents = 'none';
        };
    });
}

// Ensure the bindings happen every single time someone logs in!
const originalLoginForFix = loginUser;
loginUser = function() {
    if (typeof originalLoginForFix === 'function') originalLoginForFix();
    
    // In case Admin overrode the onclicks before, let's rigidly re-bind them with robust Role-aware logic.
    bindNormalButtonActions();
};

// Also invoke immediately in case it's lingering
bindNormalButtonActions();
`;

if (!js.includes('FIX FOR BUTTON INTERACTIVITY')) {
    fs.appendFileSync(jsPath, fixJs);
    console.log('Button interactivity fix applied.');
}
