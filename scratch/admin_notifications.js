const fs = require('fs');
const path = require('path');

const mobileDir = 'e:/Tableau/project/alumni_platform/mobile';
const htmlPath = path.join(mobileDir, 'index.html');
const jsPath = path.join(mobileDir, 'mobile-app.js');

// 1. UPDATE HTML - Inject Notifications Screen
let html = fs.readFileSync(htmlPath, 'utf8');

const notifHtml = `
      <!-- Notifications Screen -->
      <div class="screen-view" id="notifications" style="display: none;">
        <div class="mobile-header">
          <button class="back-btn" onclick="showScreen('dashboard')">←</button>
          <h2 id="notif-header-title">Notifications</h2>
        </div>
        <div class="mobile-content" id="notif-content">
          <!-- Dynamically populated based on role -->
        </div>
        <div class="bottom-nav">
          <button class="nav-btn" onclick="showScreen('dashboard')"><span class="nav-icon">🏠</span><span class="nav-label">Home</span></button>
          <button class="nav-btn" onclick="showScreen('directory')"><span class="nav-icon">👥</span><span class="nav-label">Directory</span></button>
          <button class="nav-btn" onclick="showScreen('jobs')"><span class="nav-icon">💼</span><span class="nav-label">Jobs</span></button>
          <button class="nav-btn" onclick="showScreen('profile')"><span class="nav-icon">⚙️</span><span class="nav-label">Profile</span></button>
        </div>
      </div>
`;

if (!html.includes('id="notifications"')) {
    html = html.replace('<!-- Chatbot UI -->', notifHtml + '\n  <!-- Chatbot UI -->');
    html = html.replace('<button class="icon-btn">🔔</button>', '<button class="icon-btn" onclick="showScreen(\'notifications\')">🔔</button>');
    fs.writeFileSync(htmlPath, html);
    console.log('HTML updated with Notifications screen.');
}

// 2. UPDATE JS - Populate Notifications based on Role
let js = fs.readFileSync(jsPath, 'utf8');

const notifJs = `
// ==========================================
// 🔔 DYNAMIC NOTIFICATIONS
// ==========================================

const originalShowScreenForNotif = showScreen;
showScreen = function(id) {
    if (typeof originalShowScreenForNotif === 'function') originalShowScreenForNotif(id);
    
    if (id === 'notifications') {
        const content = document.getElementById('notif-content');
        const header = document.getElementById('notif-header-title');
        
        let notifs = [];
        
        if (currentRole === 'admin') {
            header.textContent = 'System Activity (Admin)';
            notifs = [
                { icon: '⚠️', title: 'New User Registration', desc: 'John Doe (CS 22) requires verification.', time: '10 mins ago', color: 'var(--warning)' },
                { icon: '💰', title: 'Donation Received', desc: '₹15,000 received for Scholarship Fund.', time: '1 hour ago', color: 'var(--success)' },
                { icon: '💼', title: 'Job Posted', desc: 'Senior SDE at Google posted by Rajesh Kumar.', time: '3 hours ago', color: 'var(--primary)' },
                { icon: '🎫', title: 'Event Registration', desc: '45 new registrations for Alumni Meet 2026.', time: '5 hours ago', color: 'var(--accent)' },
                { icon: '🚨', title: 'System Alert', desc: 'Database backup completed successfully.', time: '1 day ago', color: 'var(--text-muted)' },
                { icon: '🤝', title: 'Mentorship Matched', desc: 'Priya Sharma accepted Jane Student request.', time: '1 day ago', color: 'var(--primary)' }
            ];
        } else {
            header.textContent = 'Your Notifications';
            notifs = [
                { icon: '🔔', title: 'Welcome!', desc: 'Welcome to Alumni Connect.', time: 'Just now', color: 'var(--primary)' },
                { icon: '📅', title: 'Event Reminder', desc: 'Tech Talk starts tomorrow!', time: '2 hours ago', color: 'var(--accent)' },
                { icon: '💼', title: 'Job Alert', desc: 'New Software Engineer role matches your profile.', time: '1 day ago', color: 'var(--success)' }
            ];
        }
        
        let htmlStr = '<div class="activity-list">';
        notifs.forEach(n => {
            htmlStr += \`
            <div class="activity-item" style="box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 12px; border: 1px solid rgba(0,0,0,0.05);">
              <div class="activity-icon" style="background: \${n.color}; color: white;">\${n.icon}</div>
              <div class="activity-content">
                <div class="activity-text" style="font-weight: 600;">\${n.title}</div>
                <div class="activity-text" style="font-size: 0.8rem; color: var(--text-muted);">\${n.desc}</div>
                <div class="activity-time" style="margin-top: 4px;">\${n.time}</div>
              </div>
            </div>
            \`;
        });
        htmlStr += '</div>';
        
        content.innerHTML = htmlStr;
    }
};
`;

if (!js.includes('DYNAMIC NOTIFICATIONS')) {
    fs.appendFileSync(jsPath, notifJs);
    console.log('JS updated with dynamic notifications logic.');
}

