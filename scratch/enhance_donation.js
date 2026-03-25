const fs = require('fs');
const path = require('path');

const htmlPath = 'e:/Tableau/project/alumni_platform/mobile/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const donateModalHtml = `
      <!-- Setup Donation Modal -->
      <div id="donate-modal"
        style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 2000; justify-content: center; align-items: center;">
        <div
          style="background: white; width: 85%; padding: 20px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid var(--border-light); padding-bottom: 10px;">
            <h3 style="margin: 0; color: var(--text-main);">Make a Donation</h3>
            <button onclick="document.getElementById('donate-modal').style.display='none'"
              style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--danger);">✕</button>
          </div>
          
          <div class="input-group" style="margin-bottom: 15px;">
            <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 5px; display: block;">Donation Category</label>
            <select id="donate-category" style="width: 100%; padding: 10px; border: 1px solid var(--border-light); border-radius: 8px; outline: none; background: var(--bg-surface); font-family: inherit;">
              <option value="Scholarship Fund">🎓 Scholarship Fund</option>
              <option value="Campus Development">🏢 Campus Development</option>
              <option value="Research & Innovation">🔬 Research & Innovation</option>
              <option value="General Support">❤️ General Support</option>
            </select>
          </div>
          
          <div class="input-group" style="margin-bottom: 15px;">
            <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 5px; display: block;">Amount (₹)</label>
            <input type="number" id="donate-amount" placeholder="e.g. 5000" style="width: 100%; padding: 10px; border: 1px solid var(--border-light); border-radius: 8px; outline: none; background: var(--bg-surface); font-family: inherit;">
            
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button style="flex: 1; padding: 5px; background: var(--bg-subtle); border: 1px solid var(--border-light); border-radius: 5px; cursor: pointer; font-family: inherit; font-size: 0.8rem;" onclick="document.getElementById('donate-amount').value = 1000">₹1,000</button>
                <button style="flex: 1; padding: 5px; background: var(--bg-subtle); border: 1px solid var(--border-light); border-radius: 5px; cursor: pointer; font-family: inherit; font-size: 0.8rem;" onclick="document.getElementById('donate-amount').value = 5000">₹5,000</button>
                <button style="flex: 1; padding: 5px; background: var(--bg-subtle); border: 1px solid var(--border-light); border-radius: 5px; cursor: pointer; font-family: inherit; font-size: 0.8rem;" onclick="document.getElementById('donate-amount').value = 10000">₹10,000</button>
            </div>
          </div>
          
          <button onclick="processDonation()" style="background: var(--accent); color: #000; padding:12px; width:100%; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">Proceed to Donate</button>
        </div>
      </div>
`;

if (!html.includes('id="donate-modal"')) {
    html = html.replace('<!-- Custom Modal Popup -->', donateModalHtml + '\n      <!-- Custom Modal Popup -->');
    fs.writeFileSync(htmlPath, html);
    console.log('Donation Details modal injected into HTML.');
}


const jsPath = 'e:/Tableau/project/alumni_platform/mobile/mobile-app.js';
let js = fs.readFileSync(jsPath, 'utf8');

const processDonateJs = `
// ==========================================
// 💳 ENHANCED DONATION LOGIC (Category & Amount)
// ==========================================
let activeDonationButton = null;

function handleDonation(btn, fundName) {
    if (currentRole === 'admin') return;
    
    // Remember the button that was clicked so we can change it later
    activeDonationButton = btn;
    
    // Set default category to whatever the card said (e.g., 'Scholarship Fund')
    const categorySelect = document.getElementById('donate-category');
    if (categorySelect) {
        for(let i=0; i<categorySelect.options.length; i++) {
            if(categorySelect.options[i].value === fundName) {
                categorySelect.selectedIndex = i;
                break;
            }
        }
    }
    
    // Reset amount
    const amountInput = document.getElementById('donate-amount');
    if (amountInput) amountInput.value = '';
    
    // Open the details modal
    document.getElementById('donate-modal').style.display = 'flex';
}

function processDonation() {
    const amount = document.getElementById('donate-amount').value;
    const category = document.getElementById('donate-category').value;
    
    if(!amount || parseInt(amount) <= 0) {
        alert("Please enter a valid donation amount.");
        return;
    }
    
    // Close the details modal
    document.getElementById('donate-modal').style.display = 'none';
    
    // Show success modal
    const modal = document.getElementById('action-modal');
    document.getElementById('modal-icon').textContent = '❤️';
    document.getElementById('modal-title').textContent = 'Thank You!';
    document.getElementById('modal-desc').textContent = \`Your donation of ₹\${amount} to the "\${category}" has been successfully processed. A receipt has been sent to your email.\`;
    
    modal.style.display = 'flex';
    
    // Change the original button visually
    if(activeDonationButton) {
        activeDonationButton.textContent = 'Donated ✓';
        activeDonationButton.style.background = 'var(--success)';
        activeDonationButton.style.pointerEvents = 'none';
        activeDonationButton = null; // reset
    }
}
`;

// Replace the older simplistic handleDonation with the new enhanced one
if (js.includes('function handleDonation(btn, fundName)')) {
    const regex = /\/\/ ==========================================\n\/\/ 💰 DONATION LOGIC\n\/\/ ==========================================\nfunction handleDonation[\s\S]*?btn\.style\.pointerEvents = 'none';\n}/;
    js = js.replace(regex, processDonateJs);
    fs.writeFileSync(jsPath, js);
    console.log('Mobile app JS updated for enhanced donation.');
} else if (!js.includes('processDonation()')) {
    fs.appendFileSync(jsPath, processDonateJs);
    console.log('Enhanced Donation JS appended.');
}
