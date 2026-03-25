const fs = require('fs');
const path = require('path');

const mobileDir = 'e:/Tableau/project/alumni_platform/mobile';
const htmlPath = path.join(mobileDir, 'index.html');
const cssPath = path.join(mobileDir, 'mobile-styles.css');
const jsPath = path.join(mobileDir, 'mobile-app.js');

// 1. UPDATE HTML
let html = fs.readFileSync(htmlPath, 'utf8');

const chatbotHtml = `
  <!-- Chatbot UI -->
  <div id="chatbot-container" style="display: none; position: absolute; bottom: 80px; right: 20px; width: 300px; height: 400px; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); z-index: 1000; flex-direction: column; overflow: hidden; border: 1px solid rgba(255,255,255,0.5);">
    <div style="background: linear-gradient(135deg, var(--primary), #0055ff); color: white; padding: 15px; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
      <span>🤖 Alumni Assistant</span>
      <button onclick="toggleChatbot()" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer;">✕</button>
    </div>
    <div id="chat-messages" style="flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; font-size: 0.85rem;">
      <div style="background: var(--bg-subtle); color: var(--text-main); padding: 10px; border-radius: 10px; border-bottom-left-radius: 0; align-self: flex-start; max-width: 80%;">
        Hi! I'm your AI assistant. How can I help you today?
      </div>
    </div>
    <div style="padding: 10px; border-top: 1px solid var(--border-light); display: flex; gap: 5px; background: white;">
      <input type="text" id="chat-input" placeholder="Type a message..." style="flex: 1; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 20px; outline: none; font-family: inherit;">
      <button onclick="sendMessage()" style="background: var(--primary); color: white; border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; display: flex; justify-content: center; align-items: center;">➤</button>
    </div>
  </div>

  <!-- Floating Chat Button -->
  <button id="chatbot-toggle-btn" onclick="toggleChatbot()" style="position: absolute; bottom: 90px; right: 20px; width: 50px; height: 50px; background: linear-gradient(135deg, var(--primary), #0055ff); color: white; border: none; border-radius: 50%; font-size: 1.5rem; display: flex; justify-content: center; align-items: center; cursor: pointer; box-shadow: 0 5px 20px rgba(0, 51, 102, 0.4); z-index: 999; display: none; transition: transform 0.2s;">
    💬
  </button>
`;

if (!html.includes('id="chatbot-container"')) {
    html = html.replace('</div>\r\n  </div>\r\n\r\n  <script src="mobile-app.js"></script>', chatbotHtml + '\r\n    </div>\r\n  </div>\r\n\r\n  <script src="mobile-app.js"></script>');
    fs.writeFileSync(htmlPath, html);
    console.log('HTML updated with chatbot UI.');
}

// 2. UPDATE CSS
let css = fs.readFileSync(cssPath, 'utf8');
const chatbotCss = `
/* Chatbot Animations */
#chatbot-toggle-btn:active {
    transform: scale(0.9);
}

.chat-bubble-user {
    background: linear-gradient(135deg, var(--primary), #0055ff);
    color: white;
    padding: 10px;
    border-radius: 10px;
    border-bottom-right-radius: 0;
    align-self: flex-end;
    max-width: 80%;
    animation: fadeIn 0.3s;
}

.chat-bubble-bot {
    background: var(--bg-subtle);
    color: var(--text-main);
    padding: 10px;
    border-radius: 10px;
    border-bottom-left-radius: 0;
    align-self: flex-start;
    max-width: 80%;
    animation: fadeIn 0.3s;
}
`;

if (!css.includes('.chat-bubble-user')) {
    fs.appendFileSync(cssPath, chatbotCss);
    console.log('CSS updated with chatbot styles.');
}

// 3. UPDATE JS
let js = fs.readFileSync(jsPath, 'utf8');

const chatbotJs = `
// ==========================================
// 🤖 CHATBOT LOGIC
// ==========================================

function toggleChatbot() {
    const container = document.getElementById('chatbot-container');
    if (container.style.display === 'none' || container.style.display === '') {
        container.style.display = 'flex';
        document.getElementById('chatbot-toggle-btn').style.transform = 'scale(0) rotate(-180deg)';
        setTimeout(() => document.getElementById('chatbot-toggle-btn').style.display = 'none', 200);
    } else {
        container.style.display = 'none';
        document.getElementById('chatbot-toggle-btn').style.display = 'flex';
        setTimeout(() => document.getElementById('chatbot-toggle-btn').style.transform = 'scale(1) rotate(0deg)', 10);
    }
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const messages = document.getElementById('chat-messages');
    const text = input.value.trim();
    
    if (!text) return;
    
    // User message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-bubble-user';
    userMsg.textContent = text;
    messages.appendChild(userMsg);
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
    
    // Bot response simulation
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-bubble-bot';
        
        let reply = "I'm still learning! You can ask me about finding mentors, applying for jobs, or donating.";
        const lower = text.toLowerCase();
        
        if (lower.includes("job") || lower.includes("career")) {
            reply = "To find jobs, tap the 'Jobs' icon at the bottom of the screen. Alumni can post exclusive referrals there!";
        } else if (lower.includes("mentor")) {
            reply = "We have an AI matching engine for mentorship! Go to the Mentorship section from your dashboard to get paired.";
        } else if (lower.includes("donate") || lower.includes("fund")) {
            reply = "Thank you for your generosity! You can contribute to scholarships or infrastructure in the Donations section.";
        } else if (lower.includes("hello") || lower.includes("hi")) {
            reply = "Hello! Welcome to the Alumni Network. How can I assist you?";
        }
        
        botMsg.textContent = reply;
        messages.appendChild(botMsg);
        messages.scrollTop = messages.scrollHeight;
    }, 600);
}

// Add enter key support
document.getElementById('chat-input')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Show chatbot button after login
const originalLoginForChatBtn = loginUser;
loginUser = function() {
    if (typeof originalLoginForChatBtn === 'function') originalLoginForChatBtn();
    document.getElementById('chatbot-toggle-btn').style.display = 'flex';
    setTimeout(() => document.getElementById('chatbot-toggle-btn').style.transform = 'scale(1)', 10);
};

// Also show it if we go back to dashboard from another screen, and hide on login
const originalShowScreen = showScreen;
showScreen = function(id) {
    if (typeof originalShowScreen === 'function') originalShowScreen(id);
    const btn = document.getElementById('chatbot-toggle-btn');
    const container = document.getElementById('chatbot-container');
    if (btn) {
        if (id === 'login') {
            btn.style.display = 'none';
            if(container) container.style.display = 'none';
        } else {
            btn.style.display = container && container.style.display === 'flex' ? 'none' : 'flex';
            setTimeout(() => btn.style.transform = 'scale(1)', 10);
        }
    }
};

`;

if (!js.includes('toggleChatbot')) {
    fs.appendFileSync(jsPath, chatbotJs);
    console.log('JS updated with chatbot logic.');
}

console.log('Chatbot integrated successfully!');
