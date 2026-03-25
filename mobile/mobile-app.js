// Initialize app
let currentRole = 'alumni';

// Splash screen transition
setTimeout(() => {
    showScreen('login');
}, 2000);

// Role selection
document.addEventListener('DOMContentLoaded', () => {
    const roleButtons = document.querySelectorAll('.role-btn');
    roleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            roleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentRole = btn.dataset.role;
        });
    });
});

// Login function
function loginUser() {
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;

    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }

    // Set user name based on role
    let userName = 'User';
    if (currentRole === 'alumni') userName = 'John Alumnus';
    else if (currentRole === 'student') userName = 'Jane Student';
    else if (currentRole === 'admin') userName = 'Dr. Admin';

    document.getElementById('user-name').textContent = userName;

    // Show dashboard
    showScreen('dashboard');
}

// Screen navigation
function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen-view');
    screens.forEach(screen => {
        screen.style.display = 'none';
    });

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.style.display = 'flex';
    }

    // Update bottom nav active state
    updateActiveNav(screenId);
}

function updateActiveNav(screenId) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Map screen to nav index
    const navMap = {
        'dashboard': 0,
        'directory': 1,
        'jobs': 2,
        'mentorship': 1, // directory position
        'events': 2 // jobs position
    };

    const screens = document.querySelectorAll('.screen-view');
    screens.forEach(screen => {
        const bottomNav = screen.querySelector('.bottom-nav');
        if (bottomNav) {
            const buttons = bottomNav.querySelectorAll('.nav-btn');
            buttons.forEach(btn => btn.classList.remove('active'));

            if (navMap[screenId] !== undefined && buttons[navMap[screenId]]) {
                buttons[navMap[screenId]].classList.add('active');
            }
        }
    });
}

// Simulate push notifications
function simulateNotification() {
    if (Notification.permission === 'granted') {
        new Notification('Alumni Connect', {
            body: 'New connection request from Rajesh Kumar',
            icon: '🎓'
        });
    }
}

// Request notification permission on load
if ('Notification' in window && Notification.permission === 'default') {
    setTimeout(() => {
        Notification.requestPermission();
    }, 3000);
}

// Simulate offline mode indicator
window.addEventListener('online', () => {
    console.log('App is online');
});

window.addEventListener('offline', () => {
    console.log('App is offline - showing cached content');
});

// Mock data for demonstration
const mockData = {
    user: {
        name: 'John Alumnus',
        role: 'alumni',
        batch: '2018',
        department: 'Computer Science'
    },
    stats: {
        connections: 145,
        jobPosts: 2,
        mentees: 3,
        donated: '₹25K'
    },
    alumni: [
        { name: 'Rajesh Kumar', role: 'Senior SDE', company: 'Google', batch: '2015', dept: 'CS' },
        { name: 'Priya Sharma', role: 'Product Manager', company: 'Microsoft', batch: '2017', dept: 'EE' },
        { name: 'Sneha Reddy', role: 'Data Scientist', company: 'Amazon', batch: '2018', dept: 'CS' }
    ]
};

console.log('Alumni Connect Mobile App - Demo Mode');
console.log('Features:');
console.log('✓ Role-based authentication');
console.log('✓ Alumni directory');
console.log('✓ Job portal with referrals');
console.log('✓ AI-powered mentorship matching');
console.log('✓ Events & reunions');
console.log('✓ Push notifications (simulated)');
console.log('✓ Offline mode support (simulated)');

// Append to quick actions dashboard to handle new navigation
document.addEventListener('DOMContentLoaded', () => {
    const actionGrid = document.querySelector('.action-grid');
    if (actionGrid && !actionGrid.innerHTML.includes('Donations')) {
        actionGrid.innerHTML += `
            <button class="action-card" onclick="showScreen('donations')">
              <div class="action-icon">❤️</div>
              <div class="action-label">Donations</div>
            </button>
        `;
    }

    // update profile icon navigation
    const settingsBtns = document.querySelectorAll('.nav-btn');
    settingsBtns.forEach(btn => {
        if (btn.innerHTML.includes('Settings') || btn.innerHTML.includes('Profile')) {
            btn.onclick = () => showScreen('profile');
        }
    });
});

// Admin redirect logic
const originalLogin = loginUser;
loginUser = function () {
    originalLogin();
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    if (!email || !password) return;

    document.getElementById('profile-name').textContent = document.getElementById('user-name').textContent;
    const parts = document.getElementById('user-name').textContent.split(' ');
    document.getElementById('profile-avatar').textContent = parts[0][0] + (parts[1]?.[0] || '');
    document.getElementById('profile-role').textContent = currentRole.toUpperCase();

    if (currentRole === 'admin') {
        const actionGrid = document.querySelector('.action-grid');
        if (actionGrid && !actionGrid.innerHTML.includes('Admin Panel')) {
            actionGrid.innerHTML = `
                <button class="action-card" onclick="showScreen('admin')">
                  <div class="action-icon">⚙️</div>
                  <div class="action-label">Admin Panel</div>
                </button>
            ` + actionGrid.innerHTML;
        }
    }
};

// ==========================================
// 🔴 LIVE API INTEGRATION (DummyJSON API)
// ==========================================
async function fetchLiveAPI() {
    const quoteEl = document.getElementById('api-quote');
    const authorEl = document.getElementById('api-author');
    if (!quoteEl) return;

    try {
        // Fetching random quote from a public API
        const response = await fetch('https://dummyjson.com/quotes/random');
        const data = await response.json();

        quoteEl.style.opacity = '0'; // smooth fade out

        setTimeout(() => {
            quoteEl.innerText = '"' + data.quote + '"';
            authorEl.innerText = "- " + data.author;
            quoteEl.style.opacity = '1'; // smooth fade in
        }, 300);

    } catch (error) {
        quoteEl.innerText = "Error loading live API snippet.";
        console.error("API Fetch Error:", error);
    }
}

// Fetch the API as soon as the app loads
document.addEventListener('DOMContentLoaded', fetchLiveAPI);

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

    // Bot response with rich knowledge base
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-bubble-bot';

        const lower = text.toLowerCase();
        let reply = "I'm here to help! You can ask me about jobs, mentors, events, donations, registration, connecting with alumni, or admin features.";

        // ── Greetings ──
        if (lower.match(/^(hi|hello|hey|howdy|sup|good\s*(morning|afternoon|evening))/)) {
            const greets = [
                "Hello! 👋 Welcome to Alumni Connect. How can I help you today?",
                "Hey there! 😊 Ask me anything about the platform — jobs, events, mentorship and more!",
                "Hi! Great to see you. What would you like to explore today?"
            ];
            reply = greets[Math.floor(Math.random() * greets.length)];

            // ── Jobs / Career ──
        } else if (lower.includes("job") || lower.includes("career") || lower.includes("internship") || lower.includes("placement")) {
            if (lower.includes("post") || lower.includes("create")) {
                reply = "💼 Alumni and Admins can post new jobs! Log in as Alumni, go to the 'Jobs' tab, and tap the blue '+ Post a New Job/Internship' button at the top to fill in details.";
            } else if (lower.includes("apply") || lower.includes("application")) {
                reply = "📄 To apply for a job: Go to the Jobs Portal → tap 'Apply Now' on any listing. A detail preview modal will appear first so you can review the role before confirming. Students and Alumni can apply!";
            } else if (lower.includes("referral")) {
                reply = "🔗 Alumni can mark their job postings with a Referral badge! This signals to students that a direct referral is available for that role. Look for the green '✓ Referral' tag on job cards.";
            } else {
                reply = "💼 The Job Portal shows openings posted by Alumni mentors. Tap the 'Jobs' tab from the bottom nav to browse Full-time, Internship, and Referral opportunities!";
            }

            // ── Mentorship ──
        } else if (lower.includes("mentor") || lower.includes("mentee") || lower.includes("mentorship")) {
            if (lower.includes("find") || lower.includes("request") || lower.includes("student")) {
                reply = "🎓 Students can find mentors in the 'Mentorship' section. Tap any mentor card and press 'Request' to send a mentorship request. Our AI matching engine will suggest the best fit!";
            } else if (lower.includes("my mentee") || lower.includes("alumni")) {
                reply = "🎯 Alumni can view their active mentees in the 'My Mentees' section (accessible from the Alumni dashboard Quick Actions). You can Message or Schedule Meetings with each mentee directly!";
            } else if (lower.includes("meeting") || lower.includes("session") || lower.includes("schedule")) {
                reply = "📅 You can schedule a mentoring session directly! Go to My Mentees (for Alumni) or My Active Mentors (for Students), and tap the yellow '📅 Meeting' button to book a session with topic, date, time and a meeting link.";
            } else if (lower.includes("message")) {
                reply = "💬 Both mentors and mentees can message each other directly! Tap the blue '💬 Message' button on any mentor/mentee card. Quick reply templates like 'Check In' or 'Review Work' are also available!";
            } else {
                reply = "🤖 Our AI-Powered Mentorship Hub connects students with the perfect alumni mentor based on interests and career goals. Navigate to the Mentorship screen from your dashboard!";
            }

            // ── Events ──
        } else if (lower.includes("event") || lower.includes("reunion") || lower.includes("workshop") || lower.includes("talk") || lower.includes("seminar")) {
            if (lower.includes("register") || lower.includes("join") || lower.includes("attend")) {
                reply = "🎟️ To register for an event: Open the Events screen → tap 'Register Now' on any event card. A preview modal will show event details (date, time, venue). Confirm to secure your spot!";
            } else if (lower.includes("create") || lower.includes("post") || lower.includes("add")) {
                reply = "📅 Admins can create and manage events! Login as Admin and navigate to 'Manage Events' from the Admin Quick Actions panel.";
            } else {
                reply = "📅 Check out upcoming events in the 'Events & Reunions' section! We have Tech Talks, Alumni Meets, Career Workshops, and more. Tap Events from your dashboard Quick Actions.";
            }

            // ── Donations / Funds ──
        } else if (lower.includes("donat") || lower.includes("fund") || lower.includes("scholarship") || lower.includes("contribut") || lower.includes("giving")) {
            if (lower.includes("admin") || lower.includes("who") || lower.includes("list") || lower.includes("recent")) {
                reply = "📊 Admins can view the full donation history! Login as Admin → tap 'Funds' Quick Action → tap '📊 Recent Donations' button to see who donated, how much, and when.";
            } else if (lower.includes("how") || lower.includes("pay") || lower.includes("qr") || lower.includes("razorpay")) {
                reply = "💳 To donate: Tap 'Donate Now' on the Scholarship Fund card → select a category and amount → choose to pay via Razorpay (sandbox mode) or use the demo QR code for mock payment!";
            } else {
                reply = "❤️ Your donations go toward Scholarship Funds, Infrastructure, and General Endowment. Navigate to Donations & Giving from your dashboard to contribute. Every rupee counts!";
            }

            // ── Connect / Directory ──
        } else if (lower.includes("connect") || lower.includes("directory") || lower.includes("network") || lower.includes("alumni list")) {
            reply = "👥 The Alumni Directory lets you browse all alumni by name, role, and company. Tap 'Connect' on any card to send a connection request. Your request status will update to 'Pending' until they accept!";

            // ── Registration / Account ──
        } else if (lower.includes("register") || lower.includes("sign up") || lower.includes("account") || lower.includes("new user")) {
            reply = "📝 New users can register from the Login screen — tap 'Register'. Fill in your Name, Email, Graduation Year, Department, and select Alumni or Student. Your account will be reviewed by an Admin before activation!";

            // ── Admin ──
        } else if (lower.includes("admin") || lower.includes("approval") || lower.includes("pending") || lower.includes("verify")) {
            reply = "⚙️ Admins have full control: approve new registrations, view job applicants, manage events, and monitor donations. Login as Admin using the demo button to explore the Admin Panel!";

            // ── Login / Demo ──
        } else if (lower.includes("login") || lower.includes("log in") || lower.includes("demo") || lower.includes("access") || lower.includes("password")) {
            reply = "🚀 Use the Demo Mode buttons on the login screen to instantly log in as Alumni, Student, or Admin! No typing required — just tap and explore. Demo password is 123456 for all accounts.";

            // ── Profile / Settings ──
        } else if (lower.includes("profile") || lower.includes("setting") || lower.includes("edit") || lower.includes("linkedin") || lower.includes("visibility")) {
            reply = "👤 Tap 'Settings' (⚙️) from the bottom nav to edit your profile — name, email, current company, LinkedIn URL, and privacy settings like profile visibility!";

            // ── Notifications ──
        } else if (lower.includes("notif") || lower.includes("alert") || lower.includes("reminder")) {
            reply = "🔔 The bell icon on the dashboard opens your Notifications feed. It shows role-specific updates — job alerts for Students, mentor requests for Alumni, and pending approvals for Admins.";

            // ── Help / What can you do ──
        } else if (lower.includes("help") || lower.includes("what can") || lower.includes("feature") || lower.includes("guide")) {
            reply = "🤖 Here's what I can help with:\n• 💼 Job postings & applications\n• 🎓 Finding / managing mentors\n• 📅 Events & workshops\n• ❤️ Donations & scholarship funds\n• 👥 Alumni directory & connecting\n• ⚙️ Admin panel & approvals\n• 🔔 Notifications & profile\n\nJust ask me anything!";

            // ── Goodbye ──
        } else if (lower.match(/(bye|goodbye|see you|thanks|thank you|cya)/)) {
            reply = "👋 Glad I could help! Feel free to ask me anything else anytime. Have a great day!";
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
loginUser = function () {
    if (typeof originalLoginForChatBtn === 'function') originalLoginForChatBtn();
    document.getElementById('chatbot-toggle-btn').style.display = 'flex';
    setTimeout(() => document.getElementById('chatbot-toggle-btn').style.transform = 'scale(1)', 10);
};

// Also show it if we go back to dashboard from another screen, and hide on login
const originalShowScreen = showScreen;
showScreen = function (id) {
    if (typeof originalShowScreen === 'function') originalShowScreen(id);
    const btn = document.getElementById('chatbot-toggle-btn');
    const container = document.getElementById('chatbot-container');
    if (btn) {
        if (id === 'login') {
            btn.style.display = 'none';
            if (container) container.style.display = 'none';
        } else {
            btn.style.display = container && container.style.display === 'flex' ? 'none' : 'flex';
            setTimeout(() => btn.style.transform = 'scale(1)', 10);
        }
    }
};


// ==========================================
// ROLE-SPECIFIC QUICK ACTIONS
// ==========================================
const renderQuickActions = () => {
    const actionGrid = document.querySelector('.action-grid');
    if (!actionGrid) return;

    let html = '';

    if (currentRole === 'alumni') {
        html = `
            <button class="action-card" onclick="showScreen('directory')">
              <div class="action-icon">📋</div>
              <div class="action-label">Directory</div>
            </button>
            <button class="action-card" onclick="showScreen('jobs')">
              <div class="action-icon">💼</div>
              <div class="action-label">Post/Find Jobs</div>
            </button>
            <button class="action-card" onclick="showScreen('mentorship')">
              <div class="action-icon">🎓</div>
              <div class="action-label">Mentorship</div>
            </button>
            <button class="action-card" onclick="showScreen('events')">
              <div class="action-icon">📅</div>
              <div class="action-label">Events</div>
            </button>
            <button class="action-card" onclick="showScreen('donations')">
              <div class="action-icon">❤️</div>
              <div class="action-label">Donate</div>
            </button>
            <button class="action-card" onclick="showScreen('my-mentees')">
              <div class="action-icon">🎯</div>
              <div class="action-label">My Mentees</div>
            </button>
        `;
    }
    else if (currentRole === 'student') {
        html = `
            <button class="action-card" onclick="showScreen('directory')">
              <div class="action-icon">📋</div>
              <div class="action-label">Alumni</div>
            </button>
            <button class="action-card" onclick="showScreen('jobs')">
              <div class="action-icon">💼</div>
              <div class="action-label">Internships</div>
            </button>
            <button class="action-card" onclick="showScreen('mentorship')">
              <div class="action-icon">🎓</div>
              <div class="action-label">Mentorship</div>
            </button>
            <button class="action-card" onclick="showScreen('events')">
              <div class="action-icon">📅</div>
              <div class="action-label">Workshops</div>
            </button>
        `;
    }
    else if (currentRole === 'admin') {
        html = `
            <button class="action-card" onclick="showScreen('admin')">
              <div class="action-icon">⚙️</div>
              <div class="action-label">Admin Panel</div>
            </button>
            <button class="action-card" onclick="showScreen('events')">
              <div class="action-icon">📅</div>
              <div class="action-label">Manage Events</div>
            </button>
            <button class="action-card" onclick="showScreen('directory')">
              <div class="action-icon">👥</div>
              <div class="action-label">All Users</div>
            </button>
            <button class="action-card" onclick="showScreen('donations')">
              <div class="action-icon">📈</div>
              <div class="action-label">Funds</div>
            </button>
        `;
    }

    actionGrid.innerHTML = html;
};

// Hook it into the login process
const originalLoginForActions = loginUser;
loginUser = function () {
    if (typeof originalLoginForActions === 'function') originalLoginForActions();
    renderQuickActions();
};

// ==========================================
// 💡 INTERACTIVE MODAL ACTIONS
// ==========================================

function showActionModal(type, title) {
    const modal = document.getElementById('action-modal');
    const mIcon = document.getElementById('modal-icon');
    const mTitle = document.getElementById('modal-title');
    const mDesc = document.getElementById('modal-desc');

    modal.style.display = 'flex';

    if (type === 'apply') {
        mIcon.textContent = '📄';
        mTitle.textContent = 'Application Sent!';
        mDesc.textContent = `Your resume has been successfully submitted for the "${title}" role.`;
    }
    else if (type === 'request') {
        mIcon.textContent = '🤝';
        mTitle.textContent = 'Request Sent!';
        mDesc.textContent = `A mentorship request has been sent to ${title}. We will notify you when they respond.`;
    }
    else if (type === 'register') {
        mIcon.textContent = '🎟️';
        mTitle.textContent = 'Registered!';
        mDesc.textContent = `Your seat for "${title}" is confirmed. Check your email for details.`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Attach to Job Apply buttons
    document.querySelectorAll('.btn-apply').forEach(btn => {
        btn.onclick = function (e) {
            e.preventDefault();
            const jobTitle = this.parentElement.querySelector('.job-title').textContent;
            showActionModal('apply', jobTitle);
            this.textContent = 'Applied ✓';
            this.style.background = 'var(--success)';
            this.style.pointerEvents = 'none';
        };
    });

    // Attach to Mentor Request buttons
    document.querySelectorAll('.btn-request').forEach(btn => {
        btn.onclick = function (e) {
            e.preventDefault();
            const mentorName = this.parentElement.querySelector('.mentor-name').textContent;
            showActionModal('request', mentorName);
            this.textContent = 'Requested ✓';
            this.style.background = 'var(--success)';
            this.style.pointerEvents = 'none';
        };
    });

    // Attach to Event Register buttons
    document.querySelectorAll('.btn-register').forEach(btn => {
        btn.onclick = function (e) {
            e.preventDefault();
            const eventTitle = this.parentElement.querySelector('.event-title').textContent;
            // Prevent overriding donate button if it shares the class
            if (this.textContent.includes('Donate')) return;

            showActionModal('register', eventTitle);
            this.textContent = 'Registered ✓';
            this.style.background = 'var(--success)';
            this.style.pointerEvents = 'none';
        };
    });
});

// ==========================================
// 🛡️ ROLE-BASED BUTTON VISIBILITY
// ==========================================
const originalLoginForSecurity = loginUser;
loginUser = function () {
    if (typeof originalLoginForSecurity === 'function') originalLoginForSecurity();

    // Select all action buttons on cards
    const actionButtons = document.querySelectorAll('.btn-apply, .btn-request, .btn-register, .btn-connect');

    if (currentRole === 'admin') {
        // Admin should not apply, register, request, or connect
        actionButtons.forEach(btn => {
            // Don't hide the "Donate Now" button if it uses the register class
            if (!btn.textContent.includes('Donate') && !btn.textContent.includes('Approve')) {
                btn.style.display = 'none';
            }
        });
    } else {
        // Students and Alumni can see them
        actionButtons.forEach(btn => {
            // Restore display property
            btn.style.display = 'block';

            // Re-center buttons that were blocks
            if (btn.classList.contains('btn-connect') && !btn.closest('.alumni-card')) {
                // If it's the admin approve button, let the admin logic handle it
            }
        });
    }
};

// ==========================================
// 📊 ADMIN REGISTRATIONS LIST VIEW
// ==========================================

function showAdminRegistrations(eventTitle) {
    document.getElementById('reg-event-title').textContent = eventTitle;
    document.getElementById('admin-registrations-modal').style.display = 'flex';
}

const originalLoginForAdminEvents = loginUser;
loginUser = function () {
    if (typeof originalLoginForAdminEvents === 'function') originalLoginForAdminEvents();

    // We already hid the buttons for admins previously, so let's unhide the ones on events and transform them!
    if (currentRole === 'admin') {
        const eventCards = document.querySelectorAll('.event-card');
        eventCards.forEach(card => {
            const btn = card.querySelector('.btn-register');
            if (btn && !btn.textContent.includes('Donate')) {
                btn.style.display = 'block'; // Make it visible again
                btn.textContent = 'View Registrations';
                btn.style.background = '#475569'; // distinctive gray-blue color

                // Override the onclick to open the admin view
                btn.onclick = function (e) {
                    e.preventDefault();
                    e.stopPropagation(); // Stop the generic success modal from opening
                    const title = card.querySelector('.event-title').textContent;
                    showAdminRegistrations(title);
                };
            }
        });
    }
};

// ==========================================
// 🔔 DYNAMIC NOTIFICATIONS
// ==========================================

const originalShowScreenForNotif = showScreen;
showScreen = function (id) {
    if (typeof originalShowScreenForNotif === 'function') originalShowScreenForNotif(id);

    if (id === 'notifications') {
        const content = document.getElementById('notif-content');
        const header = document.getElementById('notif-header-title');

        let notifs = [];

        if (currentRole === 'admin') {
            header.textContent = 'System Activity (Admin)';
            notifs = [
                { icon: '⚠️', title: 'New User Registration', desc: 'John Doe (CS 22) requires verification.', time: '10 mins ago', color: 'var(--warning)' },
                { icon: '💰', title: 'Donation Received', desc: '₹15,000 received for Scholarship Fund.', time: '1 hour ago', color: 'var(--success)' },
                { icon: '💼', title: 'Job Posted', desc: 'Senior SDE at Google posted by Rajesh Kumar.', time: '3 hours ago', color: 'var(--primary)' },
                { icon: '🎫', title: 'Event Registration', desc: '45 new registrations for Alumni Meet 2026.', time: '5 hours ago', color: 'var(--accent)' },
                { icon: '🚨', title: 'System Alert', desc: 'Database backup completed successfully.', time: '1 day ago', color: 'var(--text-muted)' },
                { icon: '🤝', title: 'Mentorship Matched', desc: 'Priya Sharma accepted Jane Student request.', time: '1 day ago', color: 'var(--primary)' }
            ];
        } else {
            header.textContent = 'Your Notifications';
            notifs = [
                { icon: '🔔', title: 'Welcome!', desc: 'Welcome to Alumni Connect.', time: 'Just now', color: 'var(--primary)' },
                { icon: '📅', title: 'Event Reminder', desc: 'Tech Talk starts tomorrow!', time: '2 hours ago', color: 'var(--accent)' },
                { icon: '💼', title: 'Job Alert', desc: 'New Software Engineer role matches your profile.', time: '1 day ago', color: 'var(--success)' }
            ];
        }

        let htmlStr = '<div class="activity-list">';
        notifs.forEach(n => {
            htmlStr += `
            <div class="activity-item" style="box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 12px; border: 1px solid rgba(0,0,0,0.05);">
              <div class="activity-icon" style="background: ${n.color}; color: white;">${n.icon}</div>
              <div class="activity-content">
                <div class="activity-text" style="font-weight: 600;">${n.title}</div>
                <div class="activity-text" style="font-size: 0.8rem; color: var(--text-muted);">${n.desc}</div>
                <div class="activity-time" style="margin-top: 4px;">${n.time}</div>
              </div>
            </div>
            `;
        });
        htmlStr += '</div>';

        content.innerHTML = htmlStr;
    }
};

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
        chatMessages.innerHTML = `
            <div style="background: var(--bg-subtle); color: var(--text-main); padding: 10px; border-radius: 10px; border-bottom-left-radius: 0; align-self: flex-start; max-width: 80%;">
                Hi! I'm your AI assistant. How can I help you today?
            </div>
        `;
    }

    // 4. Reset Action Buttons color and state (from Green back to Default)
    document.querySelectorAll('.btn-apply, .btn-request, .btn-register').forEach(btn => {
        // We only reset successful buttons
        if (btn.style.pointerEvents === 'none') {
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

// ==========================================
// 🛠️ FIX FOR BUTTON INTERACTIVITY
// ==========================================

function bindNormalButtonActions() {
    // Helper to open the new Info modal
    function openInfoModal(title, subtitle, description, confirmText, onConfirm) {
        document.getElementById('info-title').innerHTML = title;
        document.getElementById('info-subtitle').innerHTML = subtitle;
        document.getElementById('info-description').innerHTML = description;

        const confirmBtn = document.getElementById('info-confirm-btn');
        confirmBtn.textContent = confirmText;

        // Remove previous listeners using replacement clone trick
        const newBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);

        newBtn.onclick = function () {
            document.getElementById('info-modal').style.display = 'none';
            onConfirm();
        };

        document.getElementById('info-modal').style.display = 'flex';
    }

    // 1. Re-bind Apply buttons
    document.querySelectorAll('.btn-apply').forEach(btn => {
        // Skip over already-applied ones
        if (btn.textContent.includes('✓')) return;

        btn.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();

            const card = this.parentElement;
            const jobTitleEl = card.querySelector('.job-title');
            const jobTitle = jobTitleEl ? jobTitleEl.textContent.trim() : 'Job Position';

            // Admin / Alumni who posted: show View Applicants modal
            if (currentRole === 'admin' || btn.textContent.includes('View Applicants') || btn.textContent.includes('Applicants')) {
                showAdminRegistrations(jobTitle);
                return;
            }

            // Safe extraction of optional text
            const companyEl = card.querySelector('.job-company');
            const company = companyEl ? companyEl.textContent : 'Top Tech Company';

            const metaContainer = card.querySelector('.job-meta');
            const metaHtml = metaContainer ? metaContainer.innerHTML : '';

            const postedEl = card.querySelector('.job-posted');
            const posted = postedEl ? postedEl.textContent : 'Recently posted';

            const desc = `
                <strong>Role Overview:</strong><br>
                We are actively looking for a talented ${jobTitle} to join our team at ${company}.
                <br><br>
                <div style="font-weight:600; font-size:0.75rem;">${metaHtml}</div>
                <br>
                <em>${posted}</em>
            `;

            openInfoModal('💼 ' + jobTitle, company, desc, 'Confirm Application', () => {
                showActionModal('apply', jobTitle);
                this.textContent = 'Applied ✓';
                this.style.background = 'var(--success)';
                this.style.pointerEvents = 'none';
            });
        };
    });



    // Safe extraction of optional text
    const companyEl = card.querySelector('.job-company');
    const company = companyEl ? companyEl.textContent : 'Top Tech Company';

    const metaContainer = card.querySelector('.job-meta');
    const metaHtml = metaContainer ? metaContainer.innerHTML : '';

    const postedEl = card.querySelector('.job-posted');
    const posted = postedEl ? postedEl.textContent : 'Recently posted';


// 2. Re-bind Register buttons (for Events)
document.querySelectorAll('.btn-register').forEach(btn => {
    // Skip over Admin, Donate Buttons, or already registered ones
    if (btn.textContent.includes('Registrations') || btn.textContent.includes('Donate') || btn.textContent.includes('✓')) return;

    btn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (currentRole === 'admin') {
            const title = this.parentElement.querySelector('.event-title').textContent;
            showAdminRegistrations(title);
            return;
        }

        const card = this.parentElement;
        const eventTitle = card.querySelector('.event-title').textContent;

        const detailsContainer = card.querySelector('.event-details');
        const detailsHtml = detailsContainer ? detailsContainer.innerHTML : '';

        const desc = `
                <strong>Event Highlights:</strong><br>
                Join fellow alumni and students for an engaging networking session and keynote speech regarding "${eventTitle}". Don't miss out on connecting with peers!
                <br><br>
                <div style="font-weight:600; font-size:0.75rem;">${detailsHtml}</div>
                <br>
                <span style="color:var(--primary); font-size:0.75rem; font-weight:bold;">✨ Includes Networking & Snacks</span>
            `;

        openInfoModal('🎟️ ' + eventTitle, 'Official Campus Event', desc, 'Confirm Registration', () => {
            showActionModal('register', eventTitle);
            this.textContent = 'Registered ✓';
            this.style.background = 'var(--success)';
            this.style.pointerEvents = 'none';
        });
    };
});
}

// Ensure the bindings happen every single time someone logs in!
const originalLoginForFix = loginUser;
loginUser = function () {
    if (typeof originalLoginForFix === 'function') originalLoginForFix();

    // In case Admin overrode the onclicks before, let's rigidly re-bind them with robust Role-aware logic.
    bindNormalButtonActions();
};

// Also invoke immediately in case it's lingering
bindNormalButtonActions();

// ==========================================
// 📝 NEW REGISTRATION FLOW
// ==========================================
let currentRegRole = 'alumni';

function selectRegRole(role) {
    currentRegRole = role;
    document.getElementById('reg-role-alumni').classList.remove('active');
    document.getElementById('reg-role-student').classList.remove('active');
    document.getElementById('reg-role-' + role).classList.add('active');
}

// Global array to hold pending registrations dynamically
window.pendingRegistrations = [];

function submitRegistration() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const year = document.getElementById('reg-year').value;
    const dept = document.getElementById('reg-dept').value;
    const password = document.getElementById('reg-password').value;

    if (!name || !email || !password || !year || !dept) {
        alert("Please fill in all details to submit your application.");
        return;
    }

    // Save to pending mock database
    window.pendingRegistrations.unshift({
        name: name,
        email: email,
        role: currentRegRole,
        meta: `${dept.toUpperCase()} '${year.slice(-2)} • Verification Pending`
    });

    // Show success popup with instructions
    document.getElementById('modal-icon').textContent = '🛡️';
    document.getElementById('modal-title').textContent = 'Application Pending';
    document.getElementById('modal-desc').textContent = `Your registration request has been submitted securely. You will receive an email once an Administrator has verified and approved your account. You cannot log in until then.`;

    const popup = document.getElementById('action-modal');
    popup.style.display = 'flex';

    // Override the "Awesome!" button temporarily to send them back to login
    const popupBtn = popup.querySelector('.btn-primary');
    const oldOnclick = popupBtn.onclick;

    popupBtn.onclick = function () {
        popup.style.display = 'none';
        showScreen('login');

        // Clear inputs
        document.getElementById('reg-name').value = '';
        document.getElementById('reg-email').value = '';
        document.getElementById('reg-year').value = '';
        document.getElementById('reg-dept').value = '';
        document.getElementById('reg-password').value = '';

        // Restore old popup onclick
        popupBtn.onclick = oldOnclick;
    };
}

// Intercept Admin Login to inject dynamic pending registrations
const originalLoginForRegistration = loginUser;
loginUser = function () {
    if (typeof originalLoginForRegistration === 'function') originalLoginForRegistration();

    if (currentRole === 'admin') {
        const alumniList = document.querySelector('.alumni-list');
        if (alumniList && window.pendingRegistrations) {
            // First, see if we already injected dynamic ones. Remove them if so (to avoid duplicates on relogin)
            document.querySelectorAll('.dynamic-pending').forEach(el => el.remove());

            // Generate HTML for each pending user
            let injectHtml = '';
            window.pendingRegistrations.forEach(user => {
                const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                injectHtml += `
                <div class="alumni-card dynamic-pending" style="border-left: 4px solid var(--warning);">
                  <div class="alumni-avatar" style="background: linear-gradient(135deg, var(--warning), #f59e0b);">${initials}</div>
                  <div class="alumni-info">
                    <div class="alumni-name">${user.name} <span style="font-size:0.6rem; background: #eee; padding: 2px 5px; border-radius: 4px; margin-left: 5px;">${user.role.toUpperCase()}</span></div>
                    <div class="alumni-meta">${user.meta}</div>
                  </div>
                  <button class="btn-connect" style="background: var(--success);" onclick="
                    this.textContent='Approved'; 
                    this.parentElement.style.opacity='0.6'; 
                    this.style.pointerEvents='none';
                    alert('${user.name} has been approved and notified!');
                  ">Approve</button>
                </div>
                `;
            });

            // Prepend new mock applications to the static "John Doe" one
            alumniList.innerHTML = injectHtml + alumniList.innerHTML;

            // Update the pending count stat
            const pendingCountEl = document.querySelector('.stat-card .stat-value');
            if (pendingCountEl) {
                pendingCountEl.textContent = 23 + window.pendingRegistrations.length;
            }
        }
    }
};

// ==========================================
// 🏢 ADMIN JOBS & MENTORSHIP VIEW
// ==========================================

const originalLoginForAdminJobs = loginUser;
loginUser = function () {
    if (typeof originalLoginForAdminJobs === 'function') originalLoginForAdminJobs();

    if (currentRole === 'admin') {
        // Unhide Job Apply buttons and change them
        const jobCards = document.querySelectorAll('.job-card');
        jobCards.forEach(card => {
            const btn = card.querySelector('.btn-apply');
            if (btn) {
                btn.style.display = 'block';
                btn.textContent = 'View Applicants';
                btn.style.background = '#475569'; // distinctive gray-blue color
                btn.style.pointerEvents = 'auto'; // ensure clickable

                btn.onclick = function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const title = card.querySelector('.job-title').textContent + ' (Applicants)';
                    showAdminRegistrations(title);
                };
            }
        });

        // Unhide Mentor Request buttons and change them
        const mentorCards = document.querySelectorAll('.mentor-card');
        mentorCards.forEach(card => {
            const btn = card.querySelector('.btn-request');
            if (btn) {
                btn.style.display = 'block';
                btn.textContent = 'View Requests';
                btn.style.background = '#475569';
                btn.style.pointerEvents = 'auto'; // ensure clickable

                btn.onclick = function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const title = card.querySelector('.mentor-name').textContent + ' (Requests)';
                    showAdminRegistrations(title);
                };
            }
        });

        // Ensure Event Register buttons are visible and clickable for Admin
        const eventCards = document.querySelectorAll('.event-card');
        eventCards.forEach(card => {
            const btn = card.querySelector('.btn-register');
            if (btn && !btn.textContent.includes('Donate')) {
                btn.style.display = 'block';
                btn.textContent = 'View Registrations';
                btn.style.background = '#475569';
                btn.style.pointerEvents = 'auto'; // ensure clickable

                btn.onclick = function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const title = card.querySelector('.event-title').textContent + ' (Registrations)';
                    showAdminRegistrations(title);
                };
            }
        });
    }
};

// Update Modal dynamically to handle different entities gracefully
const _originalShowAdminReg = showAdminRegistrations;
showAdminRegistrations = function (title) {
    _originalShowAdminReg(title);

    // Modify modal title header slightly to reflect it's not JUST events anymore
    const regModalHeading = document.getElementById('reg-event-title');
    if (regModalHeading) {
        // Change from 'Event Registrations' to dynamic
        if (title.includes('Applicants')) {
            regModalHeading.innerHTML = '👩‍💻 ' + title;
        } else if (title.includes('Requests')) {
            regModalHeading.innerHTML = '🤝 ' + title;
        } else {
            regModalHeading.innerHTML = '🎟️ ' + title;
        }
    }
};


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
        for (let i = 0; i < categorySelect.options.length; i++) {
            if (categorySelect.options[i].value === fundName) {
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
    const amountStr = document.getElementById('donate-amount').value;
    const category = document.getElementById('donate-category').value;

    if (!amountStr || parseInt(amountStr) <= 0) {
        alert("Please enter a valid donation amount.");
        return;
    }

    // Close the details modal to show Razorpay smoothly
    document.getElementById('donate-modal').style.display = 'none';

    // Amount in Paisa for Razorpay (multiply by 100)
    const amountPaisa = parseInt(amountStr) * 100;

    // Dummy / Sandbox Razorpay Options
    var options = {
        "key": "rzp_test_1DP5mmOlF5G5ag", // Dummy test key format for UI rendering
        "amount": amountPaisa,
        "currency": "INR",
        "name": "Alumni Connect",
        "description": "Donation for " + category,
        "image": "https://cdn-icons-png.flaticon.com/512/3003/3003554.png", // Demo Graduation Hat Logo
        "handler": function (response) {
            // This runs if payment is "successful" (Dummy success in Sandbox)

            // Show our custom success modal
            const modal = document.getElementById('action-modal');
            document.getElementById('modal-icon').textContent = '❤️';
            document.getElementById('modal-title').textContent = 'Payment Successful!';
            document.getElementById('modal-desc').innerHTML = `Your donation of ₹${amountStr} to the "${category}" has been successfully processed via Razorpay.<br><br><b>Payment ID:</b> ${response.razorpay_payment_id}.<br>A receipt has been sent to your email.`;

            modal.style.display = 'flex';

            // Change the original button visually
            if (activeDonationButton) {
                activeDonationButton.textContent = 'Donated ✓';
                activeDonationButton.style.background = 'var(--success)';
                activeDonationButton.style.pointerEvents = 'none';
                activeDonationButton = null; // reset
            }
        },
        "prefill": {
            "name": "John Alumnus",
            "email": "alumni@edu.in",
            "contact": "9999999999"
        },
        "notes": {
            "address": "Alumni Connect Platform"
        },
        "theme": {
            "color": "#0055ff"
        },
        "modal": {
            "ondismiss": function () {
                console.log('Payment modal closed');
                // You could show a cancelled toast message here
            }
        }
    };

    try {
        var rzp1 = new Razorpay(options);
        rzp1.on('payment.failed', function (response) {
            alert("Payment Failed: " + response.error.description);
        });
        rzp1.open();
    } catch (e) {
        alert("Razorpay is not loaded or key is invalid.");
        console.error(e);
    }
}



// ==========================================
// 🔗 CONNECT BUTTON LOGIC
// ==========================================
function bindConnectButtons() {
    document.querySelectorAll('.btn-connect').forEach(btn => {
        // Skip over the ones in the Admin panel that are used for approvals
        if (btn.textContent.includes('Approve')) return;

        btn.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (currentRole === 'admin') return;

            const alumniName = this.parentElement.querySelector('.alumni-name').textContent;

            // Show custom success modal
            const modal = document.getElementById('action-modal');
            document.getElementById('modal-icon').textContent = '🤝';
            document.getElementById('modal-title').textContent = 'Connection Request Sent!';
            document.getElementById('modal-desc').textContent = `You have sent a connection request to ${alumniName}. We will let you know when they accept.`;

            modal.style.display = 'flex';

            this.textContent = 'Pending';
            this.style.background = 'var(--text-muted)';
            this.style.pointerEvents = 'none';
        };
    });
}

const originalLoginForConnect = loginUser;
loginUser = function () {
    if (typeof originalLoginForConnect === 'function') originalLoginForConnect();
    bindConnectButtons();
};

// Also invoke immediately in case it's already rendered
bindConnectButtons();

// ==========================================
// 🎓 STUDENT MENTOR VIEW LOGIC
// ==========================================
const originalLoginForStudentMentors = loginUser;
loginUser = function () {
    if (typeof originalLoginForStudentMentors === 'function') originalLoginForStudentMentors();

    const studentMentorsSec = document.getElementById('student-mentors-section');
    if (studentMentorsSec) {
        if (currentRole === 'student') {
            studentMentorsSec.style.display = 'block';
        } else {
            studentMentorsSec.style.display = 'none';
        }
    }
};

// ==========================================
// 🚀 DEMO AUTO-LOGIN LOGIC
// ==========================================
function demoLogin(role, email) {
    // 1. Select the right role tab automatically
    document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
    const targetBtn = document.querySelector(`.role-btn[data-role="${role}"]`);
    if (targetBtn) targetBtn.classList.add('active');

    // Set the global currentRole variable
    window.currentRole = role;

    // 2. Fill in the email and password fields implicitly to look like they typed it
    const emailInput = document.getElementById('email-input');
    const passInput = document.getElementById('password-input');

    if (emailInput) emailInput.value = email;
    if (passInput) passInput.value = '123456';

    // 3. Trigger the main login function to log them in securely
    loginUser();
}

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

    if (!topic || !date || !time) {
        alert("Please provide the topic, date, and time.");
        return;
    }

    document.getElementById('meeting-modal').style.display = 'none';

    // Show success popup
    const modal = document.getElementById('action-modal');
    document.getElementById('modal-icon').textContent = '📅';
    document.getElementById('modal-title').textContent = 'Meeting Scheduled!';
    document.getElementById('modal-desc').textContent = `Your meeting "${topic}" on ${date} at ${time} has been sent. The student will receive an email invite.`;

    modal.style.display = 'flex';
}

function openMessageModal(menteeName) {
    document.getElementById('msg-mentee-name').textContent = 'To: ' + menteeName;
    document.getElementById('msg-content').value = '';

    document.getElementById('message-modal').style.display = 'flex';
}

function confirmMessage() {
    const content = document.getElementById('msg-content').value;

    if (!content) {
        alert("Please write a message to send.");
        return;
    }

    document.getElementById('message-modal').style.display = 'none';

    // Show success popup
    const modal = document.getElementById('action-modal');
    document.getElementById('modal-icon').textContent = '✉️';
    document.getElementById('modal-title').textContent = 'Message Sent!';
    document.getElementById('modal-desc').textContent = `Your message has been delivered to the student's inbox securely.`;

    modal.style.display = 'flex';
}


function setMsgOption(text) {
    const msgBox = document.getElementById('msg-content');
    if (msgBox) msgBox.value = text;
}


// ==========================================
// 💼 ALUMNI / ADMIN POST JOB LOGIC
// ==========================================
function submitNewJob() {
    const title = document.getElementById('post-job-title').value;
    const company = document.getElementById('post-job-company').value;
    const location = document.getElementById('post-job-location').value;
    const salary = document.getElementById('post-job-salary').value;
    const isReferral = document.getElementById('post-job-referral').checked;

    if (!title || !company || !location || !salary) {
        alert("Please fill in all details for the job post.");
        return;
    }

    // Close modal
    document.getElementById('post-job-modal').style.display = 'none';

    // Create new job card dynamically
    const jobList = document.querySelector('.job-list');
    const newCard = document.createElement('div');
    newCard.className = 'job-card';

    const referralHtml = isReferral ? '<div class="job-referral">✓ Referral</div>' : '';
    const nameStr = (currentRole === 'admin') ? 'Administrator' : 'You (Alumni)';
    const applyBtnHtml = (currentRole === 'admin')
        ? '<button class="btn-apply" style="display: block; background: rgb(71, 85, 105); pointer-events: auto;">View Applicants</button>'
        : '<button class="btn-apply" style="display: block;">View Applicants</button>';

    newCard.innerHTML = `
      <div class="job-header">
        <div class="job-title">${title}</div>
        ${referralHtml}
      </div>
      <div class="job-company">${company}</div>
      <div class="job-meta">
        <span>📍 ${location}</span>
        <span>💰 ${salary}</span>
      </div>
      <div class="job-posted">Posted by ${nameStr} • Just now</div>
      ${applyBtnHtml}
    `;

    // Append to top of list
    jobList.insertBefore(newCard, jobList.firstChild);

    // Clear the form
    document.getElementById('post-job-title').value = '';
    document.getElementById('post-job-company').value = '';
    document.getElementById('post-job-location').value = '';
    document.getElementById('post-job-salary').value = '';
    document.getElementById('post-job-referral').checked = false;

    // Re-bind the View Applicants logic if it's admin/alumni to view stats
    bindNormalButtonActions();

    // Show success popup
    const modal = document.getElementById('action-modal');
    document.getElementById('modal-icon').textContent = '✅';
    document.getElementById('modal-title').textContent = 'Job Posted!';
    document.getElementById('modal-desc').textContent = 'Your job listing is now live on the portal. Students will be able to apply and request referrals immediately.';
    modal.style.display = 'flex';
}

const originalLoginForPostJob = loginUser;
loginUser = function () {
    if (typeof originalLoginForPostJob === 'function') originalLoginForPostJob();

    const postJobBtn = document.getElementById('post-job-btn');
    if (postJobBtn) {
        if (currentRole === 'alumni' || currentRole === 'admin') {
            postJobBtn.style.display = 'block';
        } else {
            postJobBtn.style.display = 'none';
        }
    }
};


// ==========================================
// 💸 ADMIN DONORS VIEW LOGIC
// ==========================================
const originalLoginForAdminDonors = loginUser;
loginUser = function () {
    if (typeof originalLoginForAdminDonors === 'function') originalLoginForAdminDonors();

    const adminDonorsSec = document.getElementById('admin-donors-section');
    const donateButtons = document.querySelectorAll('#donations .event-card button');

    if (currentRole === 'admin') {
        if (adminDonorsSec) adminDonorsSec.style.display = 'none'; // Hidden initially now

        donateButtons.forEach(btn => {
            if (btn.textContent.includes('Donate Now') || btn.textContent.includes('Recent Donations')) {
                btn.textContent = '📊 Recent Donations';
                btn.style.background = 'var(--bg-subtle)';
                btn.style.color = 'var(--text-main)';
                btn.style.border = '1px solid var(--border-light)';

                // Clicking "Recent Donations" now toggles the timeline Section
                btn.onclick = function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (adminDonorsSec) {
                        if (adminDonorsSec.style.display === 'none') {
                            adminDonorsSec.style.display = 'block';
                            adminDonorsSec.scrollIntoView({ behavior: 'smooth' });
                            btn.style.background = 'var(--accent)';
                            btn.style.color = '#000';
                        } else {
                            adminDonorsSec.style.display = 'none';
                            btn.style.background = 'var(--bg-subtle)';
                            btn.style.color = 'var(--text-main)';
                        }
                    }
                };
            }
        });
    } else {
        if (adminDonorsSec) adminDonorsSec.style.display = 'none';

        // Restore standard Donate Now button for Students/Alumni
        donateButtons.forEach(btn => {
            if (btn.textContent.includes('Recent Donations') || btn.textContent.includes('Donate Now')) {
                btn.textContent = '❤️ Donate Now';
                btn.style.background = 'var(--accent)';
                btn.style.color = '#000';
                btn.style.border = 'none';
                btn.onclick = function () { handleDonation(this, 'Scholarship Fund'); };
            }
        });
    }
};


// ==========================================
// 📋 VIEW APPLICANTS DATA LOGIC
// ==========================================

const applicantsDb = {
    default: [
        { initials: 'JD', name: 'John Doe', meta: 'CS Batch 22 • Applied 2h ago', status: 'Under Review', statusColor: 'var(--warning) ' },
        { initials: 'PS', name: 'Priya Sharma', meta: 'EE Batch 17 • Applied 1d ago', status: 'Shortlisted', statusColor: 'var(--success) ' },
        { initials: 'RK', name: 'Rahul Kapoor', meta: 'CS Batch 20 • Applied 2d ago', status: 'Under Review', statusColor: 'var(--warning) ' },
        { initials: 'AN', name: 'Anjali Nair', meta: 'IT Batch 21 • Applied 3d ago', status: 'Rejected', statusColor: 'var(--danger) ' },
        { initials: 'SM', name: 'Siddharth More', meta: 'ME Batch 23 • Applied 4d ago', status: 'Under Review', statusColor: 'var(--warning) ' },
    ],
    'Senior Software Engineer': [
        { initials: 'AK', name: 'Aryan Kumar', meta: 'CS Batch 21 • 3 YOE • Applied Today', status: 'Shortlisted', statusColor: 'var(--success) ' },
        { initials: 'NS', name: 'Neha Singh', meta: 'CS Batch 20 • 4 YOE • Applied Yesterday', status: 'Under Review', statusColor: 'var(--warning) ' },
        { initials: 'VP', name: 'Vikas Pandey', meta: 'CE Batch 22 • 2 YOE • Applied 2d ago', status: 'Shortlisted', statusColor: 'var(--success) ' },
        { initials: 'RJ', name: 'Ritu Jain', meta: 'IT Batch 19 • 5 YOE • Applied 3d ago', status: 'Under Review', statusColor: 'var(--warning) ' },
        { initials: 'MD', name: 'Manish Desai', meta: 'CS Batch 18 • 6 YOE • Applied 4d ago', status: 'Rejected', statusColor: 'var(--danger) ' },
    ],
    'Product Manager': [
        { initials: 'PK', name: 'Pooja Krishnan', meta: 'MBA Batch 20 • 3 YOE • Applied Today', status: 'Shortlisted', statusColor: 'var(--success) ' },
        { initials: 'AS', name: 'Arjun Shah', meta: 'CS Batch 19 • 5 YOE • Applied Yesterday', status: 'Under Review', statusColor: 'var(--warning) ' },
        { initials: 'DM', name: 'Deepika Menon', meta: 'EE Batch 21 • 3 YOE • Applied 2d ago', status: 'Under Review', statusColor: 'var(--warning) ' },
    ],
    'Data Scientist Intern': [
        { initials: 'KP', name: 'Karan Patel', meta: 'CS Batch 25(Final Year) • Applied Today', status: 'Under Review', statusColor: 'var(--warning) ' },
        { initials: 'SA', name: 'Shreya Agarwal', meta: 'DS Batch 25(Final Year) • Applied Yesterday', status: 'Shortlisted', statusColor: 'var(--success) ' },
        { initials: 'TN', name: 'Tejas Naik', meta: 'CS Batch 26(3rd Year) • Applied 2d ago', status: 'Under Review', statusColor: 'var(--warning) ' },
        { initials: 'PM', name: 'Preethi Mohan', meta: 'IT Batch 25(Final Year) • Applied 3d ago', status: 'Rejected', statusColor: 'var(--danger) ' },
    ]
};

const _enhancedShowAdminReg = showAdminRegistrations;
showAdminRegistrations = function (title) {
    // Set modal title
    const titleEl = document.getElementById('reg-event-title');
    const bodyEl = document.getElementById('admin-modal-body');

    if (!titleEl || !bodyEl) {
        _enhancedShowAdminReg(title);
        return;
    }

    // Build contextual title
    let icon = '🎟️';
    if (title.toLowerCase().includes('job') || title.toLowerCase().includes('engineer') || title.toLowerCase().includes('manager') || title.toLowerCase().includes('intern') || title.toLowerCase().includes('scientist') || title.toLowerCase().includes('applicants')) {
        icon = '💼';
    } else if (title.toLowerCase().includes('mentor') || title.toLowerCase().includes('request')) {
        icon = '🤝';
    }
    titleEl.innerHTML = icon + ' ' + title;

    // Choose applicant data
    let applicants = applicantsDb[title] || applicantsDb['default'];

    // Build applicant rows
    bodyEl.innerHTML = applicants.map(a => `
        <div style="display: flex; align-items: center; gap: 12px; padding: 10px; background: var(--bg-surface); border-radius: 12px; border: 1px solid var(--border-light);">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), #0055ff); color: white; font-weight: bold; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                ${a.initials}
            </div>
            <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-main);">${a.name}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${a.meta}</div>
            </div>
            <span style="font-size: 0.7rem; font-weight: 600; color: white; background: ${a.statusColor}; padding: 3px 8px; border-radius: 20px; white-space: nowrap; flex-shrink: 0;">${a.status}</span>
        </div>
    `).join('');

    // Also add a summary line
    const shortlisted = applicants.filter(a => a.status === 'Shortlisted').length;
    const summary = document.createElement('div');
    summary.style.cssText = 'font-size: 0.8rem; color: var(--text-muted); padding: 8px 12px; background: var(--bg-subtle); border-radius: 8px; margin-top: 5px; border: 1px solid var(--border-light);';
    summary.innerHTML = `📊 <strong>${applicants.length}</strong> total applicants &nbsp;|&nbsp; <strong style="color: var(--success);">${shortlisted} shortlisted</strong>`;
    bodyEl.appendChild(summary);

    document.getElementById('admin-registrations-modal').style.display = 'flex';
};
