# Frontend-Backend Integration Guide

This guide helps you integrate the Next.js frontend with the Express backend API.

## 🔗 API Configuration

### 1. Create API Client

Create `web/app/services/apiClient.js`:

```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get token from localStorage
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  // Set token in localStorage
  setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  // Remove token
  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  // Make API request
  async request(endpoint, options = {}) {
    const token = this.getToken();
    
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...(options.body && { body: JSON.stringify(options.body) }),
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  }

  // PUT request
  async put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export default new ApiClient();
```

### 2. Create API Service Files

Create `web/app/services/authService.js`:

```javascript
import apiClient from './apiClient';

export const authService = {
  // Register new user
  async register(userData) {
    const response = await apiClient.post('/auth/register', userData);
    if (response.data.token) {
      apiClient.setToken(response.data.token);
    }
    return response;
  },

  // Login user
  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data.token) {
      apiClient.setToken(response.data.token);
    }
    return response;
  },

  // Logout user
  async logout() {
    apiClient.removeToken();
    const response = await apiClient.post('/auth/logout');
    return response;
  },

  // Get current user
  async getCurrentUser() {
    return apiClient.get('/auth/me');
  },

  // Update profile
  async updateProfile(profileData) {
    return apiClient.put('/auth/updateprofile', profileData);
  },

  // Update password
  async updatePassword(currentPassword, newPassword) {
    return apiClient.put('/auth/updatepassword', {
      currentPassword,
      newPassword
    });
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!apiClient.getToken();
  }
};
```

Create `web/app/services/userService.js`:

```javascript
import apiClient from './apiClient';

export const userService = {
  // Get all users (directory)
  async getUsers(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return apiClient.get(`/users?${params}`);
  },

  // Get user by ID
  async getUserById(id) {
    return apiClient.get(`/users/${id}`);
  },

  // Get directory stats
  async getDirectoryStats() {
    return apiClient.get('/users/stats');
  },

  // Get pending users (admin)
  async getPendingUsers() {
    return apiClient.get('/users/pending');
  },

  // Approve user (admin)
  async approveUser(id) {
    return apiClient.put(`/users/${id}/approve`);
  },

  // Reject user (admin)
  async rejectUser(id) {
    return apiClient.put(`/users/${id}/reject`);
  }
};
```

Create `web/app/services/jobService.js`:

```javascript
import apiClient from './apiClient';

export const jobService = {
  // Get all jobs
  async getJobs(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return apiClient.get(`/jobs?${params}`);
  },

  // Get job by ID
  async getJobById(id) {
    return apiClient.get(`/jobs/${id}`);
  },

  // Create job
  async createJob(jobData) {
    return apiClient.post('/jobs', jobData);
  },

  // Update job
  async updateJob(id, jobData) {
    return apiClient.put(`/jobs/${id}`, jobData);
  },

  // Delete job
  async deleteJob(id) {
    return apiClient.delete(`/jobs/${id}`);
  },

  // Get my posted jobs
  async getMyJobs() {
    return apiClient.get('/jobs/my/posts');
  },

  // Get job stats
  async getJobStats() {
    return apiClient.get('/jobs/stats');
  }
};
```

## 🔄 Usage Examples

### Login Page Example

```javascript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/services/authService';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      console.log('Login successful:', response.data.user);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Directory Page Example

```javascript
'use client';

import { useState, useEffect } from 'react';
import { userService } from '@/app/services/userService';

export default function DirectoryPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    batch: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getUsers(filters);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  return (
    <div>
      <h1>Alumni Directory</h1>
      
      <input
        type="text"
        placeholder="Search alumni..."
        value={filters.search}
        onChange={handleSearch}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="user-grid">
          {users.map(user => (
            <div key={user._id} className="user-card">
              <h3>{user.fullName}</h3>
              <p>{user.currentPosition} at {user.currentCompany}</p>
              <p>Batch: {user.batch}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Create Job Example

```javascript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { jobService } from '@/app/services/jobService';

export default function CreateJobPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    type: 'full-time',
    category: 'software',
    location: '',
    isRemote: false,
    applicationDeadline: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await jobService.createJob(formData);
      alert('Job posted successfully!');
      router.push('/jobs');
    } catch (error) {
      alert('Error posting job: ' + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Job Title"
        required
      />
      
      <input
        name="company"
        value={formData.company}
        onChange={handleChange}
        placeholder="Company Name"
        required
      />
      
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Job Description"
        required
      />
      
      <select name="type" value={formData.type} onChange={handleChange}>
        <option value="full-time">Full Time</option>
        <option value="part-time">Part Time</option>
        <option value="internship">Internship</option>
      </select>
      
      <label>
        <input
          type="checkbox"
          name="isRemote"
          checked={formData.isRemote}
          onChange={handleChange}
        />
        Remote Position
      </label>
      
      <button type="submit">Post Job</button>
    </form>
  );
}
```

## 🔒 Protected Routes

Create `web/app/components/ProtectedRoute.js`:

```javascript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/services/authService';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    try {
      const response = await authService.getCurrentUser();
      const currentUser = response.data;
      
      // Check if user role is allowed
      if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
        router.push('/dashboard');
        return;
      }
      
      setUser(currentUser);
      setLoading(false);
    } catch (error) {
      authService.logout();
      router.push('/login');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return children;
}
```

Usage:
```javascript
import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div>Admin Content</div>
    </ProtectedRoute>
  );
}
```

## 🌍 Environment Variables

Create `web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📝 Best Practices

1. **Error Handling**: Always wrap API calls in try-catch blocks
2. **Loading States**: Show loading indicators during API calls
3. **Token Management**: Store JWT token securely in localStorage
4. **Logout**: Clear token and redirect on 401 errors
5. **Validation**: Validate form data before sending to API
6. **CORS**: Ensure backend CORS is configured for your frontend URL

## 🔄 Real-time Updates (Future Enhancement)

For real-time features, consider using:
- Socket.io for chat and notifications
- SWR or React Query for data caching and revalidation
- Server-Sent Events (SSE) for live updates

---

**Happy Coding! 🚀**
