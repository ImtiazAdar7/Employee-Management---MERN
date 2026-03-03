import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:5000/api/employees/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="container">
          <h1>My Profile</h1>
          <div className="profile-card">
            <div className="profile-grid">
              <div className="profile-item">
                <div className="label">First Name:</div>
                <div className="value">{profile?.firstName}</div>
              </div>
              <div className="profile-item">
                <div className="label">Last Name:</div>
                <div className="value">{profile?.lastName}</div>
              </div>
              <div className="profile-item">
                <div className="label">Email:</div>
                <div className="value">{profile?.email}</div>
              </div>
              <div className="profile-item">
                <div className="label">Username:</div>
                <div className="value">{profile?.username}</div>
              </div>
              <div className="profile-item">
                <div className="label">Gender:</div>
                <div className="value">{profile?.gender}</div>
              </div>
              <div className="profile-item">
                <div className="label">Designation:</div>
                <div className="value">{profile?.designation || 'Not specified'}</div>
              </div>
              <div className="profile-item">
                <div className="label">Date of Birth:</div>
                <div className="value">{new Date(profile?.dob).toLocaleDateString()}</div>
              </div>
              <div className="profile-item">
                <div className="label">Role:</div>
                <div className="value">{profile?.role}</div>
              </div>
              <div className="profile-item">
                <div className="label">Member Since:</div>
                <div className="value">{new Date(profile?.created_at).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;