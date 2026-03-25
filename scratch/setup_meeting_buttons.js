const fs = require('fs');

const htmlPath = 'e:/Tableau/project/alumni_platform/mobile/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const meetingMessageModalsHtml = `
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
            <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 5px; display: block;">Meeting Link (Zoom/Meet)</label>
            <input type="url" id="meeting-link" placeholder="https://meet.google.com/..." style="width: 100%; padding: 10px; border: 1px solid var(--border-light); border-radius: 8px; outline: none; background: var(--bg-surface); font-family: inherit;">
          </div>

          <button onclick="confirmMeeting()" style="background: var(--primary); color: white; padding:12px; width:100%; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">Send Invite</button>
        </div>
      </div>

      <!-- In-App Messaging Modal -->
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

          <textarea id="msg-content" rows="4" placeholder="Type your message here..." style="width: 100%; padding: 10px; border: 1px solid var(--border-light); border-radius: 8px; outline: none; background: var(--bg-surface); font-family: inherit; margin-bottom: 15px; resize: none;"></textarea>

          <button onclick="confirmMessage()" style="background: var(--primary); color: white; padding:12px; width:100%; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">Send Message</button>
        </div>
      </div>
`;

if (!html.includes('id="meeting-modal"')) {
    html = html.replace('<!-- Custom Modal Popup -->', meetingMessageModalsHtml + '\n      <!-- Custom Modal Popup -->');
}

// Update the Mentees buttons
const oldMenteeCards = `
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
`;

const newMenteeCards = `
              <div style="display: flex; gap: 5px; flex-direction: column;">
                <button class="btn-connect" style="background: var(--primary); padding: 5px 10px; font-size: 0.75rem; width: 100%;" onclick="openMessageModal('Sara Davis')">💬 Message</button>
                <button class="btn-connect" style="background: var(--accent); color: black; padding: 5px 10px; font-size: 0.75rem; width: 100%;" onclick="openMeetingModal('Sara Davis')">📅 Meeting</button>
              </div>
            </div>

            <div class="alumni-card" style="border-left: 4px solid var(--success);">
              <div class="alumni-avatar" style="background: var(--success); color: white;">MP</div>
              <div class="alumni-info">
                <div class="alumni-name">Mike Patel</div>
                <div class="alumni-role" style="font-size: 0.8rem; color: var(--text-muted);">EE Senior • Class of '25</div>
                <div class="alumni-meta" style="color: var(--primary); font-size: 0.75rem;">Goal: Hardware Portfolio</div>
              </div>
              <div style="display: flex; gap: 5px; flex-direction: column;">
                <button class="btn-connect" style="background: var(--primary); padding: 5px 10px; font-size: 0.75rem; width: 100%;" onclick="openMessageModal('Mike Patel')">💬 Message</button>
                <button class="btn-connect" style="background: var(--accent); color: black; padding: 5px 10px; font-size: 0.75rem; width: 100%;" onclick="openMeetingModal('Mike Patel')">📅 Meeting</button>
              </div>
`;

if (html.includes(oldMenteeCards)) {
    html = html.replace(oldMenteeCards, newMenteeCards);
    fs.writeFileSync(htmlPath, html);
    console.log('Updated HTML for My Mentors with new buttons.');
} else {
    // Attempt relaxed replace if exact match fails
    const replace2 = html.replace(/<button class="btn-connect" style="background: var\(--primary\); padding: 5px 10px; font-size: 0.8rem;" onclick="window.location.href='mailto:([^']+)'">Message<\/button>/g, (match, email, offset, string) => {
        // extract name from nearby alumni-name if possible, but simplest is to just use standard DOM traversal, let's inject a wrapper instead.
        // Actually since we know it's Sara and Mike, we can just replace specifically
        return '';
    });
    // This isn't perfect, let's just write the exact HTML we want for the list
    const exactListHtml = `
          <div class="alumni-list" style="margin-top: 15px;">
            <div class="alumni-card" style="border-left: 4px solid var(--success);">
              <div class="alumni-avatar" style="background: var(--success); color: white;">SD</div>
              <div class="alumni-info">
                <div class="alumni-name">Sara Davis</div>
                <div class="alumni-role" style="font-size: 0.8rem; color: var(--text-muted);">CS Junior • Class of '26</div>
                <div class="alumni-meta" style="color: var(--primary); font-size: 0.75rem;">Goal: SDE Interview Prep</div>
              </div>
              <div style="display: flex; gap: 5px; flex-direction: column;">
                <button class="btn-connect" style="background: var(--primary); padding: 5px 10px; font-size: 0.75rem; width: 100%;" onclick="openMessageModal('Sara Davis')">💬 Message</button>
                <button class="btn-connect" style="background: var(--accent); color: black; padding: 5px 10px; font-size: 0.75rem; width: 100%;" onclick="openMeetingModal('Sara Davis')">📅 Meeting</button>
              </div>
            </div>

            <div class="alumni-card" style="border-left: 4px solid var(--success);">
              <div class="alumni-avatar" style="background: var(--success); color: white;">MP</div>
              <div class="alumni-info">
                <div class="alumni-name">Mike Patel</div>
                <div class="alumni-role" style="font-size: 0.8rem; color: var(--text-muted);">EE Senior • Class of '25</div>
                <div class="alumni-meta" style="color: var(--primary); font-size: 0.75rem;">Goal: Hardware Portfolio</div>
              </div>
              <div style="display: flex; gap: 5px; flex-direction: column;">
                <button class="btn-connect" style="background: var(--primary); padding: 5px 10px; font-size: 0.75rem; width: 100%;" onclick="openMessageModal('Mike Patel')">💬 Message</button>
                <button class="btn-connect" style="background: var(--accent); color: black; padding: 5px 10px; font-size: 0.75rem; width: 100%;" onclick="openMeetingModal('Mike Patel')">📅 Meeting</button>
              </div>
            </div>
          </div>
    `;
    const regexList = /<div class="alumni-list" style="margin-top: 15px;">[\s\S]*?(?=<\/div>\s*<div class="bottom-nav">)/;
    html = html.replace(regexList, exactListHtml);
    fs.writeFileSync(htmlPath, html);
    console.log('Force updated mentee card HTML.');
}


const jsPath = 'e:/Tableau/project/alumni_platform/mobile/mobile-app.js';
let js = fs.readFileSync(jsPath, 'utf8');

const mentorJS = `
// ==========================================
// 🎯 MENTEE ACTION LOGIC (Meeting & Message)
// ==========================================
function openMeetingModal(menteeName) {
    document.getElementById('meeting-mentee-name').textContent = 'With: ' + menteeName;
    document.getElementById('meeting-topic').value = '';
    document.getElementById('meeting-date').value = '';
    document.getElementById('meeting-time').value = '';
    document.getElementById('meeting-link').value = '';
    
    document.getElementById('meeting-modal').style.display = 'flex';
}

function confirmMeeting() {
    const topic = document.getElementById('meeting-topic').value;
    const date = document.getElementById('meeting-date').value;
    const time = document.getElementById('meeting-time').value;
    
    if(!topic || !date || !time) {
        alert("Please provide the topic, date, and time.");
        return;
    }
    
    document.getElementById('meeting-modal').style.display = 'none';
    
    // Show success popup
    const modal = document.getElementById('action-modal');
    document.getElementById('modal-icon').textContent = '📅';
    document.getElementById('modal-title').textContent = 'Meeting Scheduled!';
    document.getElementById('modal-desc').textContent = \`Your meeting "\${topic}" on \${date} at \${time} has been sent. The student will receive an email invite.\`;
    
    modal.style.display = 'flex';
}

function openMessageModal(menteeName) {
    document.getElementById('msg-mentee-name').textContent = 'To: ' + menteeName;
    document.getElementById('msg-content').value = '';
    
    document.getElementById('message-modal').style.display = 'flex';
}

function confirmMessage() {
    const content = document.getElementById('msg-content').value;
    
    if(!content) {
        alert("Please write a message to send.");
        return;
    }
    
    document.getElementById('message-modal').style.display = 'none';
    
    // Show success popup
    const modal = document.getElementById('action-modal');
    document.getElementById('modal-icon').textContent = '✉️';
    document.getElementById('modal-title').textContent = 'Message Sent!';
    document.getElementById('modal-desc').textContent = \`Your message has been delivered to the student's inbox securely.\`;
    
    modal.style.display = 'flex';
}
`;

if (!js.includes('MENTEE ACTION LOGIC')) {
    fs.appendFileSync(jsPath, mentorJS);
    console.log('Appended Mentees Action Logic to JS');
}

