import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container py-3">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h1 className="mb-0 fw-bold text-primary">iPynb to PDF Converter</h1>
            <p className="lead text-muted mb-0 mt-2">
              Convert your Jupyter Notebooks to PDF documents with ease
            </p>
          </div>
          <div className="col-md-4 text-end d-none d-md-block">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4a89dc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
