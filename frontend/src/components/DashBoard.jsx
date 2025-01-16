import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle, Clock, Package } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const OnboardingDashboard = ({ employee, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [onboardingDetails, setOnboardingDetails] = useState(null);

  const api = axios.create({
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

  const fetchOnboardingDetails = async () => {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-500';
      case 'IN_PROGRESS': return 'text-yellow-500';
      case 'FAILED': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const retryOnboarding = async () => {
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
    return <div className="p-4">Loading onboarding details...</div>;
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
    <div className="onboarding-dashboard p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Onboarding Progress</h2>
      
      {/* Overall Status */}
      <div className="status-section mb-6">
        <h3 className="text-lg font-semibold mb-2">Status: 
          <span className={`ml-2 ${getStatusColor(employee.onboardingStatus)}`}>
            {employee.onboardingStatus}
          </span>
        </h3>
        {employee.onboardingCompletedAt && (
          <p className="text-sm text-gray-600">
            Completed: {new Date(employee.onboardingCompletedAt).toLocaleString()}
          </p>
        )}
      </div>

      {/* Account Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="detail-card p-4 border rounded">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Account Setup</h4>
            {employee.accountId ? (
              <CheckCircle className="text-green-500 h-5 w-5" />
            ) : (
              <Clock className="text-yellow-500 h-5 w-5" />
            )}
          </div>
          {employee.accountId ? (
            <p className="text-sm mt-2">Account ID: {employee.accountId}</p>
          ) : (
            <p className="text-sm mt-2 text-yellow-600">Account creation in progress</p>
          )}
        </div>

        {/* Equipment Assignment */}
        <div className="detail-card p-4 border rounded">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Equipment</h4>
            {employee.laptopSerialNumber ? (
              <CheckCircle className="text-green-500 h-5 w-5" />
            ) : (
              <Clock className="text-yellow-500 h-5 w-5" />
            )}
          </div>
          {employee.laptopSerialNumber && (
            <p className="text-sm mt-2">Laptop SN: {employee.laptopSerialNumber}</p>
          )}
        </div>

        {/* Staff Pass */}
        <div className="detail-card p-4 border rounded">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Staff Pass</h4>
            {employee.staffPassId ? (
              <CheckCircle className="text-green-500 h-5 w-5" />
            ) : (
              <Clock className="text-yellow-500 h-5 w-5" />
            )}
          </div>
          {employee.staffPassId && (
            <p className="text-sm mt-2">Pass ID: {employee.staffPassId}</p>
          )}
        </div>

        {/* Welcome Pack */}
        <div className="detail-card p-4 border rounded">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Welcome Pack</h4>
            {employee.welcomePackIssued ? (
              <CheckCircle className="text-green-500 h-5 w-5" />
            ) : (
              <Package className="text-yellow-500 h-5 w-5" />
            )}
          </div>
          <p className="text-sm mt-2">
            {employee.welcomePackIssued ? 'Issued' : 'Pending'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
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
    </div>
  );
};

export default OnboardingDashboard;