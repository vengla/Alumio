const fs = require('fs');

const htmlPath = 'e:/Tableau/project/alumni_platform/mobile/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Extract the entire admin-donors-section block from wherever it currently is
const donorSectionRegex = /\s*<!-- Admin Only: Donor List[^<]*-->\s*<div id="admin-donors-section"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\n/;
const match = html.match(donorSectionRegex);

if (!match) {
    console.error('Could not find admin-donors-section block!');
    process.exit(1);
}

const donorSectionHtml = match[0];
console.log('Found admin-donors-section block, length:', donorSectionHtml.length);

// 2. Remove it from its current (wrong) location
html = html.replace(donorSectionRegex, '\n');

// 3. Re-insert it into the RIGHT place: inside #donations .mobile-content, just before the main event-list
const donationsInsertTarget = `<div class="mobile-content">
          <div class="info-banner"
            style="background: linear-gradient(135deg, #fef08a 0%, #fef9c3 100%); border-color: var(--accent);">`;

const donorDonationsHtml = `<div class="mobile-content">
          <!-- Admin Only: Donor List & Timeline -->
          <div id="admin-donors-section" style="display: none; margin-top: 10px;">
            <div class="section-header">
              <h3 style="color: var(--primary);">📊 Recent Donations</h3>
            </div>
            <div class="alumni-list" style="margin-bottom: 15px;">

              <div class="alumni-card" style="border-left: 4px solid var(--accent); position: relative;">
                <div class="alumni-avatar" style="background: var(--bg-surface); color: var(--text-main); font-weight: bold; border: 2px solid var(--accent); font-size: 0.75rem;">₹1L</div>
                <div class="alumni-info">
                  <div class="alumni-name">Michael Chang</div>
                  <div class="alumni-role" style="font-size: 0.8rem; color: var(--text-muted);">Alumni • Class of '10</div>
                  <div class="alumni-meta" style="color: var(--text-main); font-size: 0.75rem; font-weight: 500;">Scholarship Fund</div>
                </div>
                <span style="font-size: 0.7rem; color: var(--text-muted); position: absolute; top: 10px; right: 10px;">Today, 10:30 AM</span>
              </div>

              <div class="alumni-card" style="border-left: 4px solid var(--accent); position: relative;">
                <div class="alumni-avatar" style="background: var(--bg-surface); color: var(--text-main); font-weight: bold; border: 2px solid var(--accent); font-size: 0.75rem;">₹50k</div>
                <div class="alumni-info">
                  <div class="alumni-name">Anita Patel</div>
                  <div class="alumni-role" style="font-size: 0.8rem; color: var(--text-muted);">Alumni • Class of '15</div>
                  <div class="alumni-meta" style="color: var(--text-main); font-size: 0.75rem; font-weight: 500;">General Endowment</div>
                </div>
                <span style="font-size: 0.7rem; color: var(--text-muted); position: absolute; top: 10px; right: 10px;">Yesterday</span>
              </div>

              <div class="alumni-card" style="border-left: 4px solid var(--accent); position: relative;">
                <div class="alumni-avatar" style="background: var(--bg-surface); color: var(--text-main); font-weight: bold; border: 2px solid var(--accent); font-size: 0.75rem;">₹10k</div>
                <div class="alumni-info">
                  <div class="alumni-name">Rajesh Kumar</div>
                  <div class="alumni-role" style="font-size: 0.8rem; color: var(--text-muted);">Senior SDE @ Google</div>
                  <div class="alumni-meta" style="color: var(--text-main); font-size: 0.75rem; font-weight: 500;">Scholarship Fund</div>
                </div>
                <span style="font-size: 0.7rem; color: var(--text-muted); position: absolute; top: 10px; right: 10px;">2 days ago</span>
              </div>

              <div class="alumni-card" style="border-left: 4px solid var(--accent); position: relative;">
                <div class="alumni-avatar" style="background: var(--bg-surface); color: var(--text-main); font-weight: bold; border: 2px solid var(--accent); font-size: 0.75rem;">₹5L</div>
                <div class="alumni-info">
                  <div class="alumni-name">Vikram Singh</div>
                  <div class="alumni-role" style="font-size: 0.8rem; color: var(--text-muted);">CEO @ TechCorp • Class of '98</div>
                  <div class="alumni-meta" style="color: var(--text-main); font-size: 0.75rem; font-weight: 500;">Infrastructure Fund</div>
                </div>
                <span style="font-size: 0.7rem; color: var(--text-muted); position: absolute; top: 10px; right: 10px;">3 days ago</span>
              </div>

              <div class="alumni-card" style="border-left: 4px solid var(--accent); position: relative;">
                <div class="alumni-avatar" style="background: var(--bg-surface); color: var(--text-main); font-weight: bold; border: 2px solid var(--accent); font-size: 0.75rem;">₹25k</div>
                <div class="alumni-info">
                  <div class="alumni-name">Priya Sharma</div>
                  <div class="alumni-role" style="font-size: 0.8rem; color: var(--text-muted);">Product Manager @ Microsoft</div>
                  <div class="alumni-meta" style="color: var(--text-main); font-size: 0.75rem; font-weight: 500;">General Endowment</div>
                </div>
                <span style="font-size: 0.7rem; color: var(--text-muted); position: absolute; top: 10px; right: 10px;">4 days ago</span>
              </div>

              <div class="alumni-card" style="border-left: 4px solid var(--accent); position: relative;">
                <div class="alumni-avatar" style="background: var(--bg-surface); color: var(--text-main); font-weight: bold; border: 2px solid var(--accent); font-size: 0.75rem;">₹2L</div>
                <div class="alumni-info">
                  <div class="alumni-name">Sneha Reddy</div>
                  <div class="alumni-role" style="font-size: 0.8rem; color: var(--text-muted);">Data Scientist @ Amazon</div>
                  <div class="alumni-meta" style="color: var(--text-main); font-size: 0.75rem; font-weight: 500;">Scholarship Fund</div>
                </div>
                <span style="font-size: 0.7rem; color: var(--text-muted); position: absolute; top: 10px; right: 10px;">5 days ago</span>
              </div>

            </div>
            <div style="background: var(--bg-subtle); border-radius: 8px; padding: 10px 14px; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 15px; border: 1px solid var(--border-light);">
              💰 <strong>Total Collected:</strong> ₹8.9L this week &nbsp;|&nbsp; 6 donors
            </div>
          </div>

          <div class="info-banner"
            style="background: linear-gradient(135deg, #fef08a 0%, #fef9c3 100%); border-color: var(--accent);">`;

// Find the donations screen mobile-content and inject
const donationsContentIndex = html.indexOf('<div class="screen-view" id="donations"');
if (donationsContentIndex === -1) { console.error('Could not find donations screen!'); process.exit(1); }

const donationsContentStart = html.indexOf('<div class="mobile-content">', donationsContentIndex);
const donationsContentEnd = html.indexOf('</div>', donationsContentStart) + 6;

// Replace first <div class="mobile-content"> inside donations screen
html = html.substring(0, donationsContentStart) + donorDonationsHtml + html.substring(donationsContentStart + '<div class="mobile-content">'.length);

fs.writeFileSync(htmlPath, html);
console.log('admin-donors-section successfully moved into the #donations screen!');
