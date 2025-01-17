import React, { useState, useEffect } from 'react';
import OnboardingDashboard from './DashBoard';
import '../assets/styles/App.css';

function EmployeeUI({
  name,
  email,
  searchTerm,
  employees,
  searchResults,
  showEmployees,
  message,
  setName,
  setEmail,
  setSearchTerm,
  addEmployee,
  searchEmployees,
  clearSearch,
  toggleEmployees,
  updateEmployee,
  deleteEmployee,
  handleSubmit,
}) {

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'COMPLETED': return 'badge-success';
      case 'IN_PROGRESS': return 'badge-warning';
      case 'FAILED': return 'badge-error';
      default: return 'badge-neutral';
    }
  };

  const renderOnboardingDetails = (employee) => (
    <div className="onboarding-details">
      <h3>Onboarding Status: 
        <span className={`status-badge ${getStatusBadgeClass(employee.onboardingStatus)}`}>
          {employee.onboardingStatus}
        </span>
      </h3>
      {employee.accountId && (
        <p>Account ID: {employee.accountId}</p>
      )}
      {employee.laptopSerialNumber && (
        <p>Laptop Serial: {employee.laptopSerialNumber}</p>
      )}
      {employee.staffPassId && (
        <p>Staff Pass ID: {employee.staffPassId}</p>
      )}
      <p>Welcome Pack: {employee.welcomePackIssued ? '✓ Issued' : '✗ Pending'}</p>
      {employee.onboardingCompletedAt && (
        <p>Completed: {new Date(employee.onboardingCompletedAt).toLocaleString()}</p>
      )}
    </div>
  );

  const renderEmployeeCard = (employee) => {
    const [showOnboarding, setShowOnboarding] = useState(false);
  
    return (
      <div key={employee.id} className="employeeCard">
        <div className="employee-basic-info">
          <p>ID: {employee.id}</p>
          <p>Name: {employee.name}</p>
          <p>Email: {employee.email}</p>
          
          <button 
            onClick={() => setShowOnboarding(!showOnboarding)}
            className="button onboarding-toggle"
          >
            {showOnboarding ? 'Hide Onboarding Details' : 'Show Onboarding Details'}
          </button>
        </div>
  
        {showOnboarding && (
          <OnboardingDashboard 
            employee={employee} 
            onUpdate={() => {
              // Refresh employee data after updates
              if (typeof fetchEmployees === 'function') {
                fetchEmployees();
              }
            }} 
          />
        )}
  
        <div className="card-actions">
          <button
            onClick={() =>
              updateEmployee(employee.id, {
                name: prompt('Enter new name:', employee.name) || employee.name,
                email: prompt('Enter new email:', employee.email) || employee.email,
              })
            }
            className="button"
          >
            Update
          </button>
          <button onClick={() => deleteEmployee(employee.id)} className="button delete-button">
            Delete
          </button>
        </div>
      </div>
    );
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };  

  return (
    <div className="container">
      <h1>Employee Manager</h1>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
        />
        <button type="submit" className="button">Add Employee</button>
      </form>

      <div className="searchContainer">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input"
        />
        <button onClick={searchEmployees} className="button">Search Employee</button>
        <button
          onClick={clearSearch}
          className="button clearButton"
        >
          Clear Search
        </button>
      </div>

      <button onClick={toggleEmployees} className="button">
        {showEmployees ? 'Hide All Employees' : 'Show All Employees'}
      </button>

      {showEmployees && (
        <div className="employeeList">
          <h2>Employee List</h2>
          {employees.length > 0 ? (
            employees.map(renderEmployeeCard)
          ) : (
            <p>No employees to display.</p>
          )}
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="employeeList">
          <h2>Search Results</h2>
          {searchResults.map(renderEmployeeCard)}
        </div>
      )}

      <button onClick={scrollToTop} className="scrollToTopButton">↑</button>
    </div>
  );
}

export default EmployeeUI;