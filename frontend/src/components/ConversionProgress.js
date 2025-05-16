import React, { useEffect, useState, useCallback } from 'react';
import { getConversionStatus } from '../services/apiService';
import './ConversionProgress.css';

const ConversionProgress = ({ status, progress, error, conversionId, onStatusUpdate }) => {
  const [pollingInterval, setPollingInterval] = useState(null);
  
  // Function to fetch the current status
  const checkStatus = useCallback(async () => {
    try {
      const response = await getConversionStatus(conversionId);
      onStatusUpdate(response.data);
      
      // If conversion is completed or failed, stop polling
      if (response.data.status === 'completed' || response.data.status === 'failed') {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
    } catch (error) {
      console.error('Error checking conversion status:', error);
      // Don't stop polling on error, just log it
    }
  }, [conversionId, onStatusUpdate, pollingInterval]);
  
  // Set up polling on mount
  useEffect(() => {
    // Initial status check
    checkStatus();
    
    // Set up polling every 2 seconds
    const interval = setInterval(checkStatus, 2000);
    setPollingInterval(interval);
    
    // Clean up on unmount
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [checkStatus]);
  
  // Status-specific UI elements
  const renderStatusContent = () => {
    switch (status) {
      case 'pending':
        return (
          <>
            <div className="text-center mb-4">
              <div className="spinner-grow text-primary" role="status">
                <span className="visually-hidden">Preparing...</span>
              </div>
              <h5 className="mt-3">Preparing your file for conversion</h5>
              <p className="text-muted">This won't take long...</p>
            </div>
          </>
        );
      
      case 'processing':
        return (
          <>
            <div className="text-center mb-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Converting...</span>
              </div>
              <h5 className="mt-3">Converting your notebook to PDF</h5>
              <p className="text-muted">Processing code cells, markdown, and outputs...</p>
            </div>
          </>
        );
      
      case 'completed':
        return (
          <>
            <div className="text-center mb-4">
              <div className="conversion-success-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle text-success">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h5 className="mt-3">Conversion Completed!</h5>
              <p className="text-muted">Your PDF file is ready to download</p>
            </div>
          </>
        );
      
      case 'failed':
        return (
          <>
            <div className="text-center mb-4">
              <div className="conversion-error-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-circle text-danger">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h5 className="mt-3">Conversion Failed</h5>
              <p className="text-danger">{error || "An unexpected error occurred"}</p>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="conversion-progress-container">
      <div className="banner-container mb-4">
        <img 
          src="https://pixabay.com/get/g86ee8eea948c4d182af453c8facf7a2f0f3064ce4aaed2e255ceb92e88ba3635119f8a9b80d69137295e51cbf191251118ff43d7c566f9a9e622eb263efebad8_1280.jpg" 
          alt="Coding workspace" 
          className="img-fluid rounded shadow-sm banner-image"
        />
      </div>
      
      {renderStatusContent()}
      
      {(status === 'pending' || status === 'processing') && (
        <div className="progress-container">
          <div className="progress">
            <div 
              className="progress-bar" 
              role="progressbar" 
              style={{ width: `${progress}%` }} 
              aria-valuenow={progress} 
              aria-valuemin="0" 
              aria-valuemax="100"
            ></div>
          </div>
          <p className="text-center text-muted small mt-2">
            This may take a moment depending on the size and complexity of your notebook
          </p>
        </div>
      )}
    </div>
  );
};

export default ConversionProgress;
