import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Employees from './pages/Employees';
import EmployeeProfile from './pages/EmployeeProfile';
import EditEmployee from './pages/EditEmployee';
import CreateEmployee from './pages/CreateEmployee';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Global Header - Appears above everything */}
        <header className="app-header">
          <div className="container">
            <h1>Employee Management - Imtiaz Adar</h1>
          </div>
        </header>
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/profile/:id" element={<EmployeeProfile />} />
            <Route path="/employees/create" element={<CreateEmployee />} />
            <Route path="/employees/edit/:id" element={<EditEmployee />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;