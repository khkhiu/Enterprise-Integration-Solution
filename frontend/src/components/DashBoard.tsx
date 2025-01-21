import React, { useState, useEffect } from 'react';
import axios, { AxiosInstance } from 'axios';
import { AlertCircle, CheckCircle, Clock, Package } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

interface OnboardingDashboardProps {
  employee: Employee;
  onUpdate: () => void;
}

interface OnboardingDetails {
  [key: string]: any;
}

interface ButtonState {
  isIssued: boolean;
  canIssue: boolean;
}

interface ButtonStates {
  [key: string]: ButtonState;
}

const OnboardingDashboard: React.FC<OnboardingDashboardProps> = ({ employee: initialEmployee, onUpdate }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [onboardingDetails, setOnboardingDetails] = useState<OnboardingDetails | null>(null);
  const [employee, setEmployee] = useState<Employee>(initialEmployee);
  const [buttonStates, setButtonStates] = useState<ButtonStates>({
    'account-setup': { isIssued: false, canIssue: true },
    'laptop': { isIssued: false, canIssue: true },
    'staff-pass': { isIssued: false, canIssue: true },
    'welcome-pack': { isIssued: false, canIssue: true }
  });

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

  useEffect(() => {
    setEmployee(initialEmployee);
  }, [initialEmployee]);

  useEffect(() => {
    // Update button states based on employee data
    setButtonStates({
      'account-setup': { isIssued: !!employee.accountId, canIssue: !employee.accountId },
      'laptop': { isIssued: !!employee.laptopSerialNumber, canIssue: !employee.laptopSerialNumber },
      'staff-pass': { isIssued: !!employee.staffPassId, canIssue: !employee.staffPassId },
      'welcome-pack': { isIssued: employee.welcomePackIssued, canIssue: !employee.welcomePackIssued }
    });
  }, [employee]);

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

  const generateRandomId = (prefix: string) => {
    return `${prefix}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  };

  const handleIssue = async (itemType: string) => {
    setIsLoading(true);
    try {
      const updatedEmployee = { ...employee };
      
      switch (itemType) {
        case 'account-setup':
          updatedEmployee.accountId = generateRandomId('ACC');
          break;
        case 'laptop':
          updatedEmployee.laptopSerialNumber = generateRandomId('LAP');
          break;
        case 'staff-pass':
          updatedEmployee.staffPassId = generateRandomId('PASS');
          break;
        case 'welcome-pack':
          updatedEmployee.welcomePackIssued = true;
          break;
      }
  
      const response = await api.put(`/${employee.id}`, updatedEmployee);

      if (response.status !== 200) {
        throw new Error(`Failed to issue ${itemType}`);
      }

      setEmployee(response.data);
      onUpdate();
      setError(null);

      setButtonStates(prev => ({
        ...prev,
        [itemType]: { isIssued: true, canIssue: false }
      }));
    } catch (error) {
      setError(`Failed to issue ${itemType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturn = async (itemType: string) => {
    setIsLoading(true);
    try {
      const updatedEmployee = { ...employee };
      
      switch (itemType) {
        case 'account-setup':
          updatedEmployee.accountId = undefined;
          break;
        case 'laptop':
          updatedEmployee.laptopSerialNumber = undefined;
          break;
        case 'staff-pass':
          updatedEmployee.staffPassId = undefined;
          break;
        case 'welcome-pack':
          updatedEmployee.welcomePackIssued = false;
          break;
      }
  
      const response = await api.put(`/${employee.id}`, updatedEmployee);

      if (response.status !== 200) {
        throw new Error(`Failed to return ${itemType}`);
      }

      setEmployee(response.data);
      onUpdate();
      setError(null);

      setButtonStates(prev => ({
        ...prev,
        [itemType]: { isIssued: false, canIssue: true }
      }));
    } catch (error) {
      setError(`Failed to return ${itemType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
            <div className="flex gap-2">
              <button
                onClick={() => handleIssue('account-setup')}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={isLoading || !buttonStates['account-setup'].canIssue}
              >
                Issue Account
              </button>
              <button
                onClick={() => handleReturn('account-setup')}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                disabled={isLoading || !buttonStates['account-setup'].isIssued}
              >
                Return
              </button>
            </div>
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
            <div className="flex gap-2">
              <button
                onClick={() => handleIssue('laptop')}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={isLoading || !buttonStates['laptop'].canIssue}
              >
                Issue Laptop
              </button>
              <button
                onClick={() => handleReturn('laptop')}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                disabled={isLoading || !buttonStates['laptop'].isIssued}
              >
                Return
              </button>
            </div>
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
            <div className="flex gap-2">
              <button
                onClick={() => handleIssue('staff-pass')}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={isLoading || !buttonStates['staff-pass'].canIssue}
              >
                Issue Pass
              </button>
              <button
                onClick={() => handleReturn('staff-pass')}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                disabled={isLoading || !buttonStates['staff-pass'].isIssued}
              >
                Return
              </button>
            </div>
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
            <div className="flex gap-2">
              <button
                onClick={() => handleIssue('welcome-pack')}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={isLoading || !buttonStates['welcome-pack'].canIssue}
              >
                Issue Pack
              </button>
              <button
                onClick={() => handleReturn('welcome-pack')}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                disabled={isLoading || !buttonStates['welcome-pack'].isIssued}
              >
                Return
              </button>
            </div>
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