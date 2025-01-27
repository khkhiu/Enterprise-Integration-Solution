import React, { useState } from 'react';
import axios, { AxiosInstance } from 'axios';
import EmployeeUI from './EmployeeUI';

interface Employee {
  id: number;
  name: string;
  email: string;
  onboardingStatus: string;
  accountId?: string;
  laptopSerialNumber?: string;
  staffPassId?: string;
  welcomePackIssued: boolean;
  onboardingCompletedAt?: string;
}

const API_URL = /*import.meta.env.VITE_API_URL ||*/ "http://localhost:8080/employees";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:8080/employees",
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const EmployeeManager: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchResults, setSearchResults] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [showEmployees, setShowEmployees] = useState<boolean>(false);

  const addEmployee = async (): Promise<void> => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email })
      });

      if (!response.ok) {
        throw new Error('Failed to add employee');
      }

      const newEmployee = await response.json();
      setMessage('Employee added successfully!');
      setEmployees([...employees, newEmployee]);
      setName('');
      setEmail('');
    } catch (error: any) {
      console.error('Error details:', error);
      setMessage(`Error adding employee: ${error.message}`);
    }
  };
  const fetchEmployees = async (): Promise<void> => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error: any) {
      console.error('Error details:', error);
      setMessage(`Error fetching employees: ${error.message}`);
    }
  };

  const toggleEmployees = async (): Promise<void> => {
    if (!showEmployees) {
      await fetchEmployees();
    }
    setShowEmployees(!showEmployees);
  };

  const searchEmployees = async (): Promise<void> => {
    try {
      const response = await api.get('');
      const filtered = response.data.filter(
        (employee: Employee) =>
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
      setMessage(filtered.length ? '' : 'No employees found matching your search.');
    } catch (error: any) {
      console.error('Error details:', error);
      setMessage(`Error searching employees: ${error.message}`);
    }
  };

  const clearSearch = (): void => {
    setSearchResults([]);
    setSearchTerm('');
    setMessage('');
  };

  const updateEmployee = async (id: number, updatedData: Partial<Employee>): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        throw new Error('Failed to update employee');
      }

      const updatedEmployee = await response.json();
      setMessage(`Employee updated successfully!`);
      setEmployees(employees.map(emp => 
        emp.id === id ? updatedEmployee : emp
      ));
    } catch (error: any) {
      console.error('Error details:', error);
      setMessage(`Error updating employee: ${error.message}`);
    }
  };

  const deleteEmployee = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }

      setMessage(`Employee deleted successfully!`);
      setEmployees(employees.filter(emp => emp.id !== id));
      setSearchResults(searchResults.filter(emp => emp.id !== id));
    } catch (error: any) {
      console.error('Error details:', error);
      setMessage(`Error deleting employee: ${error.message}`);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
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
};

export default EmployeeManager;