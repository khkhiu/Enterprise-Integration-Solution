import React from 'react';
import '../assets/styles/App.css'; // Import the CSS file

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
  return (
    <div className="container">
      <h1>Employee Manager</h1>

      {/* Display success/error messages */}
      {message && <p>{message}</p>}

      {/* Form for adding a new employee */}
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

      {/* Search bar with search and clear buttons */}
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

      {/* Button to toggle show/hide employees */}
      <button onClick={toggleEmployees} className="button">
        {showEmployees ? 'Hide All Employees' : 'Show All Employees'}
      </button>

      {/* Display all employees */}
      {showEmployees && (
        <div className="employeeList">
          <h2>Employee List</h2>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <div
                key={employee.id}
                className="employeeCard"
              >
                <p>ID: {employee.id}</p>
                <p>Name: {employee.name}</p>
                <p>Email: {employee.email}</p>
                <button
                  onClick={() =>
                    updateEmployee(employee.id, {
                      name: prompt('Enter new name:', employee.name) || employee.name,
                      email: prompt('Enter new email:', employee.email) || employee.email,
                    })
                  }
                >
                  Update
                </button>
                <button onClick={() => deleteEmployee(employee.id)}>Delete</button>
              </div>
            ))
          ) : (
            <p>No employees to display.</p>
          )}
        </div>
      )}

      {/* Display search results */}
      {searchResults.length > 0 && (
        <div className="employeeList">
          <h2>Search Results</h2>
          {searchResults.map((employee) => (
            <div
              key={employee.id}
              className="employeeCard"
            >
              <p>ID: {employee.id}</p>
              <p>Name: {employee.name}</p>
              <p>Email: {employee.email}</p>
              <button
                onClick={() =>
                  updateEmployee(employee.id, {
                    name: prompt('Enter new name:', employee.name) || employee.name,
                    email: prompt('Enter new email:', employee.email) || employee.email,
                  })
                }
              >
                Update
              </button>
              <button onClick={() => deleteEmployee(employee.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmployeeUI;
