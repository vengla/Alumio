const fs = require('fs');

const jsPath = 'e:/Tableau/project/alumni_platform/mobile/mobile-app.js';
let js = fs.readFileSync(jsPath, 'utf8');

const demoLoginJs = `
// ==========================================
// 🚀 DEMO AUTO-LOGIN LOGIC
// ==========================================
function demoLogin(role, email) {
    // 1. Select the right role tab automatically
    document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
    const targetBtn = document.querySelector(\`.role-btn[data-role="\${role}"]\`);
    if(targetBtn) targetBtn.classList.add('active');
    
    // Set the global currentRole variable
    window.currentRole = role;
    
    // 2. Fill in the email and password fields implicitly to look like they typed it
    const emailInput = document.getElementById('email-input');
    const passInput = document.getElementById('password-input');
    
    if(emailInput) emailInput.value = email;
    if(passInput) passInput.value = '123456';
    
    // 3. Trigger the main login function to log them in securely
    loginUser();
}
`;

if (!js.includes('DEMO AUTO-LOGIN LOGIC')) {
    fs.appendFileSync(jsPath, demoLoginJs);
    console.log('Appended auto-login logic to mobile-app.js');
} else {
    console.log('Already appended.');
}
