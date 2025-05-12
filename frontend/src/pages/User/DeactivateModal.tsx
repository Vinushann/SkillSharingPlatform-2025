import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { accountApi } from "../../api/accountApi";
import { AccountDeactivationRequest } from "../../types/account-types";

interface DeactivateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '450px',
    padding: '0',
    border: 'none',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
  },
};

const DeactivateModal = ({ onClose, isOpen }: DeactivateModalProps) => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccess(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  const clearStorageAndRedirect = () => {
    // Clear local storage
    localStorage.clear();
    
    // Clear session storage if needed
    sessionStorage.clear();
    
    // Redirect to login
    navigate('/login');
  };

  const deactivateAccount = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const deactivationData: AccountDeactivationRequest = {
        deactivateStartDate: startDate.toISOString(),
        deactivateEndDate: endDate.toISOString(),
      };

      await accountApi.deactivateAccount(localStorage.getItem("userId")!, deactivationData);
      
      setSuccess(true);
      
      // If deactivation starts today, clear storage and redirect
      if (isToday(startDate)) {
        setTimeout(() => {
          clearStorageAndRedirect();
        }, 1500); // Show success message briefly before redirecting
      } else {
        // Show alert for future deactivation
        setTimeout(() => {
          alert(`Your account will be deactivated starting on ${startDate.toLocaleDateString()}`);
          onClose();
        }, 1500);
      }
    } catch (error) {
      setError('Failed to deactivate account. Please try again.');
      console.error("Failed to deactivate account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Deactivate Account Modal"
      ariaHideApp={false}
    >
      <div className="relative">
        {/* Header with red gradient */}
        <div className="bg-gradient-to-r from-red-500 to-red-700 p-5 rounded-t-lg">
          <h2 className="text-xl font-bold text-white">Deactivate Account</h2>
          <p className="text-white text-opacity-90 text-sm mt-1">
            Your account will be unavailable during the deactivation period
          </p>
        </div>
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Account Deactivated</h3>
              <p className="mt-2 text-sm text-gray-500">
                {isToday(startDate) ? 'Redirecting you to login...' : 'Your account will be deactivated as scheduled.'}
              </p>
            </div>
          ) : (
            <>
              <p className="mb-6 text-gray-600">
                Choose when you want your account to be deactivated and when it should be reactivated.
              </p>
              
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date) => setStartDate(date)}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  minDate={new Date()}
                  dateFormat="MMMM d, yyyy"
                />
                {isToday(startDate) && (
                  <p className="mt-1 text-sm text-red-600">Your account will be deactivated immediately</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date) => setEndDate(date)}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  minDate={new Date(startDate.getTime() + 24 * 60 * 60 * 1000)} // At least one day after start date
                  dateFormat="MMMM d, yyyy"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Your account will be automatically reactivated on this date
                </p>
              </div>

              {error && (
                <div className="p-3 mb-5 bg-red-50 border-l-4 border-red-500 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel
                </button>
                <button
                  onClick={deactivateAccount}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : 'Deactivate Account'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DeactivateModal;