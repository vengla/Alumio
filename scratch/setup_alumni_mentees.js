const fs = require('fs');

const htmlPath = 'e:/Tableau/project/alumni_platform/mobile/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const myMenteesHtml = `
      <!-- My Mentees Screen -->
      <div class="screen-view" id="my-mentees" style="display: none;">
        <div class="mobile-header">
          <button class="back-btn" onclick="showScreen('dashboard')">←</button>
          <h2>My Mentees</h2>
        </div>
        <div class="mobile-content">
          <div class="info-banner" style="background: rgba(46, 204, 113, 0.1); border-color: var(--success);">
            <div class="banner-icon">🎯</div>
            <div class="banner-content">
              <div class="banner-title">Active Engagements</div>
              <div class="banner-text" style="color: var(--text-muted); font-size: 0.8rem;">You are currently mentoring 2 students</div>
            </div>
          </div>
          
          <div class="alumni-list" style="margin-top: 15px;">
            <div class="alumni-card" style="border-left: 4px solid var(--success);">
              <div class="alumni-avatar" style="background: var(--success); color: white;">SD</div>
              <div class="alumni-info">
                <div class="alumni-name">Sara Davis</div>
                <div class="alumni-role" style="font-size: 0.8rem; color: var(--text-muted);">CS Junior • Class of '26</div>
                <div class="alumni-meta" style="color: var(--primary); font-size: 0.75rem;">Goal: SDE Interview Prep</div>
              </div>
              <button class="btn-connect" style="background: var(--primary); padding: 5px 10px; font-size: 0.8rem;" onclick="window.location.href='mailto:sara@demo.com'">Message</button>
            </div>

            <div class="alumni-card" style="border-left: 4px solid var(--success);">
              <div class="alumni-avatar" style="background: var(--success); color: white;">MP</div>
              <div class="alumni-info">
                <div class="alumni-name">Mike Patel</div>
                <div class="alumni-role" style="font-size: 0.8rem; color: var(--text-muted);">EE Senior • Class of '25</div>
                <div class="alumni-meta" style="color: var(--primary); font-size: 0.75rem;">Goal: Hardware Portfolio</div>
              </div>
              <button class="btn-connect" style="background: var(--primary); padding: 5px 10px; font-size: 0.8rem;" onclick="window.location.href='mailto:mike@demo.com'">Message</button>
            </div>
          </div>
        </div>
        
        <div class="bottom-nav">
          <button class="nav-btn" onclick="showScreen('dashboard')"><span class="nav-icon">🏠</span><span class="nav-label">Home</span></button>
          <button class="nav-btn" onclick="showScreen('directory')"><span class="nav-icon">👥</span><span class="nav-label">Directory</span></button>
          <button class="nav-btn" onclick="showScreen('jobs')"><span class="nav-icon">💼</span><span class="nav-label">Jobs</span></button>
          <button class="nav-btn" onclick="showScreen('profile')"><span class="nav-icon">⚙️</span><span class="nav-label">Settings</span></button>
        </div>
      </div>
`;

if (!html.includes('id="my-mentees"')) {
    html = html.replace('<!-- Events Screen -->', myMenteesHtml + '\n      <!-- Events Screen -->');
    fs.writeFileSync(htmlPath, html);
    console.log('Added My Mentees screen to HTML.');
}

const jsPath = 'e:/Tableau/project/alumni_platform/mobile/mobile-app.js';
let js = fs.readFileSync(jsPath, 'utf8');

// Replace the renderQuickActions function to include "My Mentees" for alumni
const newBtn = `            <button class="action-card" onclick="showScreen('my-mentees')">
              <div class="action-icon">🎯</div>
              <div class="action-label">My Mentees</div>
            </button>`;

if (js.includes('<div class="action-label">Donate</div>\n            </button>\n        `;')) {
    js = js.replace('<div class="action-label">Donate</div>\n            </button>\n        `;', '<div class="action-label">Donate</div>\n            </button>\n' + newBtn + '\n        `;');
    fs.writeFileSync(jsPath, js);
    console.log('Added My Mentees to Alumni Quick Actions.');
}

