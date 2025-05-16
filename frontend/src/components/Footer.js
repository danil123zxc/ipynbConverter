import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="bg-light py-4 mt-5 border-top">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0 text-muted">
              &copy; {new Date().getFullYear()} iPynb to PDF Converter
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="mb-0 text-muted">
              Convert Jupyter Notebooks to PDFs securely and easily
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
