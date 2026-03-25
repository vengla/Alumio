const fs = require('fs');

const htmlPath = 'e:/Tableau/project/alumni_platform/mobile/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const modalsHtml = `
      <!-- Setup Meeting Modal -->
      <div id="meeting-modal"
        style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 2000; justify-content: center; align-items: center;">
        <div
          style="background: white; width: 85%; padding: 20px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid var(--border-light); padding-bottom: 10px;">
            <h3 style="margin: 0; color: var(--text-main);">📅 Schedule Meeting</h3>
            <button onclick="document.getElementById('meeting-modal').style.display='none'"
              style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--danger);">✕</button>
          </div>
          
          <p id="meeting-mentee-name" style="font-size: 0.9rem; margin-bottom: 15px; font-weight: bold; color: var(--primary);"></p>

          <div class="input-group" style="margin-bottom: 15px;">
            <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 5px; display: block;">Topic / Agenda</label>
            <input type="text" id="meeting-topic" placeholder="e.g. Mock Interview" style="width: 100%; padding: 10px; border: 1px solid var(--border-light); border-radius: 8px; outline: none; background: var(--bg-surface); font-family: inherit;">
          </div>
          
          <div class="input-group" style="display: flex; gap: 10px; margin-bottom: 15px;">
            <div style="flex: 1;">
              <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 5px; display: block;">Date</label>
              <input type="date" id="meeting-date" style="width: 100%; padding: 10px; border: 1px solid var(--border-light); border-radius: 8px; outline: none; background: var(--bg-surface); font-family: inherit;">
            </div>
            <div style="flex: 1;">
              <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 5px; display: block;">Time</label>
              <input type="time" id="meeting-time" style="width: 100%; padding: 10px; border: 1px solid var(--border-light); border-radius: 8px; outline: none; background: var(--bg-surface); font-family: inherit;">
            </div>
          </div>
          
          <div class="input-group" style="margin-bottom: 20px;">
            <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 5px; display: block;">Meeting Link</label>
            <input type="url" id="meeting-link" placeholder="Meet/Zoom Link" style="width: 100%; padding: 10px; border: 1px solid var(--border-light); border-radius: 8px; outline: none; background: var(--bg-surface); font-family: inherit;">
          </div>

          <button onclick="confirmMeeting()" style="background: var(--primary); color: white; padding:12px; width:100%; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">Send Invite</button>
        </div>
      </div>

      <!-- In-App Messaging Modal with Options -->
      <div id="message-modal"
        style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 2000; justify-content: center; align-items: center;">
        <div
          style="background: white; width: 85%; padding: 20px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid var(--border-light); padding-bottom: 10px;">
            <h3 style="margin: 0; color: var(--text-main);">💬 Send Message</h3>
            <button onclick="document.getElementById('message-modal').style.display='none'"
              style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--danger);">✕</button>
          </div>
          
          <p id="msg-mentee-name" style="font-size: 0.9rem; margin-bottom: 10px; font-weight: bold; color: var(--primary);"></p>

          <label style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); margin-bottom: 5px; display: block;">Quick Message Options:</label>
          <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 15px;">
              <button onclick="setMsgOption('Are we still on for our meeting?')" style="padding: 5px 10px; background: var(--bg-subtle); border: 1px solid var(--border-light); border-radius: 12px; font-size: 0.75rem; cursor: pointer;">Meeting Setup</button>
              <button onclick="setMsgOption('Please review the document I attached.')" style="padding: 5px 10px; background: var(--bg-subtle); border: 1px solid var(--border-light); border-radius: 12px; font-size: 0.75rem; cursor: pointer;">Review Work</button>
              <button onclick="setMsgOption('How is your job hunt progressing?')" style="padding: 5px 10px; background: var(--bg-subtle); border: 1px solid var(--border-light); border-radius: 12px; font-size: 0.75rem; cursor: pointer;">Check In</button>
              <button onclick="setMsgOption('I have a referral link for you!')" style="padding: 5px 10px; background: var(--bg-subtle); border: 1px solid var(--border-light); border-radius: 12px; font-size: 0.75rem; cursor: pointer;">Referral</button>
          </div>

          <textarea id="msg-content" rows="4" placeholder="Type your message here..." style="width: 100%; padding: 10px; border: 1px solid var(--border-light); border-radius: 8px; outline: none; background: var(--bg-surface); font-family: inherit; margin-bottom: 15px; resize: none;"></textarea>

          <button onclick="confirmMessage()" style="background: var(--primary); color: white; padding:12px; width:100%; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">Send Message</button>
        </div>
      </div>
`;

if (!html.includes('id="message-modal"')) {
    html = html.replace('<!-- Custom Modal Popup -->', modalsHtml + '\n      <!-- Custom Modal Popup -->');
    fs.writeFileSync(htmlPath, html);
    console.log('Fixed missing modals and added quick message options!');
} else {
    console.log('Modals already present.');
}
