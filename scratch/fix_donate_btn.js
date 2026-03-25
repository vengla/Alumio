const fs = require('fs');

const file = 'e:/Tableau/project/alumni_platform/mobile/index.html';
let html = fs.readFileSync(file, 'utf8');

// Replace the Donate Now button classes in both Dashboard and Donations screens
html = html.replace(/<button class="btn-register" style="background: var\(--accent\); color: #000;" \n\s*onclick="handleDonation\(this, 'Scholarship Fund'\)">Donate Now<\/button>/g, '<button style="background: var(--accent); color: #000; padding:10px; width:100%; border:none; border-radius:10px; font-weight:bold; cursor:pointer;" onclick="handleDonation(this, \'Scholarship Fund\')">Donate Now</button>');

html = html.replace(/<button class="btn-register" style="background: var\(--accent\); color: #000;"\s*onclick="handleDonation\(this, 'Scholarship Fund'\)">Donate Now<\/button>/g, '<button style="background: var(--accent); color: #000; padding:10px; width:100%; border:none; border-radius:10px; font-weight:bold; cursor:pointer;" onclick="handleDonation(this, \'Scholarship Fund\')">Donate Now</button>');

fs.writeFileSync(file, html);
console.log('index.html Donate Now button updated to avoid btn-register class overlapping.');
