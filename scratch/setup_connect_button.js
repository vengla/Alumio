const fs = require('fs');
const path = require('path');

const jsPath = 'e:/Tableau/project/alumni_platform/mobile/mobile-app.js';
let js = fs.readFileSync(jsPath, 'utf8');

const updatedJs = `
// ==========================================
// 🔗 CONNECT BUTTON LOGIC
// ==========================================
function bindConnectButtons() {
    document.querySelectorAll('.btn-connect').forEach(btn => {
        // Skip over the ones in the Admin panel that are used for approvals
        if (btn.textContent.includes('Approve')) return;
        
        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (currentRole === 'admin') return;
            
            const alumniName = this.parentElement.querySelector('.alumni-name').textContent;
            
            // Show custom success modal
            const modal = document.getElementById('action-modal');
            document.getElementById('modal-icon').textContent = '🤝';
            document.getElementById('modal-title').textContent = 'Connection Request Sent!';
            document.getElementById('modal-desc').textContent = \`You have sent a connection request to \${alumniName}. We will let you know when they accept.\`;
            
            modal.style.display = 'flex';
            
            this.textContent = 'Pending';
            this.style.background = 'var(--text-muted)';
            this.style.pointerEvents = 'none';
        };
    });
}

const originalLoginForConnect = loginUser;
loginUser = function() {
    if (typeof originalLoginForConnect === 'function') originalLoginForConnect();
    bindConnectButtons();
};

// Also invoke immediately in case it's already rendered
bindConnectButtons();
`;

// Insert the new logic if it hasn't been added before
if (!js.includes('CONNECT BUTTON LOGIC')) {
    fs.appendFileSync(jsPath, updatedJs);
    console.log('Connect button logic appended.');
}
