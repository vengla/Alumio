const fs = require('fs');
const path = require('path');

const jsPath = 'e:/Tableau/project/alumni_platform/mobile/mobile-app.js';
let js = fs.readFileSync(jsPath, 'utf8');

const updatedJs = `
// ==========================================
// 🏢 ADMIN JOBS & MENTORSHIP VIEW
// ==========================================

const originalLoginForAdminJobs = loginUser;
loginUser = function() {
    if (typeof originalLoginForAdminJobs === 'function') originalLoginForAdminJobs();
    
    if (currentRole === 'admin') {
        // Unhide Job Apply buttons and change them
        const jobCards = document.querySelectorAll('.job-card');
        jobCards.forEach(card => {
            const btn = card.querySelector('.btn-apply');
            if (btn) {
                btn.style.display = 'block'; 
                btn.textContent = 'View Applicants';
                btn.style.background = '#475569'; // distinctive gray-blue color
                btn.style.pointerEvents = 'auto'; // ensure clickable
                
                btn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const title = card.querySelector('.job-title').textContent + ' (Applicants)';
                    showAdminRegistrations(title);
                };
            }
        });

        // Unhide Mentor Request buttons and change them
        const mentorCards = document.querySelectorAll('.mentor-card');
        mentorCards.forEach(card => {
            const btn = card.querySelector('.btn-request');
            if (btn) {
                btn.style.display = 'block'; 
                btn.textContent = 'View Requests';
                btn.style.background = '#475569'; 
                btn.style.pointerEvents = 'auto'; // ensure clickable
                
                btn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const title = card.querySelector('.mentor-name').textContent + ' (Requests)';
                    showAdminRegistrations(title);
                };
            }
        });

        // Ensure Event Register buttons are visible and clickable for Admin
        const eventCards = document.querySelectorAll('.event-card');
        eventCards.forEach(card => {
            const btn = card.querySelector('.btn-register');
            if(btn && !btn.textContent.includes('Donate')) {
                btn.style.display = 'block'; 
                btn.textContent = 'View Registrations';
                btn.style.background = '#475569'; 
                btn.style.pointerEvents = 'auto'; // ensure clickable
                
                btn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation(); 
                    const title = card.querySelector('.event-title').textContent + ' (Registrations)';
                    showAdminRegistrations(title);
                };
            }
        });
    }
};

// Update Modal dynamically to handle different entities gracefully
const _originalShowAdminReg = showAdminRegistrations;
showAdminRegistrations = function(title) {
    _originalShowAdminReg(title);
    
    // Modify modal title header slightly to reflect it's not JUST events anymore
    const regModalHeading = document.getElementById('reg-event-title');
    if(regModalHeading) {
        // Change from 'Event Registrations' to dynamic
        if(title.includes('Applicants')) {
             regModalHeading.innerHTML = '👩‍💻 ' + title;
        } else if (title.includes('Requests')) {
             regModalHeading.innerHTML = '🤝 ' + title;
        } else {
             regModalHeading.innerHTML = '🎟️ ' + title;
        }
    }
};
`;

if (!js.includes('ADMIN JOBS & MENTORSHIP VIEW')) {
    fs.appendFileSync(jsPath, updatedJs);
    console.log('Admin jobs/mentorship view attached.');
}
