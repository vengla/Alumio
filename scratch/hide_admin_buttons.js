const fs = require('fs');
const path = require('path');

const jsPath = 'e:/Tableau/project/alumni_platform/mobile/mobile-app.js';
let js = fs.readFileSync(jsPath, 'utf8');

const hideButtonsJs = `
// ==========================================
// 🛡️ ROLE-BASED BUTTON VISIBILITY
// ==========================================
const originalLoginForSecurity = loginUser;
loginUser = function() {
    if (typeof originalLoginForSecurity === 'function') originalLoginForSecurity();
    
    // Select all action buttons on cards
    const actionButtons = document.querySelectorAll('.btn-apply, .btn-request, .btn-register, .btn-connect');
    
    if (currentRole === 'admin') {
        // Admin should not apply, register, request, or connect
        actionButtons.forEach(btn => {
            // Don't hide the "Donate Now" button if it uses the register class
            if (!btn.textContent.includes('Donate') && !btn.textContent.includes('Approve')) {
                btn.style.display = 'none';
            }
        });
    } else {
        // Students and Alumni can see them
        actionButtons.forEach(btn => {
            // Restore display property
            btn.style.display = 'block'; 
            
            // Re-center buttons that were blocks
            if (btn.classList.contains('btn-connect') && !btn.closest('.alumni-card')) {
                // If it's the admin approve button, let the admin logic handle it
            }
        });
    }
};
`;

if (!js.includes('ROLE-BASED BUTTON VISIBILITY')) {
    fs.appendFileSync(jsPath, hideButtonsJs);
    console.log('Role-based button visibility applied!');
} else {
    console.log('Already applied.');
}
