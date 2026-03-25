# 🚀 Quick Start Guide - Alumni Platform API

This guide will help you get the backend API up and running in minutes.

## ⚡ Quick Setup (5 minutes)

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get connection string
5. Update `.env` file with your connection string

### Step 3: Configure Environment

The `.env` file is already configured for local development. For MongoDB Atlas, update:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/alumni_platform
```

### Step 4: Seed Database (Optional but Recommended)

```bash
npm run seed
```

This creates sample users, jobs, events, and donations.

### Step 5: Start the Server

```bash
npm run dev
```

The API will start at `http://localhost:5000`

## ✅ Verify Installation

Open your browser or use curl:

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Alumni Platform API is running",
  "timestamp": "2026-01-30T..."
}
```

## 🧪 Test with Sample Data

### 1. Login as Admin

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@alumni.edu",
    "password": "admin123"
  }'
```

**Copy the token from the response!**

### 2. Get All Users

```bash
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Get All Jobs

```bash
curl http://localhost:5000/api/jobs
```

### 4. Get User Profile

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📝 Test Accounts

After seeding, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@alumni.edu | admin123 |
| **Alumni 1** | john.doe@gmail.com | password123 |
| **Alumni 2** | sarah.smith@gmail.com | password123 |
| **Student 1** | student1@college.edu | password123 |
| **Student 2** | student2@college.edu | password123 |

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/updateprofile` - Update profile (Protected)

### Users/Directory
- `GET /api/users` - Get all users with filters (Protected)
- `GET /api/users/:id` - Get user by ID (Protected)
- `GET /api/users/stats` - Get statistics (Protected)
- `GET /api/users/pending` - Get pending approvals (Admin only)
- `PUT /api/users/:id/approve` - Approve user (Admin only)

### Jobs
- `GET /api/jobs` - Get all jobs (Public)
- `GET /api/jobs/:id` - Get job details (Public)
- `POST /api/jobs` - Create job (Alumni/Recruiter)
- `PUT /api/jobs/:id` - Update job (Owner/Admin)
- `DELETE /api/jobs/:id` - Delete job (Owner/Admin)

## 🔧 Common Issues & Solutions

### Issue: MongoDB Connection Error

**Solution 1:** Start MongoDB
```bash
mongod
```

**Solution 2:** Use MongoDB Atlas (cloud)
- Free tier available
- No local installation needed
- Update `MONGODB_URI` in `.env`

### Issue: Port 5000 already in use

**Solution:** Change port in `.env`:
```env
PORT=5001
```

Or kill the process using port 5000:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: JWT Token Error

**Solution:** Make sure you're sending the token correctly:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📱 Testing with Postman

1. **Import Collection**: Create a new collection in Postman
2. **Set Base URL**: `http://localhost:5000/api`
3. **Login**: POST to `/auth/login` with credentials
4. **Copy Token**: From the response
5. **Set Authorization**: 
   - Type: Bearer Token
   - Token: Paste your token
6. **Test Protected Routes**: Try `/users` or `/auth/me`

## 🌐 Connect with Frontend

Your Next.js frontend should make API calls to:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';

// Example: Login
const response = await fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john.doe@gmail.com',
    password: 'password123'
  })
});

const data = await response.json();
const token = data.data.token;

// Example: Get users (with token)
const usersResponse = await fetch(`${API_BASE_URL}/users`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 🎯 Next Steps

1. **Explore API**: Try different endpoints
2. **Create Content**: Add jobs, events via API
3. **Test Roles**: Login with different roles
4. **Check Admin Panel**: Use admin account to approve users
5. **Integrate Frontend**: Connect your Next.js app

## 📚 Resources

- Full API Documentation: See `README.md`
- Sample Data: Check `scripts/seedDatabase.js`
- API Structure: Review files in `routes/` and `controllers/`

## 🆘 Need Help?

1. Check the main `README.md` for detailed documentation
2. Review error messages in the console
3. Verify MongoDB is running
4. Check `.env` configuration

---

**Happy Coding! 🚀**
