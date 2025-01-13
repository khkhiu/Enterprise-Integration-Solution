import React from 'react';

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
    <div>
      <h1>Employee Manager</h1>

      {/* Display success/error messages */}
      {message && <p>{message}</p>}

      {/* Form for adding a new employee */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Add Employee</button>
      </form>

      {/* Search bar with search and clear buttons */}
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', width: '60%' }}
        />
        <button
          onClick={searchEmployees}
          style={{ padding: '10px', marginLeft: '10px' }}
        >
          Search Employee
        </button>
        <button
          onClick={clearSearch}
          style={{
            padding: '10px',
            marginLeft: '10px',
            backgroundColor: '#f44336',
            color: '#fff',
          }}
        >
          Clear Search
        </button>
      </div>

      {/* Button to toggle show/hide employees */}
      <button onClick={toggleEmployees} style={{ marginTop: '20px' }}>
        {showEmployees ? 'Hide All Employees' : 'Show All Employees'}
      </button>

      {/* Display all employees */}
      {showEmployees && (
        <div>
          <h2>Employee List</h2>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <div
                key={employee.id}
                style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}
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
        <div>
          <h2>Search Results</h2>
          {searchResults.map((employee) => (
            <div
              key={employee.id}
              style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}
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
