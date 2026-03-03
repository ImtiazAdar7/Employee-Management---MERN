# **Employee Management System**
## Author: Imtiaz Adar
### [Linkedin](https://www.linkedin.com/in/imtiaz-ahmed-adar)
A full-stack employee management application with role-based access control, JWT authentication, and comprehensive user management features.

![Node.js](https://img.shields.io/badge/Node.js-22.x-green)
![Express](https://img.shields.io/badge/Express-4.0-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-brightgreen)
![ReactJS](https://img.shields.io/badge/React-18.0-blue)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)

# 📋 Overview
The Employee Management System is a secure, full-featured application that allows organizations to manage employee data efficiently. Built with the MERN stack (MongoDB, Express.js, React, Node.js), it provides role-based access control, secure authentication, and a responsive user interface.

# ✨ Key Features
# 🔐 Secure Authentication

JWT-based authentication with access and refresh tokens

Password hashing with bcrypt

Token rotation for enhanced security

Automatic token refresh on expiration

# 👥 Role-Based Access Control

Admin: Full CRUD operations on all employees

Employee: View and edit their own profile only

Protected routes based on user roles

# 📊 Employee Management

Create, read, update, and delete employee records

Advanced search functionality (by name, email, username, designation)

Detailed employee profiles

Pagination-ready architecture

# 🎨 Modern UI/UX

Responsive design for all devices

Intuitive navigation

Real-time form validation

Success/error notifications

# 🛠️ Technology Stack
Backend
Runtime: Node.js

Framework: Express.js

Database: MongoDB with Mongoose ODM

Authentication: JWT (jsonwebtoken)

Security: bcryptjs for password hashing

Environment: dotenv

Frontend
Framework: React 18

Routing: React Router DOM v6

HTTP Client: Axios with interceptors

State Management: React Context API

Styling: CSS (custom)

# 📁 Project Structure

employee-management-system/  
├── backend/  
│   ├── config/  
│   │   └── db.js                 # MongoDB connection  
│   ├── controllers/  
│   │   ├── auth.controller.js    # Authentication logic  
│   │   └── employee.controller.js # Employee CRUD operations  
│   ├── middleware/  
│   │   ├── auth.middleware.js    # JWT verification  
│   │   ├── authOwnerOrAdmin.middleware.js # Ownership check  
│   │   └── role.middleware.js    # Role-based access  
│   ├── models/  
│   │   └── user.model.js         # User schema  
│   ├── routes/  
│   │   ├── auth.routes.js        # Auth endpoints  
│   │   └── employee.routes.js    # Employee endpoints  
│   ├── utils/  
│   │   └── token.js              # JWT token utilities  
│   ├── .env                       # Environment variables  
│   ├── app.js                      # Express app configuration  
│   └── server.js                   # Server entry point  
│  
├── frontend/  
│   ├── public/  
│   │   └── index.html  
│   ├── src/  
│   │   ├── api/  
│   │   │   └── axios.js           # Axios instance with interceptors  
│   │   ├── components/  
│   │   │   ├── Navbar.jsx  
│   │   │   ├── PrivateRoute.jsx  
│   │   │   └── HomeRedirect.jsx  
│   │   ├── context/  
│   │   │   ├── AuthContext.jsx  
│   │   │   └── useAuth.jsx  
│   │   ├── pages/  
│   │   │   ├── Login.jsx  
│   │   │   ├── Register.jsx  
│   │   │   ├── Dashboard.jsx  
│   │   │   ├── Profile.jsx  
│   │   │   ├── Employees.jsx  
│   │   │   ├── EmployeeProfile.jsx  
│   │   │   ├── CreateEmployee.jsx  
│   │   │   ├── EditEmployee.jsx  
│   │   │   └── NotFound.jsx  
│   │   ├── App.jsx  
│   │   ├── App.css  
│   │   └── index.js  
│   └── package.json  

# 🔧 Installation
Prerequisites
Node.js (v18 or higher)

MongoDB (v6 or higher)

npm or yarn

### Backend Setup
Clone the repository

```
git clone https://github.com/yourusername/employee-management-system.git
cd employee-management-system/backend
```

### Install dependencies

```
npm install
```

Start MongoDB
Ensure MongoDB is running locally or update MONGO_URI for remote connection.

### Run the backend server
```
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

### Frontend Setup
Navigate to frontend directory

```
cd ../frontend
```

### Install dependencies

```
npm install
```

### Start the React development server

```
npm start
```

# 🔌 API Endpoints
## Authentication | Routes (/api/auth)

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| POST | /register | Register new user | Public | {firstName, lastName, email, username, gender, designation, dob, password, role, companyToken} |
| POST | /login | User login | Public | {username, password} |
| POST | /refresh | Refresh access token | Public | {refreshToken} |
| POST | /logout	| User logout | Public | {refreshToken} |

## Employee | Routes | (/api/employees)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /me | Get current user profile | Authenticated users |
| GET | / | Get all employees | Admin only |
| GET | /:id | Get employee by ID | Admin or Owner |
| PUT | /:id | Update employee | Admin or Owner |
| DELETE | /:id | Delete employee | Admin or Owner |


# 🔐 Security Features


### Password Hashing

```
const hashedPassword = await bcrypt.hash(password, 10);
```

### JWT Token Generation

```
// Access token (short-lived)
jwt.sign({ id: user._id, role: user.role }, 
         process.env.JWT_SECRET, 
         { expiresIn: '15m' });

// Refresh token (long-lived)
jwt.sign({ id: user._id }, 
         process.env.JWT_REFRESH_SECRET, 
         { expiresIn: '7d' });
```

### Token Rotation
- New refresh token issued with every access token refresh

- Old refresh tokens are invalidated

- Prevents token replay attacks

### Role-Based Middleware Chain

```
// Protected route with multiple middleware
router.get('/:id', auth, authOwner, controller.getEmployeeById);
```

🎯 Key Implementation Details
Axios Interceptor for Token Refresh

```
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 403 && !originalRequest._retry) {
      // Attempt token refresh
      const res = await axios.post('/api/auth/refresh', { refreshToken });
      // Retry original request with new token
    }
  }
);
```

Protected Route Component
```
const PrivateRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" />;
};
```

Ownership Verification Middleware
```
module.exports = (req, res, next) => {
  if (req.user.role === "ADMIN") return next();
  if (req.user.id == req.params.id) return next();
  return res.status(403).json({ message: "Access Denied" });
};
```


# 🎨 UI Components
Navbar
Dynamic links based on user role

User information display

Logout functionality

Employee Table
Sortable columns

Search functionality across multiple fields

Action buttons (view, edit, delete)

Role badges with color coding

Forms
Real-time validation

Responsive design

Success/error notifications


# 📄 License
This project is licensed by Imtiaz Adar.

# 👨‍💻 Author
Imtiaz Adar

GitHub: @ImtiazAdar7

# 🙏 Acknowledgments
Express.js team for the amazing framework

React team for the UI library

MongoDB for the database

All contributors and users of this project

Made with ❤️ by Imtiaz Adar
