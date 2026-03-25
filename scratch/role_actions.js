const fs = require('fs');
const path = require('path');

const jsFile = 'e:/Tableau/project/alumni_platform/mobile/mobile-app.js';
let js = fs.readFileSync(jsFile, 'utf8');

// The logic to add role-specific quick actions:
const updateJs = `
// ==========================================
// ROLE-SPECIFIC QUICK ACTIONS
// ==========================================
const renderQuickActions = () => {
    const actionGrid = document.querySelector('.action-grid');
    if (!actionGrid) return;
    
    let html = '';
    
    if (currentRole === 'alumni') {
        html = \`
            <button class="action-card" onclick="showScreen('directory')">
              <div class="action-icon">📋</div>
              <div class="action-label">Directory</div>
            </button>
            <button class="action-card" onclick="showScreen('jobs')">
              <div class="action-icon">💼</div>
              <div class="action-label">Post/Find Jobs</div>
            </button>
            <button class="action-card" onclick="showScreen('mentorship')">
              <div class="action-icon">🎓</div>
              <div class="action-label">Mentorship</div>
            </button>
            <button class="action-card" onclick="showScreen('events')">
              <div class="action-icon">📅</div>
              <div class="action-label">Events</div>
            </button>
            <button class="action-card" onclick="showScreen('donations')">
              <div class="action-icon">❤️</div>
              <div class="action-label">Donate</div>
            </button>
        \`;
    } 
    else if (currentRole === 'student') {
        html = \`
            <button class="action-card" onclick="showScreen('directory')">
              <div class="action-icon">📋</div>
              <div class="action-label">Alumni</div>
            </button>
            <button class="action-card" onclick="showScreen('jobs')">
              <div class="action-icon">💼</div>
              <div class="action-label">Internships</div>
            </button>
            <button class="action-card" onclick="showScreen('mentorship')">
              <div class="action-icon">🤖</div>
              <div class="action-label">Find Mentor</div>
            </button>
            <button class="action-card" onclick="showScreen('events')">
              <div class="action-icon">📅</div>
              <div class="action-label">Workshops</div>
            </button>
        \`;
    }
    else if (currentRole === 'admin') {
        html = \`
            <button class="action-card" onclick="showScreen('admin')">
              <div class="action-icon">⚙️</div>
              <div class="action-label">Admin Panel</div>
            </button>
            <button class="action-card" onclick="showScreen('events')">
              <div class="action-icon">📅</div>
              <div class="action-label">Manage Events</div>
            </button>
            <button class="action-card" onclick="showScreen('directory')">
              <div class="action-icon">👥</div>
              <div class="action-label">All Users</div>
            </button>
            <button class="action-card" onclick="showScreen('donations')">
              <div class="action-icon">📈</div>
              <div class="action-label">Funds</div>
            </button>
        \`;
    }
    
    actionGrid.innerHTML = html;
};

// Hook it into the login process
const originalLoginForActions = loginUser;
loginUser = function() {
    if (typeof originalLoginForActions === 'function') originalLoginForActions();
    renderQuickActions();
};
`;

if (!js.includes('renderQuickActions')) {
    fs.appendFileSync(jsFile, updateJs);
    console.log('Role-specific quick actions added successfully.');
}
