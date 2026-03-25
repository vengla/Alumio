const fs = require('fs');

const htmlPath = 'e:/Tableau/project/alumni_platform/mobile/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const postJobHtml = `
      <!-- Post a Job Modal -->
      <div id="post-job-modal"
        style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 2000; justify-content: center; align-items: center;">
        <div
          style="background: white; width: 85%; padding: 20px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid var(--border-light); padding-bottom: 10px;">
            <h3 style="margin: 0; color: var(--text-main);">📝 Post a Job/Internship</h3>
            <button onclick="document.getElementById('post-job-modal').style.display='none'"
              style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--danger);">✕</button>
          </div>
          
          <div class="input-group" style="margin-bottom: 15px;">
            <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 5px; display: block;">Job Title</label>
            <input type="text" id="post-job-title" placeholder="e.g. Software Engineer" style="width: 100%; padding: 10px; border: 1px solid var(--border-light); border-radius: 8px; outline: none; background: var(--bg-surface); font-family: inherit;">
          </div>
          
          <div class="input-group" style="margin-bottom: 15px;">
            <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 5px; display: block;">Company Name</label>
            <input type="text" id="post-job-company" placeholder="e.g. Microsoft" style="width: 100%; padding: 10px; border: 1px solid var(--border-light); border-radius: 8px; outline: none; background: var(--bg-surface); font-family: inherit;">
          </div>
          
          <div class="input-group" style="display: flex; gap: 10px; margin-bottom: 15px;">
            <div style="flex: 1;">
              <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 5px; display: block;">Location</label>
              <input type="text" id="post-job-location" placeholder="e.g. Remote" style="width: 100%; padding: 10px; border: 1px solid var(--border-light); border-radius: 8px; outline: none; background: var(--bg-surface); font-family: inherit;">
            </div>
            <div style="flex: 1;">
              <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 5px; display: block;">Salary/Stipend</label>
              <input type="text" id="post-job-salary" placeholder="e.g. ₹20 LPA" style="width: 100%; padding: 10px; border: 1px solid var(--border-light); border-radius: 8px; outline: none; background: var(--bg-surface); font-family: inherit;">
            </div>
          </div>
          
          <div class="input-group" style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" id="post-job-referral" style="accent-color: var(--primary); width: 16px; height: 16px;">
            <label for="post-job-referral" style="font-size: 0.8rem; font-weight: 600; color: var(--text-main);">I can provide a referral for this role</label>
          </div>

          <button onclick="submitNewJob()" style="background: var(--primary); color: white; padding:12px; width:100%; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">Post Job</button>
        </div>
      </div>
`;

if (!html.includes('id="post-job-modal"')) {
    html = html.replace('<!-- Custom Modal Popup -->', postJobHtml + '\n      <!-- Custom Modal Popup -->');
    console.log('Post Job Modal injected into HTML.');
}

// Add the Post Job floating-like button inside the jobs portal header, hidden by default
const postJobBtnHtml = `
          <button id="post-job-btn" style="display: none; background: var(--primary); color: white; width: 100%; margin-bottom: 15px; padding: 12px; border: none; border-radius: 12px; font-weight: bold; font-size: 0.9rem; margin-top: 5px; cursor: pointer; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1);" onclick="document.getElementById('post-job-modal').style.display='flex'">
            + Post a New Job/Internship
          </button>
          <!-- Filter Chips -->`;

if (!html.includes('id="post-job-btn"')) {
    html = html.replace('<!-- Filter Chips -->', postJobBtnHtml);
    fs.writeFileSync(htmlPath, html);
    console.log('Post Job button added to Jobs screen.');
}

const jsPath = 'e:/Tableau/project/alumni_platform/mobile/mobile-app.js';
let js = fs.readFileSync(jsPath, 'utf8');

const postJobLogicJs = `
// ==========================================
// 💼 ALUMNI / ADMIN POST JOB LOGIC
// ==========================================
function submitNewJob() {
    const title = document.getElementById('post-job-title').value;
    const company = document.getElementById('post-job-company').value;
    const location = document.getElementById('post-job-location').value;
    const salary = document.getElementById('post-job-salary').value;
    const isReferral = document.getElementById('post-job-referral').checked;
    
    if(!title || !company || !location || !salary) {
        alert("Please fill in all details for the job post.");
        return;
    }
    
    // Close modal
    document.getElementById('post-job-modal').style.display = 'none';
    
    // Create new job card dynamically
    const jobList = document.querySelector('.job-list');
    const newCard = document.createElement('div');
    newCard.className = 'job-card';
    
    const referralHtml = isReferral ? '<div class="job-referral">✓ Referral</div>' : '';
    const nameStr = (currentRole === 'admin') ? 'Administrator' : 'You (Alumni)';
    const applyBtnHtml = (currentRole === 'admin') 
         ? '<button class="btn-apply" style="display: block; background: rgb(71, 85, 105); pointer-events: auto;">View Applicants</button>' 
         : '<button class="btn-apply" style="display: block;">View Applicants</button>';
         
    newCard.innerHTML = \`
      <div class="job-header">
        <div class="job-title">\${title}</div>
        \${referralHtml}
      </div>
      <div class="job-company">\${company}</div>
      <div class="job-meta">
        <span>📍 \${location}</span>
        <span>💰 \${salary}</span>
      </div>
      <div class="job-posted">Posted by \${nameStr} • Just now</div>
      \${applyBtnHtml}
    \`;
    
    // Append to top of list
    jobList.insertBefore(newCard, jobList.firstChild);
    
    // Clear the form
    document.getElementById('post-job-title').value = '';
    document.getElementById('post-job-company').value = '';
    document.getElementById('post-job-location').value = '';
    document.getElementById('post-job-salary').value = '';
    document.getElementById('post-job-referral').checked = false;
    
    // Re-bind the View Applicants logic if it's admin/alumni to view stats
    bindNormalButtonActions();
    
    // Show success popup
    const modal = document.getElementById('action-modal');
    document.getElementById('modal-icon').textContent = '✅';
    document.getElementById('modal-title').textContent = 'Job Posted!';
    document.getElementById('modal-desc').textContent = 'Your job listing is now live on the portal. Students will be able to apply and request referrals immediately.';
    modal.style.display = 'flex';
}

const originalLoginForPostJob = loginUser;
loginUser = function() {
    if (typeof originalLoginForPostJob === 'function') originalLoginForPostJob();
    
    const postJobBtn = document.getElementById('post-job-btn');
    if (postJobBtn) {
        if (currentRole === 'alumni' || currentRole === 'admin') {
            postJobBtn.style.display = 'block';
        } else {
            postJobBtn.style.display = 'none';
        }
    }
};
`;

if (!js.includes('ALUMNI / ADMIN POST JOB LOGIC')) {
    fs.appendFileSync(jsPath, "\n" + postJobLogicJs);
    console.log('Appended Post Job Logic to JS');
} else {
    console.log('Post job logic already attached.');
}
