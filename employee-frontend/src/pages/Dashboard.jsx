import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <div className="container">
          <h1>Dashboard</h1>
          <div className="welcome-card">
            <h2>Welcome, {user?.firstName}!</h2>
            <p>Role: {user?.role}</p>
            <p>Email: {user?.email}</p>
            <p>Designation: {user?.designation || 'Not specified'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;