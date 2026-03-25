const fs = require('fs');
const path = require('path');

const mobileDir = 'e:/Tableau/project/alumni_platform/mobile';
const htmlPath = path.join(mobileDir, 'index.html');

let html = fs.readFileSync(htmlPath, 'utf8');

const targetRegex = /<div class="input-group">[\s\S]*?<label>Full Name<\/label>[\s\S]*?<input type="text" value="John Alumnus">[\s\S]*?<\/div>[\s\S]*?<div class="input-group">[\s\S]*?<label>Current Company<\/label>[\s\S]*?<input type="text" value="Tech Corp">[\s\S]*?<\/div>/m;

const newProfileContent = `<div class="section-header" style="margin-top: -10px;">
            <h3>Basic Details</h3>
          </div>
          <div class="input-group">
            <label>Full Name</label>
            <input type="text" value="John Alumnus">
          </div>
          <div class="input-group">
            <label>Email Address</label>
            <input type="email" value="alumni@edu.in">
          </div>
          <div class="input-group">
            <label>Mobile Number</label>
            <input type="tel" value="+91 98765 43210">
          </div>
          <div class="input-group">
            <label>Batch & Department</label>
            <input type="text" value="2018 - Computer Science" disabled style="background: var(--bg-subtle);">
          </div>
          
          <div class="section-header" style="margin-top: 1.5rem;">
            <h3>Professional</h3>
          </div>
          <div class="input-group">
            <label>Current Company</label>
            <input type="text" value="Tech Corp">
          </div>
          <div class="input-group">
            <label>LinkedIn URL</label>
            <input type="url" value="https://linkedin.com/in/johnalumnus">
          </div>
          
          <div class="section-header" style="margin-top: 1.5rem;">
            <h3>App Settings</h3>
          </div>
          <div style="background: var(--bg-surface); padding: 15px; border-radius: var(--radius); margin-bottom: 1.5rem; border: 1px solid var(--border-light); font-size: 0.9rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid var(--bg-subtle); padding-bottom: 8px;">
              <span><strong>Push Notifications</strong><br><span class="text-muted" style="font-size: 0.75rem;">Get alerted for messages</span></span>
              <input type="checkbox" checked style="width: 20px; height: 20px; accent-color: var(--primary);">
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid var(--bg-subtle); padding-bottom: 8px;">
              <span><strong>Email Digest</strong><br><span class="text-muted" style="font-size: 0.75rem;">Weekly networking recap</span></span>
              <input type="checkbox" checked style="width: 20px; height: 20px; accent-color: var(--primary);">
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span><strong>Profile Visibility</strong><br><span class="text-muted" style="font-size: 0.75rem;">Who can search for you</span></span>
              <select style="padding: 5px; border: 1px solid var(--border-light); border-radius: 5px; outline: none;">
                <option>Public</option>
                <option>Alumni Only</option>
                <option>Hidden</option>
              </select>
            </div>
          </div>`;

if (targetRegex.test(html)) {
    html = html.replace(targetRegex, newProfileContent);
    fs.writeFileSync(htmlPath, html);
    console.log('Profile settings updated successfully.');
} else {
    // Fallback if formatting was slightly different
    console.log('Regex missed, checking alternative replacement.');
}
