import React, { useState, useEffect } from 'react';
import axios, { AxiosInstance } from 'axios';
import { AlertCircle, CheckCircle, Clock, Package } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Employee {
  id: number; // Changed from string to number to match backend Long type
  name: string;
  email: string;
  onboardingStatus: string; // Changed to match backend enum
  accountId?: string;
  laptopSerialNumber?: string;
  staffPassId?: string;
  welcomePackIssued: boolean;
  onboardingCompletedAt?: string;
}

interface OnboardingDashboardProps {
  employee: Employee;
  onUpdate: () => void;
}

interface OnboardingDetails {
  [key: string]: any;
}

const OnboardingDashboard: React.FC<OnboardingDashboardProps> = ({ employee: initialEmployee, onUpdate }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [onboardingDetails, setOnboardingDetails] = useState<OnboardingDetails | null>(null);
  const [employee, setEmployee] = useState<Employee>(initialEmployee);

  const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080/employees',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  
  useEffect(() => {
    if (employee?.id) {
      fetchOnboardingDetails();
    }
  }, [employee]);

    // Update local employee state when prop changes
    useEffect(() => {
      setEmployee(initialEmployee);
    }, [initialEmployee]);

  const fetchOnboardingDetails = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await api.get(`/${employee.id}/onboarding`);
      setOnboardingDetails(response.data);
    } catch (error) {
      setError('Failed to fetch onboarding details');
    } finally {
      setIsLoading(false);
    }
  };

  const getToggleEndpoint = (itemType: string): string => {
    switch (itemType) {
      case 'onboarding-status':
        return 'onboarding/status';
      case 'laptop':
        return 'equipment/laptop';
      case 'staff-pass':
        return 'access/staff-pass';
      case 'welcome-pack':
        return 'onboarding/welcome-pack';
      default:
        return itemType;
    }
  };

  // Use random ID for the time being
  const generateRandomId = (prefix: string) => {
    return `${prefix}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  };

  const toggleItem = async (itemType: string) => {
    setIsLoading(true);
    try {
      const updatedEmployee = { ...employee };
      
      switch (itemType) {
        case 'onboarding-status':
          updatedEmployee.onboardingStatus = 
            employee.onboardingStatus === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
          updatedEmployee.onboardingCompletedAt = 
            updatedEmployee.onboardingStatus === 'COMPLETED' ? new Date().toISOString() : undefined;
          break;
          
        case 'laptop':
          updatedEmployee.laptopSerialNumber = 
            employee.laptopSerialNumber ? undefined : generateRandomId('LAP');
          break;
          
        case 'staff-pass':
          updatedEmployee.staffPassId = 
            employee.staffPassId ? undefined : generateRandomId('PASS');
          break;
          
        case 'welcome-pack':
          updatedEmployee.welcomePackIssued = !employee.welcomePackIssued;
          break;
      }
  
      // Update through Spring Boot API
      /*
      const response = await fetch(`http://localhost:8080/employees/${employee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedEmployee,
          onboardingCompletedAt: updatedEmployee.onboardingCompletedAt 
            ? new Date(updatedEmployee.onboardingCompletedAt)
            : null
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update ${itemType}`);
      }
      */
      const response = await api.put(`/${employee.id}`, updatedEmployee);

      if (response.status !== 200) {
        throw new Error(`Failed to update ${itemType}`);
      }

      //const responseData = await response.json();
      //setEmployee(responseData);
      setEmployee(response.data);
      onUpdate(); // Notify parent component
      setError(null);
    } catch (error) {
      setError(`Failed to toggle ${itemType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error(`Error toggling ${itemType}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: Employee['onboardingStatus']): string => {
    switch (status) {
      case 'COMPLETED': return 'text-green-500';
      case 'IN_PROGRESS': return 'text-yellow-500';
      case 'FAILED': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const retryOnboarding = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await api.post(`/${employee.id}/onboarding/retry`);
      await fetchOnboardingDetails();
      onUpdate();
    } catch (error) {
      setError('Failed to retry onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg">
        <p className="text-white">Loading onboarding details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="onboarding-dashboard p-4 bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-white">Onboarding Progress</h2>
      
      <div className="status-section mb-6">
        <h3 className="text-lg font-semibold mb-2 text-white flex items-center">
          Status: 
          <span className={`ml-2 ${getStatusColor(employee.onboardingStatus)}`}>
            {employee.onboardingStatus}
          </span>
          <button
            onClick={() => toggleItem('onboarding-status')}
            className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoading}
          >
            Toggle Status
          </button>
        </h3>
        {employee.onboardingCompletedAt && (
          <p className="text-sm text-gray-400">
            Completed: {new Date(employee.onboardingCompletedAt).toLocaleString()}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="detail-card p-4 border border-gray-700 rounded bg-gray-800 text-white">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Account Setup</h4>
            {employee.accountId ? (
              <CheckCircle className="text-green-500 h-5 w-5" />
            ) : (
              <Clock className="text-yellow-500 h-5 w-5" />
            )}
          </div>
          {employee.accountId && (
            <p className="text-sm mt-2">Account ID: {employee.accountId}</p>
          )}
        </div>

        <div className="detail-card p-4 border border-gray-700 rounded bg-gray-800 text-white">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Equipment</h4>
            {employee.laptopSerialNumber ? (
              <CheckCircle className="text-green-500 h-5 w-5" />
            ) : (
              <Clock className="text-yellow-500 h-5 w-5" />
            )}
            <button
              onClick={() => toggleItem('laptop')}
              className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={isLoading}
            >
              Toggle Laptop
            </button>
          </div>
          {employee.laptopSerialNumber && (
            <p className="text-sm mt-2">Laptop SN: {employee.laptopSerialNumber}</p>
          )}
        </div>

        <div className="detail-card p-4 border border-gray-700 rounded bg-gray-800 text-white">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Staff Pass</h4>
            {employee.staffPassId ? (
              <CheckCircle className="text-green-500 h-5 w-5" />
            ) : (
              <Clock className="text-yellow-500 h-5 w-5" />
            )}
            <button
              onClick={() => toggleItem('staff-pass')}
              className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={isLoading}
            >
              Toggle Pass
            </button>
          </div>
          {employee.staffPassId && (
            <p className="text-sm mt-2">Pass ID: {employee.staffPassId}</p>
          )}
        </div>

        <div className="detail-card p-4 border border-gray-700 rounded bg-gray-800 text-white">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Welcome Pack</h4>
            {employee.welcomePackIssued ? (
              <CheckCircle className="text-green-500 h-5 w-5" />
            ) : (
              <Package className="text-yellow-500 h-5 w-5" />
            )}
            <button
              onClick={() => toggleItem('welcome-pack')}
              className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={isLoading}
            >
              Toggle Pack
            </button>
          </div>
          <p className="text-sm mt-2">
            {employee.welcomePackIssued ? 'Issued' : 'Pending'}
          </p>
        </div>
      </div>

      {employee.onboardingStatus === 'FAILED' && (
        <div className="mt-6">
          <button
            onClick={retryOnboarding}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Retry Onboarding
          </button>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default OnboardingDashboard;