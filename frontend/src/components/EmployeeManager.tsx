import React, { useState } from 'react';
import axios, { AxiosInstance } from 'axios';
import EmployeeUI from './EmployeeUI';

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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/employees";

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
      const newEmployee = { name, email };
      const response = await api.post('', newEmployee);
      setMessage('Employee added successfully!');
      setEmployees([...employees, response.data]);
      setName('');
      setEmail('');
    } catch (error: any) {
      console.error('Error details:', error);
      setMessage(`Error adding employee: ${error.response?.data?.message || error.message}`);
    }
  };

  const fetchEmployees = async (): Promise<void> => {
    try {
      const response = await api.get('');
      setEmployees(response.data);
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

  const updateEmployee = async (id: string, updatedData: Partial<Employee>): Promise<void> => {
    try {
      await api.put(`/${id}`, updatedData);
      setMessage(`Employee with ID ${id} updated successfully!`);
      fetchEmployees();
    } catch (error: any) {
      console.error('Error details:', error);
      setMessage(`Error updating employee: ${error.message}`);
    }
  };

  const deleteEmployee = async (id: string): Promise<void> => {
    try {
      await api.delete(`/${id}`);
      setMessage(`Employee with ID ${id} deleted successfully!`);
      setEmployees(employees.filter((employee) => employee.id !== id));
      setSearchResults(searchResults.filter((employee) => employee.id !== id));
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