import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    gender: '',
    designation: '',
    dob: '',
    role: 'EMPLOYEE'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (id) {
      fetchEmployee();
    } else {
      setError('No employee ID provided');
      setLoading(false);
    }
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      
      // First, get current user's profile to check permissions
      const profileResponse = await api.get('/employees/me');
      
      // If user is not admin and not editing their own profile, redirect
      if (profileResponse.data.role !== 'ADMIN' && profileResponse.data._id !== id) {
        navigate('/dashboard');
        return;
      }

      // Fetch the employee data
      const response = await api.get(`/employees/${id}`);
      
      // Format the date for the input field
      const employeeData = {
        ...response.data,
        dob: response.data.dob ? response.data.dob.split('T')[0] : ''
      };
      
      setFormData(employeeData);
      setError('');
    } catch (error) {
      console.error('Error fetching employee:', error);
      
      if (error.response) {
        if (error.response.status === 403) {
          setError('You do not have permission to view this employee');
        } else if (error.response.status === 404) {
          setError('Employee not found');
        } else {
          setError(error.response.data?.message || 'Failed to fetch employee data');
        }
      } else if (error.request) {
        setError('No response from server. Please check if backend is running.');
      } else {
        setError('Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');

      await api.put(`/employees/${id}`, formData);
      
      setSuccess('Employee updated successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        if (user?.role === 'ADMIN') {
          navigate('/employees');
        } else {
          navigate('/profile');
        }
      }, 1500);
      
    } catch (error) {
      console.error('Error updating employee:', error);
      
      if (error.response) {
        setError(error.response.data?.message || 'Failed to update employee');
      } else {
        setError('Failed to connect to server');
      }
    }
  };

  const handleCancel = () => {
    if (user?.role === 'ADMIN') {
      navigate('/employees');
    } else {
      navigate('/profile');
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner">Loading employee data...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="edit-container">
        <div className="container">
          <h1>{user?.role === 'ADMIN' ? 'Edit Employee' : 'Edit Profile'}</h1>
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <div style={{ marginTop: '10px' }}>
                <button onClick={fetchEmployee} className="btn btn-secondary" style={{ marginRight: '10px' }}>
                  Retry
                </button>
                <button onClick={handleCancel} className="btn btn-primary">
                  Go Back
                </button>
              </div>
            </div>
          )}
          
          {success && (
            <div className="success-message">
              {success}
            </div>
          )}
          
          {!error && !success && (
            <div className="edit-form">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="username">Username *</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username || ''}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gender">Gender *</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender || ''}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="designation">Designation</label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    value={formData.designation || ''}
                    onChange={handleChange}
                    placeholder="e.g., Software Engineer"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dob">Date of Birth *</label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob || ''}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role">Role *</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role || 'EMPLOYEE'}
                    onChange={handleChange}
                    required
                    disabled={user?.role !== 'ADMIN'}
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  {user?.role !== 'ADMIN' && (
                    <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                      Role cannot be changed
                    </small>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Update
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;