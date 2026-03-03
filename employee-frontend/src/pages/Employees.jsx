import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('name');
  const { user } = useAuth();

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [searchTerm, searchField, employees]);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    if (!searchTerm.trim()) {
      setFilteredEmployees(employees);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = employees.filter(emp => {
      switch(searchField) {
        case 'name':
          return `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchLower);
        case 'email':
          return emp.email.toLowerCase().includes(searchLower);
        case 'username':
          return emp.username.toLowerCase().includes(searchLower);
        case 'designation':
          return emp.designation?.toLowerCase().includes(searchLower) || false;
        default:
          return true;
      }
    });
    
    setFilteredEmployees(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFieldChange = (e) => {
    setSearchField(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredEmployees(employees);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="employees-container">
        <div className="container">
          <div className="header-actions">
            <h1>Employees</h1>
            {user?.role === 'ADMIN' && (
              <Link to="/employees/create" className="btn btn-primary">
                + Create New Employee
              </Link>
            )}
          </div>

          {/* Search Section */}
          <div className="search-section">
            <div className="search-box">
              <div className="search-input-group">
                <select 
                  value={searchField} 
                  onChange={handleFieldChange}
                  className="search-field-select"
                >
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="username">Username</option>
                  <option value="designation">Designation</option>
                </select>
                <input
                  type="text"
                  placeholder={`Search by ${searchField}...`}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                {searchTerm && (
                  <button onClick={clearSearch} className="clear-search-btn">
                    ✕
                  </button>
                )}
              </div>
            </div>
            <div className="search-results-info">
              Found {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Designation</th>
                  <th>Gender</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr key={employee._id}>
                      <td>
                        <Link to={`/employees/profile/${employee._id}`} className="employee-name-link">
                          {employee.firstName} {employee.lastName}
                        </Link>
                      </td>
                      <td>{employee.email}</td>
                      <td>{employee.username}</td>
                      <td>{employee.designation || '-'}</td>
                      <td>{employee.gender}</td>
                      <td>
                        <span className={`role-badge role-${employee.role.toLowerCase()}`}>
                          {employee.role}
                        </span>
                      </td>
                      <td>
                        <div className="action-links">
                          <Link
                            to={`/employees/profile/${employee._id}`}
                            className="view-link"
                            title="View Profile"
                          >
                            👁️ View
                          </Link>
                          <Link
                            to={`/employees/edit/${employee._id}`}
                            className="edit-link"
                            title="Edit"
                          >
                            ✏️ Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(employee._id)}
                            className="delete-btn"
                            title="Delete"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-results">
                      No employees found matching your search
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employees;