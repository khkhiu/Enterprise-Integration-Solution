import React, { useState } from 'react';
import OnboardingDashboard from './DashBoard';
import '../assets/styles/index.css';

interface Employee {
  id: string;
  name: string;
  email: string;
  onboardingStatus: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED';
  accountId?: string;
  laptopSerialNumber?: string;
  staffPassId?: string;
  welcomePackIssued: boolean;
  onboardingCompletedAt?: string;
}

interface EmployeeUIProps {
  name: string;
  email: string;
  searchTerm: string;
  employees: Employee[];
  searchResults: Employee[];
  showEmployees: boolean;
  message: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setSearchTerm: (term: string) => void;
  addEmployee: () => Promise<void>;
  searchEmployees: () => Promise<void>;
  clearSearch: () => void;
  toggleEmployees: () => Promise<void>;
  updateEmployee: (id: string, data: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const EmployeeUI: React.FC<EmployeeUIProps> = ({
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
}) => {
  const getStatusBadgeClass = (status: Employee['onboardingStatus']): string => {
    switch (status) {
      case 'COMPLETED': return 'badge-success';
      case 'IN_PROGRESS': return 'badge-warning';
      case 'FAILED': return 'badge-error';
      default: return 'badge-neutral';
    }
  };

  const renderOnboardingDetails = (employee: Employee) => (
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

  const renderEmployeeCard = (employee: Employee) => {
    const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  
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
            onClick={() => {
              const newName = prompt('Enter new name:', employee.name);
              const newEmail = prompt('Enter new email:', employee.email);
              if (newName || newEmail) {
                updateEmployee(employee.id, {
                  name: newName || employee.name,
                  email: newEmail || employee.email,
                });
              }
            }}
            className="button"
          >
            Update
          </button>
          <button 
            onClick={() => deleteEmployee(employee.id)} 
            className="button delete-button"
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  const scrollToTop = (): void => {
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          required
          className="input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
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
};

export default EmployeeUI;