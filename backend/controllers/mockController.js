import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

const DB_FILE = path.join(process.cwd(), 'local_db.json');

// Initialize DB if not exists
if (!fs.existsSync(DB_FILE)) {
    const initialData = {
        users: [],
        jobs: [
            {
                _id: '1',
                title: 'Senior Software Engineer',
                company: 'Google',
                location: 'Bangalore',
                salary: '25-35 LPA',
                type: 'Full-time',
                description: 'Join our search team.',
                postedBy: { name: 'Rajesh Kumar' }
            },
            {
                _id: '2',
                title: 'Product Manager',
                company: 'Microsoft',
                location: 'Hyderabad',
                salary: '30-40 LPA',
                type: 'Full-time',
                description: 'Lead product initiatives.',
                postedBy: { name: 'Priya Sharma' }
            }
        ],
        events: [
            {
                _id: '101',
                title: 'Alumni Reunion 2026',
                type: 'Reunion',
                startDate: '2026-03-15T10:00:00Z',
                location: { address: 'University Auditorium' },
                capacity: 500,
                department: 'General',
                description: 'Annual grand reunion for all batches.',
                attendees: [],
                isFeatured: true
            },
            {
                _id: '102',
                title: 'CSE Tech Workshop',
                type: 'Workshop',
                startDate: '2026-02-20T14:00:00Z',
                location: { address: 'Lab 3, CS Block' },
                capacity: 50,
                department: 'CSE',
                description: 'Hands-on workshop on AI.',
                attendees: [],
                isFeatured: false
            },
            {
                _id: '103',
                title: 'Mechanical Symposium',
                type: 'Workshop',
                startDate: '2026-02-25T09:00:00Z',
                location: { address: 'Mech Seminar Hall' },
                capacity: 100,
                department: 'MECH',
                description: 'Future of Robotics.',
                attendees: [],
                isFeatured: false
            }
        ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

const getDb = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
const saveDb = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

export const mockLogin = (req, res) => {
    const { email, password } = req.body;
    const db = getDb();

    // Auto-register if not exists in demo mode, or just allow any login for demo
    let user = db.users.find(u => u.email === email);

    if (!user) {
        // Determine role based on email keyword
        let role = 'alumni';
        if (email.includes('admin')) role = 'admin';
        if (email.includes('student')) role = 'student';

        // Create a mock user for the demo
        user = {
            _id: uuidv4(),
            name: role === 'admin' ? 'Administrator' : 'Demo User',
            email,
            password, // In real app, hash this
            role,
            batch: '2024',
            department: 'CSE',
            isApproved: role === 'admin' // Auto-approve admin, others pending
        };
        db.users.push(user);
        saveDb(db);
    }

    if (!user.isApproved && user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Your account is pending approval by an administrator.'
        });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

    res.json({
        success: true,
        data: {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }
    });
};

export const mockGetMe = (req, res) => {
    // Just return the first user or decode token (skipping verification for extreme speed in demo)
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    try {
        const decoded = jwt.decode(token);
        const db = getDb();
        const user = db.users.find(u => u._id === decoded.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            success: true,
            data: user
        });
    } catch (e) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export const mockRegister = (req, res) => {
    const { email, password, name, role } = req.body;
    const db = getDb();

    if (db.users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = {
        _id: uuidv4(),
        name: name || 'New User',
        email,
        password,
        role: role || 'student',
        batch: '2025',
        department: 'CSE',
        isApproved: role === 'admin'
    };

    db.users.push(user);
    saveDb(db);

    // If pending approval, don't send token
    if (!user.isApproved) {
        return res.status(201).json({
            success: true,
            message: 'Registration successful. Please wait for admin approval.',
            data: {
                user
            }
        });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

    res.json({
        success: true,
        data: {
            token,
            user
        }
    });
};

export const mockGetJobs = (req, res) => {
    const db = getDb();
    res.json({
        success: true,
        count: db.jobs.length,
        data: db.jobs
    });
};

export const mockApplyJob = (req, res) => {
    const { jobId, action } = req.body; // action: 'apply' or 'cancel'
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    const decoded = jwt.decode(token);
    const userId = decoded.id;
    const db = getDb();

    const jobIndex = db.jobs.findIndex(j => j._id === jobId);
    if (jobIndex === -1) return res.status(404).json({ message: 'Job not found' });

    // Initialize applicants array if not present
    if (!db.jobs[jobIndex].applicants) {
        db.jobs[jobIndex].applicants = [];
    }

    const user = db.users.find(u => u._id === userId);

    if (action === 'apply') {
        if (!user) return res.status(404).json({ message: 'User profile not found' });

        if (!db.jobs[jobIndex].applicants.some(a => a.userId === userId)) {
            db.jobs[jobIndex].applicants.push({
                userId,
                name: user.name || 'Unknown',
                email: user.email || '',
                appliedAt: new Date().toISOString()
            });
        }
    } else if (action === 'cancel') {
        db.jobs[jobIndex].applicants = db.jobs[jobIndex].applicants.filter(a => a.userId !== userId);
    }

    saveDb(db);

    res.json({
        success: true,
        data: db.jobs[jobIndex]
    });
};

export const mockGetEvents = (req, res) => {
    const db = getDb();
    res.json({
        success: true,
        count: db.events?.length || 0,
        data: db.events || []
    });
};

export const mockRegisterEvent = (req, res) => {
    const { eventId, action } = req.body; // action: 'register' or 'cancel'
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    const decoded = jwt.decode(token);
    const userId = decoded.id;
    const db = getDb();

    const eventIndex = db.events.findIndex(e => e._id === eventId);
    if (eventIndex === -1) return res.status(404).json({ message: 'Event not found' });

    const user = db.users.find(u => u._id === userId);

    if (action === 'register') {
        if (!db.events[eventIndex].attendees.some(a => a.userId === userId)) {
            db.events[eventIndex].attendees.push({
                userId,
                name: user?.name || 'Unknown',
                email: user?.email || '',
                department: user?.department || 'General',
                registeredAt: new Date().toISOString()
            });
        }
    } else if (action === 'cancel') {
        db.events[eventIndex].attendees = db.events[eventIndex].attendees.filter(a => a.userId !== userId);
    }

    saveDb(db);

    res.json({
        success: true,
        data: db.events[eventIndex]
    });
};

export const mockCreateEvent = (req, res) => {
    const { title, type, startDate, location, description, department, capacity } = req.body;
    const db = getDb();

    const newEvent = {
        _id: uuidv4(),
        title,
        type,
        startDate,
        location: { address: location },
        description,
        department,
        capacity: parseInt(capacity) || 100,
        attendees: [],
        isFeatured: false
    };

    db.events.push(newEvent);
    saveDb(db);

    res.json({
        success: true,
        data: newEvent
    });
};

export const mockGetUsers = (req, res) => {
    const db = getDb();
    // Return all users sanitized (no passwords)
    const users = db.users.map(u => {
        const { password, ...user } = u;
        return user;
    });

    res.json({
        success: true,
        count: users.length,
        data: users
    });
};

export const mockGetUserById = (req, res) => {
    const db = getDb();
    const user = db.users.find(u => u._id === req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    const { password, ...sanitizedUser } = user;

    res.json({
        success: true,
        data: sanitizedUser
    });
};

export const mockCreateJob = (req, res) => {
    const { title, company, location, salary, type, description, experience, skills, isRemote } = req.body;
    const db = getDb();
    const token = req.headers.authorization?.split(' ')[1];
    let posterName = 'Alumni User';

    if (token) {
        try {
            const decoded = jwt.decode(token);
            const user = db.users.find(u => u._id === decoded.id);
            if (user) posterName = user.name;
        } catch (e) { }
    }

    const newJob = {
        _id: uuidv4(),
        title,
        company,
        location,
        salary,
        type,
        description,
        isRemote: isRemote === true || isRemote === 'true',
        postedBy: { name: posterName },
        applicants: [],
        createdAt: new Date().toISOString(),
        isApproved: true,
        status: 'active'
    };

    db.jobs.unshift(newJob); // Add to top
    saveDb(db);

    res.status(201).json({
        success: true,
        message: 'Job posted successfully (Mock)',
        data: newJob
    });
};

export const mockGetPendingUsers = (req, res) => {
    const db = getDb();
    const pendingUsers = db.users.filter(u => u.isApproved === false);
    res.json({ success: true, count: pendingUsers.length, data: pendingUsers });
};

export const mockGetDirectoryStats = (req, res) => {
    const db = getDb();
    const stats = {
        totalAlumni: db.users.filter(u => u.role === 'alumni').length,
        totalStudents: db.users.filter(u => u.role === 'student').length,
        mentorsAvailable: db.users.filter(u => u.isMentorAvailable === true).length || 0,
        departmentWise: Object.values(db.users.reduce((acc, user) => {
            const dept = user.department || 'Unknown';
            if (!acc[dept]) acc[dept] = { _id: dept, count: 0 };
            acc[dept].count++;
            return acc;
        }, {})).sort((a, b) => b.count - a.count),
        batchWise: Object.values(db.users.filter(u => u.role === 'alumni').reduce((acc, user) => {
            const batch = user.batch || 'Unknown';
            if (!acc[batch]) acc[batch] = { _id: batch, count: 0 };
            acc[batch].count++;
            return acc;
        }, {})).sort((a, b) => b._id.localeCompare(a._id))
    };
    res.json({ success: true, data: stats });
};

export const mockApproveUser = (req, res) => {
    const db = getDb();
    const userId = req.params.id;
    const userIndex = db.users.findIndex(u => u._id === userId);
    if (userIndex === -1) return res.status(404).json({ success: false, message: 'User not found' });
    db.users[userIndex].isApproved = true;
    saveDb(db);
    res.json({ success: true, message: 'User approved successfully', data: db.users[userIndex] });
};

export const mockRejectUser = (req, res) => {
    const db = getDb();
    const userId = req.params.id;
    const userIndex = db.users.findIndex(u => u._id === userId);
    if (userIndex === -1) return res.status(404).json({ success: false, message: 'User not found' });
    db.users[userIndex].isActive = false;
    saveDb(db);
    res.json({ success: true, message: 'User rejected', data: db.users[userIndex] });
};
