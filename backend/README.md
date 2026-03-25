# Alumni Platform - Backend API

A comprehensive RESTful API for the Alumni Association Platform built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Alumni directory with advanced search and filtering
- **Job Portal**: Post jobs, internships, and manage applications
- **Event Management**: Create and manage events, reunions, and workshops
- **Donation System**: Track donations with receipt generation
- **Mentorship**: Connect students with alumni mentors
- **Success Stories**: Share and moderate alumni achievements
- **Admin Dashboard**: User approval, content moderation, and analytics

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB 6.0+ (local or MongoDB Atlas)
- Git

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/alumni_platform
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
mongod
```

**macOS/Linux:**
```bash
sudo systemctl start mongod
```

**Or use MongoDB Atlas** (cloud):
- Create a free cluster at https://www.mongodb.com/cloud/atlas
- Get your connection string and update `MONGODB_URI` in `.env`

### 4. Seed Database (Optional)

Populate the database with sample data:

```bash
npm run seed
```

This will create:
- 1 Admin user
- 3 Alumni users
- 2 Student users
- Sample jobs, events, and donations

### 5. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| GET | `/auth/me` | Get current user | Private |
| PUT | `/auth/updateprofile` | Update profile | Private |
| PUT | `/auth/updatepassword` | Change password | Private |
| POST | `/auth/logout` | Logout user | Private |

### User/Directory Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/users` | Get all users (with filters) | Private |
| GET | `/users/:id` | Get user by ID | Private |
| GET | `/users/stats` | Get directory statistics | Private |
| GET | `/users/pending` | Get pending approval users | Admin |
| PUT | `/users/:id/approve` | Approve user | Admin |
| PUT | `/users/:id/reject` | Reject user | Admin |

### Job Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/jobs` | Get all jobs (with filters) | Public |
| GET | `/jobs/:id` | Get job by ID | Public |
| GET | `/jobs/stats` | Get job statistics | Private |
| GET | `/jobs/my/posts` | Get my posted jobs | Private |
| POST | `/jobs` | Create new job | Alumni/Recruiter |
| PUT | `/jobs/:id` | Update job | Owner/Admin |
| DELETE | `/jobs/:id` | Delete job | Owner/Admin |

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Example Login Request

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@gmail.com",
    "password": "password123"
  }'
```

### Example Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "email": "john.doe@gmail.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "alumni"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 👥 User Roles

- **alumni**: Can post jobs, donate, mentor students
- **student**: Can browse jobs, find mentors, register for events
- **admin**: Full access, can approve users and moderate content
- **recruiter**: Can post jobs (requires admin approval)

## 📊 Sample Data

After running `npm run seed`, you can use these test accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@alumni.edu | admin123 |
| Alumni | john.doe@gmail.com | password123 |
| Student | student1@college.edu | password123 |

## 🔍 Search & Filtering

### Users Directory

```
GET /api/users?search=John&department=Computer Science&batch=2015-2019&isMentorAvailable=true
```

**Available Filters:**
- `search` - Search by name, email, company
- `role` - Filter by role (alumni/student/admin)
- `department` - Filter by department
- `batch` - Filter by batch
- `industry` - Filter by industry
- `city` - Filter by city
- `skills` - Filter by skills (comma-separated)
- `isMentorAvailable` - Filter mentors (true/false)
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 20)

### Jobs Portal

```
GET /api/jobs?type=internship&category=software&isRemote=true&location=Bangalore
```

**Available Filters:**
- `search` - Search in title, company, description
- `type` - Job type (full-time/part-time/internship/contract)
- `category` - Job category (software/hardware/design/etc.)
- `location` - Location
- `isRemote` - Remote jobs only (true/false)
- `company` - Filter by company
- `page` - Page number
- `limit` - Results per page

## 🗂️ Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User/directory logic
│   └── jobController.js     # Job portal logic
├── middleware/
│   └── auth.js              # JWT verification & authorization
├── models/
│   ├── User.js              # User schema
│   ├── Job.js               # Job schema
│   ├── Event.js             # Event schema
│   ├── Donation.js          # Donation schema
│   ├── Mentorship.js        # Mentorship schema
│   └── SuccessStory.js      # Success story schema
├── routes/
│   ├── authRoutes.js        # Auth routes
│   ├── userRoutes.js        # User routes
│   └── jobRoutes.js         # Job routes
├── scripts/
│   └── seedDatabase.js      # Database seeding script
├── .env                     # Environment variables
├── .env.example             # Example env file
├── package.json             # Dependencies
└── server.js                # Main application file
```

## 🔧 Configuration

### MongoDB Connection

**Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/alumni_platform
```

**MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/alumni_platform
```

### JWT Configuration

```env
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d
```

### CORS Configuration

Update `FRONTEND_URL` to match your frontend application:

```env
FRONTEND_URL=http://localhost:3000
```

## 🧪 Testing the API

### Using cURL

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "role": "alumni",
    "department": "Computer Science",
    "batch": "2020-2024",
    "graduationYear": 2024,
    "degree": "B.Tech"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Using Postman

1. Import the API endpoints
2. Set Authorization type to "Bearer Token"
3. Use the token from login response

## 📈 Performance

- **Indexed Queries**: All major queries use MongoDB indexes for fast search
- **Pagination**: Built-in pagination to handle large datasets
- **Query Optimization**: Aggregation pipelines for complex statistics

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Role-based access control (RBAC)
- ✅ Account lockout after failed login attempts
- ✅ Input validation
- ✅ CORS protection
- ✅ Environment variable configuration

## 🚀 Deployment

### Deploy to Heroku

```bash
# Install Heroku CLI
heroku login

# Create app
heroku create alumni-platform-api

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_secret_key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Deploy to Railway/Render

1. Connect your GitHub repository
2. Set environment variables in the dashboard
3. Deploy automatically on push

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error: `MongooseServerSelectionError`**

- Ensure MongoDB is running: `mongod`
- Check MongoDB URI in `.env`
- For Atlas, check IP whitelist settings

### Port Already in Use

**Error: `EADDRINUSE`**

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### JWT Token Issues

- Ensure `JWT_SECRET` is set in `.env`
- Check token expiry settings
- Verify Authorization header format: `Bearer <token>`

## 📝 Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| PORT | Server port | 5000 | No |
| NODE_ENV | Environment | development | No |
| MONGODB_URI | MongoDB connection string | - | Yes |
| JWT_SECRET | Secret key for JWT | - | Yes |
| JWT_EXPIRE | Token expiration | 7d | No |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 | Yes |

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review API documentation
- Check console logs for detailed errors

---

**Last Updated**: January 30, 2026  
**Version**: 1.0.0
