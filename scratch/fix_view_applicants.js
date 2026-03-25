const fs = require('fs');

const htmlPath = 'e:/Tableau/project/alumni_platform/mobile/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Remove admin-registrations-modal from inside phone-screen
const modalRegex = /\s*<div id="admin-registrations-modal"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\n/;
const match = html.match(modalRegex);
if (!match) {
    console.error('Could not find admin-registrations-modal in HTML!');
    process.exit(1);
}
const oldModal = match[0];
html = html.replace(modalRegex, '\n');

// 2. Inject a brand new modal with richer applicant data — right before </body>
const newModal = `
    <!-- Admin: View Applicants / Registrations Modal (outside phone-screen to avoid clipping) -->
    <div id="admin-registrations-modal"
      style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 3000; justify-content: center; align-items: center;">
      <div
        style="background: white; width: 88%; max-height: 78%; padding: 20px; border-radius: 20px; box-shadow: 0 10px 50px rgba(0,0,0,0.3); display: flex; flex-direction: column;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); padding-bottom: 10px; margin-bottom: 15px;">
          <h3 id="reg-event-title" style="margin: 0; color: var(--primary); font-size: 1rem; max-width: 80%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Applicants</h3>
          <button onclick="document.getElementById('admin-registrations-modal').style.display='none'"
            style="background: none; border: none; font-size: 1.3rem; cursor: pointer; color: var(--danger);">✕</button>
        </div>

        <div id="admin-modal-body" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;"></div>

        <button class="btn-primary" style="margin-top: 15px; padding: 10px;" onclick="alert('Exporting to Excel/CSV...')">📥 Export Data</button>
      </div>
    </div>
`;

html = html.replace('</body>', newModal + '\n</body>');
fs.writeFileSync(htmlPath, html);
console.log('Replaced admin-registrations-modal with enhanced version outside phone-screen.');


const jsPath = 'e:/Tableau/project/alumni_platform/mobile/mobile-app.js';
let js = fs.readFileSync(jsPath, 'utf8');

const applicantsJs = `
// ==========================================
// 📋 VIEW APPLICANTS DATA LOGIC
// ==========================================

const applicantsDb = {
    default: [
        { initials: 'JD', name: 'John Doe', meta: 'CS \'22 • Applied 2h ago', status: 'Under Review', statusColor: 'var(--warning)' },
        { initials: 'PS', name: 'Priya Sharma', meta: 'EE \'17 • Applied 1d ago', status: 'Shortlisted', statusColor: 'var(--success)' },
        { initials: 'RK', name: 'Rahul Kapoor', meta: 'CS \'20 • Applied 2d ago', status: 'Under Review', statusColor: 'var(--warning)' },
        { initials: 'AN', name: 'Anjali Nair', meta: 'IT \'21 • Applied 3d ago', status: 'Rejected', statusColor: 'var(--danger)' },
        { initials: 'SM', name: 'Siddharth More', meta: 'ME \'23 • Applied 4d ago', status: 'Under Review', statusColor: 'var(--warning)' },
    ],
    'Senior Software Engineer': [
        { initials: 'AK', name: 'Aryan Kumar', meta: 'CS \'21 • 3 YOE • Applied Today', status: 'Shortlisted', statusColor: 'var(--success)' },
        { initials: 'NS', name: 'Neha Singh', meta: 'CS \'20 • 4 YOE • Applied Yesterday', status: 'Under Review', statusColor: 'var(--warning)' },
        { initials: 'VP', name: 'Vikas Pandey', meta: 'CE \'22 • 2 YOE • Applied 2d ago', status: 'Shortlisted', statusColor: 'var(--success)' },
        { initials: 'RJ', name: 'Ritu Jain', meta: 'IT \'19 • 5 YOE • Applied 3d ago', status: 'Under Review', statusColor: 'var(--warning)' },
        { initials: 'MD', name: 'Manish Desai', meta: 'CS \'18 • 6 YOE • Applied 4d ago', status: 'Rejected', statusColor: 'var(--danger)' },
    ],
    'Product Manager': [
        { initials: 'PK', name: 'Pooja Krishnan', meta: 'MBA \'20 • 3 YOE • Applied Today', status: 'Shortlisted', statusColor: 'var(--success)' },
        { initials: 'AS', name: 'Arjun Shah', meta: 'CS \'19 • 5 YOE • Applied Yesterday', status: 'Under Review', statusColor: 'var(--warning)' },
        { initials: 'DM', name: 'Deepika Menon', meta: 'EE \'21 • 3 YOE • Applied 2d ago', status: 'Under Review', statusColor: 'var(--warning)' },
    ],
    'Data Scientist Intern': [
        { initials: 'KP', name: 'Karan Patel', meta: 'CS \'25 (Final Year) • Applied Today', status: 'Under Review', statusColor: 'var(--warning)' },
        { initials: 'SA', name: 'Shreya Agarwal', meta: 'DS \'25 (Final Year) • Applied Yesterday', status: 'Shortlisted', statusColor: 'var(--success)' },
        { initials: 'TN', name: 'Tejas Naik', meta: 'CS \'26 (3rd Year) • Applied 2d ago', status: 'Under Review', statusColor: 'var(--warning)' },
        { initials: 'PM', name: 'Preethi Mohan', meta: 'IT \'25 (Final Year) • Applied 3d ago', status: 'Rejected', statusColor: 'var(--danger)' },
    ]
};

const _enhancedShowAdminReg = showAdminRegistrations;
showAdminRegistrations = function(title) {
    // Set modal title
    const titleEl = document.getElementById('reg-event-title');
    const bodyEl = document.getElementById('admin-modal-body');
    
    if (!titleEl || !bodyEl) {
        _enhancedShowAdminReg(title);
        return;
    }

    // Build contextual title
    let icon = '🎟️';
    if (title.toLowerCase().includes('job') || title.toLowerCase().includes('engineer') || title.toLowerCase().includes('manager') || title.toLowerCase().includes('intern') || title.toLowerCase().includes('scientist') || title.toLowerCase().includes('applicants')) {
        icon = '💼';
    } else if (title.toLowerCase().includes('mentor') || title.toLowerCase().includes('request')) {
        icon = '🤝';
    }
    titleEl.innerHTML = icon + ' ' + title;
    
    // Choose applicant data
    let applicants = applicantsDb[title] || applicantsDb['default'];
    
    // Build applicant rows
    bodyEl.innerHTML = applicants.map(a => \`
        <div style="display: flex; align-items: center; gap: 12px; padding: 10px; background: var(--bg-surface); border-radius: 12px; border: 1px solid var(--border-light);">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), #0055ff); color: white; font-weight: bold; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                \${a.initials}
            </div>
            <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-main);">\${a.name}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">\${a.meta}</div>
            </div>
            <span style="font-size: 0.7rem; font-weight: 600; color: white; background: \${a.statusColor}; padding: 3px 8px; border-radius: 20px; white-space: nowrap; flex-shrink: 0;">\${a.status}</span>
        </div>
    \`).join('');

    // Also add a summary line
    const shortlisted = applicants.filter(a => a.status === 'Shortlisted').length;
    const summary = document.createElement('div');
    summary.style.cssText = 'font-size: 0.8rem; color: var(--text-muted); padding: 8px 12px; background: var(--bg-subtle); border-radius: 8px; margin-top: 5px; border: 1px solid var(--border-light);';
    summary.innerHTML = \`📊 <strong>\${applicants.length}</strong> total applicants &nbsp;|&nbsp; <strong style="color: var(--success);">\${shortlisted} shortlisted</strong>\`;
    bodyEl.appendChild(summary);

    document.getElementById('admin-registrations-modal').style.display = 'flex';
};
`;

if (!js.includes('VIEW APPLICANTS DATA LOGIC')) {
    fs.appendFileSync(jsPath, '\n' + applicantsJs);
    console.log('Appended View Applicants data logic to JS.');
}
