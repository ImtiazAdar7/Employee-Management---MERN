import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchEmployeeProfile();
    }
  }, [id]);

  const fetchEmployeeProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/employees/${id}`);
      setEmployee(response.data);
    } catch (error) {
      console.error('Error fetching employee profile:', error);
      setError('Failed to fetch employee profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading-container">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="error-container">
          <div className="container">
            <div className="error-message">{error}</div>
            <button onClick={() => navigate('/employees')} className="btn btn-primary">
              Back to Employees
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="profile-view-container">
        <div className="container">
          <div className="profile-header">
            <h1>Employee Profile</h1>
            <div className="profile-actions">
              <Link to="/employees" className="btn btn-secondary">
                Back to List
              </Link>
              {user?.role === 'ADMIN' && (
                <Link to={`/employees/edit/${id}`} className="btn btn-primary">
                  Edit Employee
                </Link>
              )}
            </div>
          </div>

          <div className="profile-card">
            <div className="profile-avatar">
              <div className="avatar-initials">
                {employee?.firstName?.[0]}{employee?.lastName?.[0]}
              </div>
            </div>
            
            <div className="profile-details">
              <h2>{employee?.firstName} {employee?.lastName}</h2>
              <p className="profile-role">{employee?.role}</p>
              
              <div className="profile-grid">
                <div className="profile-item">
                  <span className="label">Email:</span>
                  <span className="value">{employee?.email}</span>
                </div>
                <div className="profile-item">
                  <span className="label">Username:</span>
                  <span className="value">{employee?.username}</span>
                </div>
                <div className="profile-item">
                  <span className="label">Gender:</span>
                  <span className="value">{employee?.gender}</span>
                </div>
                <div className="profile-item">
                  <span className="label">Designation:</span>
                  <span className="value">{employee?.designation || 'Not specified'}</span>
                </div>
                <div className="profile-item">
                  <span className="label">Date of Birth:</span>
                  <span className="value">{new Date(employee?.dob).toLocaleDateString()}</span>
                </div>
                <div className="profile-item">
                  <span className="label">Member Since:</span>
                  <span className="value">{new Date(employee?.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;