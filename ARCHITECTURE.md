# Alumni Platform - System Architecture

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐         ┌──────────────────┐             │
│  │   Web Frontend   │         │  Mobile App      │             │
│  │   (Next.js)      │         │  (HTML/CSS/JS)   │             │
│  │   Port: 3000     │         │                  │             │
│  └────────┬─────────┘         └────────┬─────────┘             │
│           │                            │                        │
│           └────────────┬───────────────┘                        │
│                        │                                        │
└────────────────────────┼────────────────────────────────────────┘
                         │ HTTP/REST API
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                     API GATEWAY LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Express.js Server                          │   │
│  │              Port: 5000                                 │   │
│  │                                                         │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌───────────────┐ │   │
│  │  │    CORS     │  │ Body Parser │  │  JWT Auth     │ │   │
│  │  │  Middleware │  │  Middleware │  │  Middleware   │ │   │
│  │  └─────────────┘  └─────────────┘  └───────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    ROUTING LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ /api/auth    │  │ /api/users   │  │ /api/jobs    │         │
│  │              │  │              │  │              │         │
│  │ - register   │  │ - Get all    │  │ - Get all    │         │
│  │ - login      │  │ - Get by ID  │  │ - Get by ID  │         │
│  │ - logout     │  │ - Search     │  │ - Create     │         │
│  │ - me         │  │ - Approve    │  │ - Update     │         │
│  │ - update     │  │ - Stats      │  │ - Delete     │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                  │                  │
└─────────┼─────────────────┼──────────────────┼──────────────────┘
          │                 │                  │
          │                 │                  │
┌─────────▼─────────────────▼──────────────────▼──────────────────┐
│                  CONTROLLER LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │ authController   │  │ userController   │  │jobController │ │
│  │                  │  │                  │  │              │ │
│  │ - Business Logic │  │ - Business Logic │  │- Biz Logic   │ │
│  │ - Validation     │  │ - Validation     │  │- Validation  │ │
│  │ - Error Handling │  │ - Error Handling │  │- Err Handle  │ │
│  └────────┬─────────┘  └────────┬─────────┘  └──────┬───────┘ │
│           │                     │                     │         │
└───────────┼─────────────────────┼─────────────────────┼─────────┘
            │                     │                     │
            │                     │                     │
┌───────────▼─────────────────────▼─────────────────────▼─────────┐
│                      MODEL LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                         Mongoose ODM                             │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   User   │  │   Job    │  │  Event   │  │ Donation │       │
│  │          │  │          │  │          │  │          │       │
│  │ - Schema │  │ - Schema │  │ - Schema │  │ - Schema │       │
│  │ - Validn │  │ - Validn │  │ - Validn │  │ - Validn │       │
│  │ - Methods│  │ - Methods│  │ - Methods│  │ - Methods│       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                  │
│  ┌──────────┐  ┌──────────┐                                    │
│  │Mentorship│  │ Success  │                                    │
│  │          │  │  Story   │                                    │
│  │ - Schema │  │ - Schema │                                    │
│  │ - Validn │  │ - Validn │                                    │
│  │ - Methods│  │ - Methods│                                    │
│  └──────────┘  └──────────┘                                    │
│                                                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    DATABASE LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                      MongoDB Database                            │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Collections                          │   │
│  │                                                         │   │
│  │  users  │  jobs  │  events  │  donations │ mentorships│   │
│  │  stories │  applications │  registrations │ feedback   │   │
│  │                                                         │   │
│  │  - Indexed fields for fast queries                     │   │
│  │  - ACID transactions                                   │   │
│  │  - Automatic timestamps                                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔐 Authentication Flow

```
┌──────────┐                                    ┌──────────┐
│  Client  │                                    │  Server  │
└────┬─────┘                                    └────┬─────┘
     │                                               │
     │  POST /api/auth/login                        │
     │  { email, password }                         │
     ├──────────────────────────────────────────────►
     │                                               │
     │                                    ┌──────────▼─────────┐
     │                                    │ Validate credentials│
     │                                    │ Hash password check │
     │                                    └──────────┬─────────┘
     │                                               │
     │                                    ┌──────────▼─────────┐
     │                                    │  Generate JWT Token│
     │                                    │  Sign with secret  │
     │                                    └──────────┬─────────┘
     │                                               │
     │  { success: true, token: "..." }              │
     │◄──────────────────────────────────────────────┤
     │                                               │
     │  Store token in localStorage                  │
     │                                               │
     │  GET /api/users                              │
     │  Authorization: Bearer <token>               │
     ├──────────────────────────────────────────────►
     │                                               │
     │                                    ┌──────────▼─────────┐
     │                                    │  Verify JWT Token  │
     │                                    │  Check expiration  │
     │                                    └──────────┬─────────┘
     │                                               │
     │                                    ┌──────────▼─────────┐
     │                                    │  Fetch user from DB│
     │                                    │  Check permissions │
     │                                    └──────────┬─────────┘
     │                                               │
     │  { success: true, data: [...] }              │
     │◄──────────────────────────────────────────────┤
     │                                               │
```

## 📊 Data Flow Example: Job Posting

```
┌─────────────────────────────────────────────────────────────┐
│  1. Alumni creates job posting on frontend                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  2. POST /api/jobs with job data + JWT token               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Auth middleware verifies token and user role           │
│     - Check if role is 'alumni' or 'recruiter'             │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  4. jobController.createJob() validates data               │
│     - Required fields present                              │
│     - Valid enum values                                    │
│     - Deadline in future                                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Job model creates document in MongoDB                  │
│     - Sets postedBy to current user                        │
│     - Auto-approve if alumni                               │
│     - Adds timestamps                                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  6. Return success response with job data                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  7. Frontend updates UI and shows success message          │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Request/Response Lifecycle

```
Client Request
      │
      ▼
┌─────────────────┐
│  Express App    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  CORS Middleware│  ← Allow frontend origin
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Body Parser    │  ← Parse JSON body
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Route Matching │  ← Find handler
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Auth Middleware│  ← Verify JWT (if protected)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Controller     │  ← Business logic
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Model/Database │  ← Query MongoDB
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Format Response│  ← JSON response
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Send to Client │
└─────────────────┘
```

## 🛡️ Security Layers

```
┌─────────────────────────────────────────────────┐
│              Security Measures                   │
├─────────────────────────────────────────────────┤
│                                                  │
│  1. Password Hashing (bcrypt)                   │
│     - Salt rounds: 10                           │
│     - Never store plain passwords               │
│                                                  │
│  2. JWT Authentication                          │
│     - Token expiry: 7 days                      │
│     - Secret key stored in .env                 │
│                                                  │
│  3. Role-Based Access Control                   │
│     - Admin, Alumni, Student, Recruiter         │
│     - Route-level authorization                 │
│                                                  │
│  4. Account Security                            │
│     - Login attempt tracking                    │
│     - Account lockout (5 failures)              │
│     - Lock duration: 15 minutes                 │
│                                                  │
│  5. CORS Protection                             │
│     - Whitelist frontend URL                    │
│     - Credentials allowed                       │
│                                                  │
│  6. Input Validation                            │
│     - Mongoose schema validation                │
│     - Email format checking                     │
│     - Required field enforcement                │
│                                                  │
│  7. Error Handling                              │
│     - Never expose sensitive info               │
│     - Generic error messages                    │
│     - Detailed logs (server-side only)          │
│                                                  │
└─────────────────────────────────────────────────┘
```

## 📈 Database Schema Relationships

```
┌─────────────┐
│    User     │───────────────┐
│             │               │
│ - _id       │               │ postedBy
│ - email     │               │
│ - password  │               ▼
│ - role      │         ┌─────────────┐
│ - ...       │         │     Job     │
└──────┬──────┘         │             │
       │                │ - _id       │
       │ donor          │ - title     │
       │                │ - company   │
       ▼                │ - postedBy  │──┐
┌─────────────┐         └─────────────┘  │
│  Donation   │                          │
│             │                          │
│ - _id       │         ┌─────────────┐  │ applications
│ - amount    │         │Application  │◄─┘
│ - donor     │──┐      │             │
│ - ...       │  │      │ - job       │
└─────────────┘  │      │ - applicant │
                 │      └─────────────┘
                 │
                 │ mentor/mentee
                 │
                 ▼
          ┌─────────────┐
          │ Mentorship  │
          │             │
          │ - mentor    │──┐
          │ - mentee    │  │ Both reference User
          │ - status    │◄─┘
          │ - sessions  │
          └─────────────┘
```

---

**Last Updated**: January 30, 2026
