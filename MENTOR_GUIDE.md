# 🎓 How to Add and Manage Mentors in ALUMIO

## Overview
ALUMIO uses a **connection-based mentorship system** where alumni serve as mentors to students through direct connections.

---

## ✅ New Mentors Added (Just Now!)

I've added **4 new mentor alumni** to the platform:

### 1. **Rajesh Kumar**
- Email: `rajesh.kumar@gmail.com`
- Password: `password123`
- Batch: 2020 | Dept: CSE
- Role: Senior Software Engineer @ Google
- Location: Bangalore
- **Mentor Available: ✅**

### 2. **Priya Sharma**
- Email: `priya.sharma@gmail.com`
- Password: `password123`
- Batch: 2019 | Dept: CSE
- Role: Product Manager @ Microsoft
- Location: Hyderabad
- **Mentor Available: ✅**

### 3. **Arun Venkat**
- Email: `arun.venkat@gmail.com`
- Password: `password123`
- Batch: 2018 | Dept: ECE
- Role: Data Scientist @ Amazon
- Location: Chennai
- **Mentor Available: ✅**

### 4. **Sneha Reddy**
- Email: `sneha.reddy@gmail.com`
- Password: `password123`
- Batch: 2021 | Dept: MECH
- Role: Mechanical Design Engineer @ Tesla
- Location: Bangalore
- **Mentor Available: ✅**

---

## 📋 How Mentorship Works

### **Step-by-Step Process:**

#### **For Students:**
1. **Login** to ALUMIO as a student
2. Navigate to **"Directory"** page
3. **Browse alumni** by department, batch, or search
4. Find an alumni you want as a mentor
5. Click **"Connect"** button on their profile
6. Wait for the alumni to **accept your request**
7. Once accepted, check **"Mentorship"** page to see your mentors

#### **For Alumni (Mentors):**
1. **Login** to ALUMIO as alumni
2. Navigate to **"Notifications"** page
3. **View connection requests** from students
4. Click **"Accept"** to become their mentor
5. Check **"Mentorship"** page to see your mentees

---

## 🔧 3 Ways to Add New Mentors

### **Method 1: Self-Registration (Public)**
Students and alumni can register themselves:

1. Go to: `http://localhost:3000/register`
2. Select **"Alumni"** role
3. Fill in details (name, email, password, department, batch)
4. Click **"Create Account"**
5. Alumni appears in directory automatically
6. Students can now send connection requests

---

### **Method 2: Manual Database Entry (Current Mode)**

Since you're in **Offline/Mock Mode**, you can add mentors directly to the database:

**File:** `backend/local_db.json`

**Add a new user object:**
```json
{
  "_id": "unique-id-here",
  "name": "Full Name",
  "firstName": "First",
  "lastName": "Last",
  "email": "email@example.com",
  "password": "password123",
  "role": "alumni",
  "batch": "2020",
  "department": "CSE",
  "currentCompany": "Company Name",
  "currentRole": "Job Title",
  "city": "City Name",
  "isMentorAvailable": true,
  "isApproved": true,
  "isActive": true
}
```

**Then restart the backend server:**
```bash
cd backend
npm run dev
```

---

### **Method 3: Admin Approval System (Future Enhancement)**

Currently, all users are auto-approved. For production:
1. Users register
2. Admin reviews in **Admin Panel → Pending Approvals**
3. Admin approves qualified alumni
4. Approved alumni appear in directory

---

## 🎯 Testing the Mentor System

### **Quick Test Flow:**

1. **Login as a Student:**
   - Email: `student1@college.edu`
   - Password: `password123`

2. **Navigate to Directory:**
   - Go to: `http://localhost:3000/directory`
   - You should now see **8 alumni** (4 original + 4 new mentors)

3. **Send Connection Request:**
   - Find "Rajesh Kumar" (Google, CSE)
   - Click **"Connect"** button
   - Alert confirms request sent

4. **Login as the Alumni/Mentor:**
   - Logout and login as:
   - Email: `rajesh.kumar@gmail.com`
   - Password: `password123`

5. **Accept Connection:**
   - Go to **"Notifications"** page
   - Find connection request from "Demo User" (student)
   - Click **"Accept"**

6. **View Mentorship:**
   - Both users can now go to **"Mentorship"** page
   - Student sees Rajesh as "My Mentors"
   - Rajesh sees Demo User as "My Mentees"

---

## 📊 Current Mentors in System

After adding the new mentors, you now have:

| Name | Department | Company | Role | Batch |
|------|-----------|---------|------|-------|
| Rajesh Kumar | CSE | Google | Sr. Software Engineer | 2020 |
| Priya Sharma | CSE | Microsoft | Product Manager | 2019 |
| Arun Venkat | ECE | Amazon | Data Scientist | 2018 |
| Sneha Reddy | MECH | Tesla | Mech Design Engineer | 2021 |
| Demo User (john.doe) | CSE | - | Alumni | 2024 |
| Demo User (rama) | CSE | - | Alumni | 2024 |

**Total: 6 Alumni (all can be mentors)**

---

## 🚀 Next Steps to Improve Mentorship

### **Recommended Enhancements:**

1. **Mentor Profile Fields:**
   - Add "Areas of Expertise" (tags)
   - Add "Mentorship Capacity" (max mentees)
   - Add "Availability Schedule"

2. **Matching Algorithm:**
   - Auto-suggest mentors based on student's department
   - Match by career interests
   - Filter by location/company

3. **Mentor Dashboard:**
   - Track active mentorships
   - Schedule mentorship sessions
   - Message mentees directly

4. **Profile Page:**
   - Add toggle "Available as Mentor"
   - Show mentor badge on profiles
   - Display mentorship stats

---

## 📝 Quick Reference

### **Test Login Credentials:**

**Students:**
- `student1@college.edu` / `password123`

**Alumni/Mentors:**
- `rajesh.kumar@gmail.com` / `password123`
- `priya.sharma@gmail.com` / `password123`
- `arun.venkat@gmail.com` / `password123`
- `sneha.reddy@gmail.com` / `password123`
- `john.doe@gmail.com` / `password123`

**Admin:**
- `admin@alumni.edu` / `admin123`

---

## 🔗 Important Pages

- **Registration:** `http://localhost:3000/register`
- **Login:** `http://localhost:3000/login`
- **Directory:** `http://localhost:3000/directory`
- **Mentorship:** `http://localhost:3000/mentorship`
- **Notifications:** `http://localhost:3000/notifications`
- **Admin Panel:** `http://localhost:3000/admin`

---

## ✨ Summary

✅ **4 new mentor profiles added** to the database  
✅ All mentors have `isMentorAvailable: true`  
✅ Mentors appear in Alumni Directory  
✅ Students can send connection requests  
✅ Alumni can accept and become mentors  
✅ System tracks mentorship relationships  

**Restart the backend server** to load the new mentors!
