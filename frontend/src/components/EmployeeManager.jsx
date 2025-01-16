import React, { useState } from 'react';
import axios from 'axios';
import EmployeeUI from './EmployeeUI';

// Get API URL from environment variable or use fallback
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/employees";

// Create axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:8080/employees", // Always use localhost in browser
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

function EmployeeManager() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [employees, setEmployees] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [showEmployees, setShowEmployees] = useState(false);

  const addEmployee = async () => {
    try {
      const newEmployee = { name, email };
      const response = await api.post('', newEmployee);
      setMessage('Employee added successfully!');
      setEmployees([...employees, response.data]);
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Error details:', error);
      setMessage(`Error adding employee: ${error.response?.data?.message || error.message}`);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get('');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error details:', error);
      setMessage(`Error fetching employees: ${error.message}`);
    }
  };

  const toggleEmployees = async () => {
    if (!showEmployees) {
      await fetchEmployees();
    }
    setShowEmployees(!showEmployees);
  };

  const searchEmployees = async () => {
    try {
      const response = await api.get('');
      const filtered = response.data.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
      setMessage(filtered.length ? '' : 'No employees found matching your search.');
    } catch (error) {
      console.error('Error details:', error);
      setMessage(`Error searching employees: ${error.message}`);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setSearchTerm('');
    setMessage('');
  };

  const updateEmployee = async (id, updatedData) => {
    try {
      await api.put(`/${id}`, updatedData);
      setMessage(`Employee with ID ${id} updated successfully!`);
      fetchEmployees();
    } catch (error) {
      console.error('Error details:', error);
      setMessage(`Error updating employee: ${error.message}`);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await api.delete(`/${id}`);
      setMessage(`Employee with ID ${id} deleted successfully!`);
      setEmployees(employees.filter((employee) => employee.id !== id));
      setSearchResults(searchResults.filter((employee) => employee.id !== id));
    } catch (error) {
      console.error('Error details:', error);
      setMessage(`Error deleting employee: ${error.message}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addEmployee();
  };

  return (
    <EmployeeUI
      name={name}
      email={email}
      searchTerm={searchTerm}
      employees={employees}
      searchResults={searchResults}
      showEmployees={showEmployees}
      message={message}
      setName={setName}
      setEmail={setEmail}
      setSearchTerm={setSearchTerm}
      addEmployee={addEmployee}
      searchEmployees={searchEmployees}
      clearSearch={clearSearch}
      toggleEmployees={toggleEmployees}
      updateEmployee={updateEmployee}
      deleteEmployee={deleteEmployee}
      handleSubmit={handleSubmit}
    />
  );
}

export default EmployeeManager;