const fs = require('fs');

const htmlPath = 'e:/Tableau/project/alumni_platform/mobile/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const myMentorsHtml = `
          <!-- Students Only: My Active Mentors -->
          <div id="student-mentors-section" style="display: none;">
            <div class="section-header" style="margin-top: 10px;">
              <h3 style="color: var(--primary);">👨‍🏫 My Active Mentors</h3>
            </div>
            <div class="alumni-list" style="margin-bottom: 20px;">
              <div class="alumni-card" style="border: 2px solid var(--primary); background: rgba(0, 100, 255, 0.02);">
                <div class="alumni-avatar" style="background: linear-gradient(135deg, var(--primary), var(--accent));">AD</div>
                <div class="alumni-info">
                  <div class="alumni-name">Arjun Das</div>
                  <div class="alumni-role">VP Engineering @ StartupInc</div>
                  <div class="alumni-meta" style="color: var(--success); font-weight: bold;">Active Session • 2 hrs left</div>
                </div>
                <button class="btn-connect" style="background: var(--primary);" onclick="window.location.href='mailto:arjun@demo.com'">Message</button>
              </div>
            </div>
            
            <div class="section-header">
              <h3>Discover Mentors</h3>
            </div>
          </div>
`;

if (!html.includes('student-mentors-section')) {
    html = html.replace('<!-- Mentor List -->', myMentorsHtml + '\n          <!-- Mentor List -->');
    fs.writeFileSync(htmlPath, html);
    console.log('Added Student Mentors section to HTML.');
}


const jsPath = 'e:/Tableau/project/alumni_platform/mobile/mobile-app.js';
let js = fs.readFileSync(jsPath, 'utf8');

const studentMentorFixJs = `
// ==========================================
// 🎓 STUDENT MENTOR VIEW LOGIC
// ==========================================
const originalLoginForStudentMentors = loginUser;
loginUser = function() {
    if (typeof originalLoginForStudentMentors === 'function') originalLoginForStudentMentors();
    
    const studentMentorsSec = document.getElementById('student-mentors-section');
    if (studentMentorsSec) {
        if (currentRole === 'student') {
            studentMentorsSec.style.display = 'block';
        } else {
            studentMentorsSec.style.display = 'none';
        }
    }
};
`;

if (!js.includes('STUDENT MENTOR VIEW LOGIC')) {
    fs.appendFileSync(jsPath, studentMentorFixJs);
    console.log('Added logic to toggle Student Mentors view.');
}
