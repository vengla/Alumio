# 🎓 ALUMIO Platform - Demo Overview

## Platform Information
**Name:** ALUMIO  
**Institution:** SRM Valliammai Engineering College  
**Type:** Alumni Association Platform  
**Tech Stack:** Next.js (Frontend) + Node.js/Express (Backend)  
**Current Mode:** Offline/Mock Demo Mode

---

## 🌟 Key Features Overview

### 1️⃣ **Landing Page**
- Modern, professional design with gradient hero section
- Key features showcase:
  - Alumni Directory (12,000+ active alumni)
  - Mentorship Hub
  - Job & Internship Portal
  - Events & Reunions
  - Donation Platform
  - Success Stories

**Access:** http://localhost:3000

---

### 2️⃣ **Authentication System**
- **Login Credentials (Demo):**
  - Admin: `admin@alumni.edu` / `admin123`
  - Alumni: `john.doe@gmail.com` / `password123`
  - Student: `student1@college.edu` / `password123`

- **Features:**
  - JWT-based authentication
  - Role-based access control (Admin, Alumni, Student)
  - Session management
  - Auto-approval for demo users

---

### 3️⃣ **Dashboard (Role-Based)**

#### 📊 **Admin Dashboard**
- **Statistics:**
  - Total Alumni: 12,348
  - Pending Approvals: 23
  - Active Jobs: 127
  - Funds Raised: ₹2.5Cr

- **Quick Actions:**
  - Approve Users
  - Manage Jobs
  - View Analytics
  - Create Events

#### 🎓 **Alumni Dashboard**
- **Statistics:**
  - My Network: 145 connections
  - Active Mentees: 3
  - Job Posts: 2
  - Total Donations: ₹25,000

- **Quick Actions:**
  - Post a Job
  - Make Donation
  - Update Profile
  - Browse Directory

#### 👨‍🎓 **Student Dashboard**
- **Statistics:**
  - Mentors: 2
  - Job Applications: 5
  - Events Registered: 3
  - Network Size: 42

- **Quick Actions:**
  - My Profile
  - Find Mentor
  - Browse Jobs
  - Join Events

---

### 4️⃣ **Jobs & Internships Portal**

**Current Listings (6 Jobs):**
1. **Senior Software Engineer** - Google (Bangalore) - 25-35 LPA
2. **Product Manager** - Microsoft (Hyderabad) - 30-40 LPA
3. **Frontend Developer** - Amazon (Chennai) - 18-28 LPA
4. **Data Scientist** - Netflix (Remote) - 40-60 LPA
5. **UI/UX Designer Intern** - Adobe (Bangalore) - 30k-50k/Month
6. **Marketing Specialist** - Spotify (Mumbai) - 15-22 LPA

**Features:**
- ✅ Job search and filtering
- ✅ One-click apply/cancel
- ✅ View applicants (for job posters)
- ✅ Post new jobs (Alumni/Admin only)
- ✅ Application status tracking

---

### 5️⃣ **Events Management**

**Upcoming Events (3):**
1. **Alumni Reunion 2026** - University Auditorium (500 capacity)
2. **CSE Tech Workshop** - Lab 3, CS Block (50 capacity)
3. **Mechanical Symposium** - Mech Seminar Hall (100 capacity)

**Features:**
- ✅ Event registration/cancellation
- ✅ View attendee lists
- ✅ Department-specific filtering
- ✅ Create events (Admin only)
- ✅ Event reminders

---

### 6️⃣ **Alumni Directory**

**User Base:**
- 4 users in demo (mix of Alumni, Students, Admin)
- Searchable by name, department, batch
- Filter by department and batch year

**Features:**
- ✅ Profile viewing
- ✅ Connection requests
- ✅ LinkedIn integration
- ✅ Mentor availability status
- ✅ Department/batch filtering

---

### 7️⃣ **Mentorship Hub**

**Features:**
- View mentors (Alumni) and mentees (Students)
- Connection request system
- Accept/reject mentorship requests
- Track active mentorship relationships
- Profile viewing

---

### 8️⃣ **Notifications System**

**Features:**
- ✅ Real-time notification badge
- ✅ Connection request notifications
- ✅ Event reminders (7-day advance notice)
- ✅ Department-specific event recommendations
- ✅ Mark as read/unread
- ✅ Auto-notification for upcoming events

---

### 9️⃣ **Donations Module**

**Features:**
- Multiple donation categories:
  - Scholarship Fund
  - Infrastructure Development
  - Research & Innovation
  - Emergency Relief
- Track total donations
- Receipt generation (mock)
- Donation history

---

### 🔟 **Admin Panel**

**Management Features:**
- User approval/rejection
- Platform analytics
- User directory statistics
- Department-wise breakdown
- Batch-wise analytics
- Pending user management

---

## 🎨 Design Highlights

### Visual Features:
- ✨ Modern glassmorphism effects
- 🎨 Gradient backgrounds
- 🌙 Professional color palette (Blue primary)
- 📱 Fully responsive design
- ⚡ Smooth animations and transitions
- 🔔 Interactive notification system

### UI Components:
- Custom card components
- Badge system (roles, status)
- Modal dialogs (job applications, event registration)
- Form validation
- Loading states
- Error handling

---

## 📊 Technical Architecture

### Frontend (Next.js):
```
web/app/
├── page.js (Landing)
├── login/page.js
├── register/page.js
├── dashboard/page.js
├── jobs/page.js
├── events/page.js
├── directory/page.js
├── mentorship/page.js
├── notifications/page.js
├── donations/page.js
├── admin/page.js
└── components/
    ├── AuthProvider.js
    └── ChatBot.js
```

### Backend (Node.js/Express):
```
backend/
├── server.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── jobRoutes.js
│   ├── eventRoutes.js
│   └── chatRoutes.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── jobController.js
│   ├── eventController.js
│   └── mockController.js (Offline mode)
├── models/
│   ├── User.js
│   ├── Job.js
│   └── Event.js
└── middleware/
    └── auth.js
```

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password encryption (bcrypt)
- ✅ Role-based authorization
- ✅ Protected routes
- ✅ Session management
- ✅ CORS configuration

---

## 🚀 Quick Start Guide

### 1. Start Backend:
```bash
cd backend
npm run dev
```
**Backend runs on:** http://localhost:5000

### 2. Start Frontend:
```bash
cd web
npm run dev
```
**Frontend runs on:** http://localhost:3000

### 3. Login:
- Navigate to http://localhost:3000
- Click "Login"
- Use demo credentials (see Authentication section above)

---

## 📝 Demo Accounts Summary

| Role | Email | Password | Use Case |
|------|-------|----------|----------|
| Admin | admin@alumni.edu | admin123 | Full platform management |
| Alumni | john.doe@gmail.com | password123 | Post jobs, mentor students |
| Student | student1@college.edu | password123 | Find jobs, connect with alumni |

---

## 🎯 Platform Status

### ✅ Working Features:
- Authentication & Authorization
- Job Portal (Apply/Post/Cancel)
- Events (Register/Cancel/Create)
- Alumni Directory (Browse/Connect)
- Mentorship (Request/Accept)
- Notifications System
- Admin Analytics
- Offline/Mock Mode Support

### 🔧 Platform Mode:
**Current:** Offline/Mock Mode (Database unavailable)
- All data stored in `local_db.json`
- Fully functional without MongoDB
- Automatic fallback system

---

## 📈 Platform Statistics (Demo Data)

- **Total Users:** 4 (1 Admin, 2 Alumni, 1 Student)
- **Active Jobs:** 6 listings
- **Upcoming Events:** 3 events
- **Total Connections:** Mock data in local storage
- **Platform Visits:** Real-time session tracking

---

## 🎥 Feature Demo Flow

### Recommended Demo Path:

1. **Start:** Landing Page → Show features
2. **Login:** Use admin credentials
3. **Dashboard:** Show admin analytics
4. **Jobs:** Browse & view applicants
5. **Events:** View events & attendees
6. **Directory:** Browse alumni profiles
7. **Admin Panel:** Show user management
8. **Notifications:** Check notification system
9. **Logout:** Return to landing page

---

## 🌐 Access URLs

- **Landing Page:** http://localhost:3000
- **Login:** http://localhost:3000/login
- **Dashboard:** http://localhost:3000/dashboard
- **Jobs:** http://localhost:3000/jobs
- **Events:** http://localhost:3000/events
- **Directory:** http://localhost:3000/directory
- **Mentorship:** http://localhost:3000/mentorship
- **Donations:** http://localhost:3000/donations
- **Notifications:** http://localhost:3000/notifications
- **Admin Panel:** http://localhost:3000/admin

---

## 💡 Demo Tips

1. **Login as different roles** to see different dashboards
2. **Apply for jobs** to see the modal system
3. **Register for events** to test registration flow
4. **Send connection requests** in the directory
5. **Check notifications** after performing actions
6. **Use admin panel** to see analytics

---

**ALUMIO** - *Connecting Alumni, Students, and Excellence*
