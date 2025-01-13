import React, { useState } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:8080/employees"; // Backend API URL

function EmployeeManager() {
  const [name, setName] = useState(''); // Holds the name entered by the user
  const [email, setEmail] = useState(''); // Holds the email entered by the user
  const [employees, setEmployees] = useState([]); // Holds all employee data
  const [searchResults, setSearchResults] = useState([]); // Holds search results
  const [searchTerm, setSearchTerm] = useState(''); // Search query for name/email
  const [message, setMessage] = useState(''); // Success/error messages
  const [showEmployees, setShowEmployees] = useState(false); // Toggle for employee list visibility

  // Function to add a new employee
  const addEmployee = async () => {
    try {
      const newEmployee = { name, email };
      const response = await axios.post(API_URL, newEmployee, {
        headers: { "Content-Type": "application/json" },
      });
      setMessage('Employee added successfully!');
      setEmployees([...employees, response.data]); // Update the employee list
      setName('');
      setEmail('');
    } catch (error) {
      setMessage(`Error adding employee: ${error.response?.data?.message || error.message}`);
    }
  };

  // Function to fetch all employees
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL);
      setEmployees(response.data);
    } catch (error) {
      setMessage(`Error fetching employees: ${error.message}`);
    }
  };

  // Toggle employee list visibility
  const toggleEmployees = async () => {
    if (!showEmployees) {
      await fetchEmployees();
    }
    setShowEmployees(!showEmployees);
  };

  // Function to search employees by name or email
  const searchEmployees = async () => {
    try {
      const response = await axios.get(API_URL);
      const filtered = response.data.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
      setMessage(filtered.length ? '' : 'No employees found matching your search.');
    } catch (error) {
      setMessage(`Error searching employees: ${error.message}`);
    }
  };

  // Function to clear search results
  const clearSearch = () => {
    setSearchResults([]); // Clear the search results
    setSearchTerm(''); // Clear the search input field
    setMessage(''); // Clear any messages
  };

  // Function to update an employee's information
  const updateEmployee = async (id, updatedData) => {
    try {
      await axios.put(`${API_URL}/${id}`, updatedData, {
        headers: { "Content-Type": "application/json" },
      });
      setMessage(`Employee with ID ${id} updated successfully!`);
      fetchEmployees(); // Refresh the employee list
    } catch (error) {
      setMessage(`Error updating employee: ${error.message}`);
    }
  };

  // Function to delete an employee
  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMessage(`Employee with ID ${id} deleted successfully!`);
      setEmployees(employees.filter((employee) => employee.id !== id)); // Remove from UI
      setSearchResults(searchResults.filter((employee) => employee.id !== id));
    } catch (error) {
      setMessage(`Error deleting employee: ${error.message}`);
    }
  };

  // Handle form submission for adding an employee
  const handleSubmit = (e) => {
    e.preventDefault();
    addEmployee();
  };

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
          style={{ padding: '10px', marginLeft: '10px', backgroundColor: '#f44336', color: '#fff' }}
        >
          Clear Search
        </button>
      </div>

      {/* Button to toggle show/hide employees */}
      <button onClick={toggleEmployees} style={{ marginTop: '20px' }}>
        {showEmployees ? "Hide All Employees" : "Show All Employees"}
      </button>

      {/* Display all employees */}
      {showEmployees && (
        <div>
          <h2>Employee List</h2>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <div
                key={employee.id}
                style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}
              >
                <p>ID: {employee.id}</p>
                <p>Name: {employee.name}</p>
                <p>Email: {employee.email}</p>
                <button
                  onClick={() =>
                    updateEmployee(employee.id, {
                      name: prompt("Enter new name:", employee.name) || employee.name,
                      email: prompt("Enter new email:", employee.email) || employee.email,
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
              style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}
            >
              <p>ID: {employee.id}</p>
              <p>Name: {employee.name}</p>
              <p>Email: {employee.email}</p>
              <button
                onClick={() =>
                  updateEmployee(employee.id, {
                    name: prompt("Enter new name:", employee.name) || employee.name,
                    email: prompt("Enter new email:", employee.email) || employee.email,
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

export default EmployeeManager;
