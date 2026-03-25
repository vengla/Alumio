const fs = require('fs');
const path = require('path');

const cssFile = 'e:/Tableau/project/alumni_platform/mobile/mobile-styles.css';

const premiumCss = `

/* =========================================
   ⭐️ PREMIUM UI UPGRADES (GLASSMORPHISM & ANIMATIONS)
   ========================================= */

@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

body {
    font-family: 'Outfit', sans-serif;
    /* Animated Dynamic Background */
    background: linear-gradient(-45deg, #FF9A9E, #FECFEF, #A1C4FD, #C2E9FB);
    background-size: 400% 400%;
    animation: gradientBG 15s ease infinite;
}

@keyframes gradientBG {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

/* Enhancing the physical phone frame */
.phone-frame {
    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.4), inset 0 0 10px rgba(255,255,255,0.2);
    border: 8px solid #222;
    background: #111;
}

/* Glassmorphism Headers */
.mobile-header {
    background: rgba(255, 255, 255, 0.75) !important;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255,255,255,0.4) !important;
    position: sticky;
    top: 0;
    z-index: 50;
    box-shadow: 0 4px 30px rgba(0,0,0,0.03);
}

/* Enhanced Cards with micro-animations */
.stat-card, .action-card, .activity-item, .alumni-card, .job-card, .mentor-card, .event-card, .info-banner, .input-group input {
    background: rgba(255, 255, 255, 0.85) !important;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.6) !important;
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.07) !important;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease !important;
}

.input-group input:focus {
    outline: none;
    border-color: var(--primary) !important;
    box-shadow: 0 0 0 3px rgba(0, 51, 102, 0.1) !important;
    background: #fff !important;
}

/* Tap Animations */
.stat-card:active, .action-card:active, .alumni-card:active, .job-card:active {
    transform: scale(0.96) !important;
}

.btn-primary, .btn-connect, .btn-apply, .btn-request, .btn-register, .role-btn.active {
    background: linear-gradient(135deg, var(--primary) 0%, #0055ff 100%) !important;
    box-shadow: 0 4px 15px rgba(0, 102, 255, 0.3) !important;
    border: none;
    transition: all 0.3s ease;
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.btn-primary:active, .btn-connect:active, .btn-apply:active {
    transform: scale(0.94);
    box-shadow: 0 2px 8px rgba(0, 102, 255, 0.2) !important;
}

/* Glassmorphism Bottom Nav */
.bottom-nav {
    background: rgba(255, 255, 255, 0.8) !important;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255,255,255,0.5) !important;
    padding-bottom: 1.5rem !important; /* iPhone safe area padding */
    box-shadow: 0 -10px 30px rgba(0,0,0,0.03);
}

/* Nav Bar bouncy icons */
.nav-btn .nav-icon {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.nav-btn.active .nav-icon {
    transform: scale(1.3) translateY(-4px);
    color: var(--primary);
    text-shadow: 0 4px 10px rgba(0, 51, 102, 0.3);
}

.nav-btn.active .nav-label {
    font-weight: 600;
    color: var(--primary);
}

/* Splash Screen Enhancements */
.app-icon {
    animation: float 3s ease-in-out infinite;
    text-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

@keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0px); }
}

.splash-content {
    background: linear-gradient(135deg, #003366 0%, #001133 100%) !important;
}

/* Avatar Gradients */
.alumni-avatar, .mentor-avatar {
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    border: 2px solid white;
}

`;

fs.appendFileSync(cssFile, premiumCss);
console.log('Premium UI applied!');
