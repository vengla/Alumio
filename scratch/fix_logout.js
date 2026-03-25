const fs = require('fs');
const path = require('path');

const mobileDir = 'e:/Tableau/project/alumni_platform/mobile';
const htmlPath = path.join(mobileDir, 'index.html');
const jsPath = path.join(mobileDir, 'mobile-app.js');

// 1. UPDATE HTML - change to logoutUser()
let html = fs.readFileSync(htmlPath, 'utf8');

html = html.replace(/onclick="showScreen\('login'\)">Logout<\/button>/g, 'onclick="logoutUser()">Logout</button>');

fs.writeFileSync(htmlPath, html);
console.log('HTML updated: logout button points to logoutUser()');

// 2. UPDATE JS - define logoutUser()
let js = fs.readFileSync(jsPath, 'utf8');

const logoutJs = `
// ==========================================
// 🚪 LOGOUT FUNCTION
// ==========================================
function logoutUser() {
    // 1. Clear input fields
    const emailInput = document.getElementById('email-input');
    const passInput = document.getElementById('password-input');
    if (emailInput) emailInput.value = '';
    if (passInput) passInput.value = '';
    
    // 2. Reset Chatbot
    const chatBtn = document.getElementById('chatbot-toggle-btn');
    const chatContainer = document.getElementById('chatbot-container');
    if (chatBtn) {
        chatBtn.style.transform = 'scale(0)';
        setTimeout(() => chatBtn.style.display = 'none', 200);
    }
    if (chatContainer) chatContainer.style.display = 'none';

    // 3. Clear Chat history so it resets for next user
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        chatMessages.innerHTML = \`
            <div style="background: var(--bg-subtle); color: var(--text-main); padding: 10px; border-radius: 10px; border-bottom-left-radius: 0; align-self: flex-start; max-width: 80%;">
                Hi! I'm your AI assistant. How can I help you today?
            </div>
        \`;
    }

    // 4. Reset Action Buttons color and state (from Green back to Default)
    document.querySelectorAll('.btn-apply, .btn-request, .btn-register').forEach(btn => {
        // We only reset successful buttons
        if(btn.style.pointerEvents === 'none') {
            btn.style.background = ''; // reset to default gradient
            btn.style.pointerEvents = 'auto';
            if (btn.classList.contains('btn-apply')) btn.textContent = 'Apply Now';
            if (btn.classList.contains('btn-request')) btn.textContent = 'Request';
            if (btn.classList.contains('btn-register')) btn.textContent = 'Register Now';
        }
    });

    // 5. Navigate to Login Screen
    // Get ALL screens and explicitly hide them, and show login.
    document.querySelectorAll('.screen-view').forEach(screen => {
        screen.style.display = 'none';
        screen.classList.remove('active');
    });
    
    const loginScreen = document.getElementById('login');
    if (loginScreen) {
        loginScreen.style.display = 'flex';
    }
    
    // Give feedback
    console.log("User logged out successfully.");
}
`;

if (!js.includes('logoutUser()')) {
    fs.appendFileSync(jsPath, logoutJs);
    console.log('JS updated with robust logoutUser logic.');
}

