import React from 'react';
import './DownloadButton.css';

const DownloadButton = ({ pdfUrl }) => {
  if (!pdfUrl) {
    return null;
  }

  return (
    <div className="download-button-container text-center">
      <a 
        href={pdfUrl} 
        className="btn btn-success btn-lg download-btn"
        download
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-download me-2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Download PDF
      </a>
      <p className="text-muted small mt-2">
        Your file is ready to download
      </p>
    </div>
  );
};

export default DownloadButton;
