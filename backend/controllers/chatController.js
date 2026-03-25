import Job from '../models/Job.js';
import Event from '../models/Event.js';
import fs from 'fs';
import path from 'path';

// Helper for offline mode data access
const getLocalDb = () => {
    try {
        const DB_FILE = path.join(process.cwd(), 'local_db.json');
        if (fs.existsSync(DB_FILE)) {
            return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
        }
    } catch (e) {
        console.error("Error reading local DB:", e);
    }
    return { jobs: [], events: [] };
};

export const chatHandler = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, reply: "Please say something!" });
        }

        const msg = message.toLowerCase();
        let reply = "I'm not sure about that. I can help with Registration, Events, Jobs, Donations, and Mentorship.";

        // --- GREETINGS ---
        if (['hi', 'hello', 'hey', 'greetings'].some(k => msg.includes(k))) {
            reply = "Hello! 👋 I'm your interactive Alumni Assistant. Ask me anything about events, jobs, or how to connect!";
        }

        // --- REGISTRATION ---
        else if (['register', 'signup', 'join', 'account', 'login'].some(k => msg.includes(k))) {
            reply = "🔐 **Registration & Login**:\n- **Students**: Use your College Roll Number.\n- **Alumni**: Register with your Degree & Year.\n- Once registered, wait for admin approval (usually 24-48 hours).";
        }

        // --- EVENTS ---
        else if (['event', 'meet', 'reunion', 'workshop', 'seminar'].some(k => msg.includes(k))) {
            let events = [];

            if (global.OFFLINE_MODE) {
                const db = getLocalDb();
                events = db.events || [];
            } else {
                try {
                    events = await Event.find({ startDate: { $gte: new Date() } }).sort({ startDate: 1 }).limit(3);
                } catch (e) {
                    // Fallback if DB fails
                    const db = getLocalDb();
                    events = db.events || [];
                }
            }

            if (events.length > 0) {
                const eventList = events.map(e => `• **${e.title}**: ${new Date(e.startDate).toDateString()} (${e.type})`).join('\n');
                reply = `📅 **Upcoming Events**:\n${eventList}\n\nCheck the 'Events' tab for more!`;
            } else {
                reply = "📅 There are no upcoming events scheduled right now. Check back later!";
            }
        }

        // --- JOBS ---
        else if (['job', 'career', 'vacancy', 'hiring', 'work', 'place'].some(k => msg.includes(k))) {
            let jobs = [];

            if (global.OFFLINE_MODE) {
                const db = getLocalDb();
                jobs = db.jobs || [];
            } else {
                try {
                    jobs = await Job.find({ isApproved: true }).sort({ createdAt: -1 }).limit(3);
                } catch (e) {
                    const db = getLocalDb();
                    jobs = db.jobs || [];
                }
            }

            if (jobs.length > 0) {
                const jobList = jobs.map(j => `• **${j.title}** at ${j.company} (${j.location})`).join('\n');
                reply = `💼 **Latest Job Openings**:\n${jobList}\n\nApply via the 'Jobs' section!`;
            } else {
                reply = "💼 No active job listings found at the moment.";
            }
        }

        // --- DONATIONS ---
        else if (['donate', 'give', 'fund', 'charity', 'support'].some(k => msg.includes(k))) {
            reply = "❤️ **Support Your Alma Mater**:\nYou can contribute to:\n- 🎓 Student Scholarships\n- 🏗️ Campus Infrastructure\n- 🔬 Research Grants\n\nVisit the **Donation** page to make a secure contribution.";
        }

        // --- MENTORSHIP ---
        else if (['mentor', 'guide', 'advice', 'help', 'connect'].some(k => msg.includes(k))) {
            reply = "🤝 **Mentorship Program**:\nConnect with successful alumni for career guidance.\n- Go to **Directory**\n- Filter by 'Available for Mentorship'\n- Request a session!";
        }

        res.json({ success: true, reply });

    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({ success: false, reply: "Sorry, I encountered an error accessing the database." });
    }
};
