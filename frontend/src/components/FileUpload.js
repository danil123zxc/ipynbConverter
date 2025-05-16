import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadNotebook } from '../services/apiService';
import './FileUpload.css';

const FileUpload = ({ onConversionStart }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    // Reset errors
    setUploadError(null);
    
    // Check if any files were accepted
    if (acceptedFiles.length === 0) {
      return;
    }
    
    const file = acceptedFiles[0];
    
    // Validate file type
    if (!file.name.endsWith('.ipynb')) {
      setUploadError('Only Jupyter Notebook (.ipynb) files are accepted');
      return;
    }
    
    // Validate file size (20MB max)
    const maxSizeInBytes = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSizeInBytes) {
      setUploadError(`File size exceeds the limit of 20MB`);
      return;
    }
    
    // Set the selected file
    setSelectedFile(file);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/x-ipynb+json': ['.ipynb']
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file to upload');
      return;
    }
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const formData = new FormData();
      formData.append('notebook_file', selectedFile);
      formData.append('original_filename', selectedFile.name);
      
      const response = await uploadNotebook(formData);
      onConversionStart(response.data);
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response && error.response.data) {
        // Format API error message
        if (error.response.data.notebook_file) {
          setUploadError(error.response.data.notebook_file[0]);
        } else if (error.response.data.error) {
          setUploadError(error.response.data.error);
        } else {
          setUploadError('An error occurred during upload. Please try again.');
        }
      } else {
        setUploadError('Network error. Please check your connection and try again.');
      }
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setUploadError(null);
  };

  return (
    <div className="file-upload-container">
      <div className="banner-container mb-4">
        <img 
          src="https://pixabay.com/get/g25a77a37ae3e6e8cbaea7f2f0e247e510958b92dee81d1eefb0d214f6ceabea59358fa35ea83908ebcda0bd83b067b53b54ac5b9dbfca238bc6a9aa8baaae060_1280.jpg" 
          alt="Notebook concept" 
          className="img-fluid rounded shadow-sm banner-image"
        />
      </div>
      
      <h2 className="text-center mb-4">Convert Jupyter Notebook to PDF</h2>
      
      {!selectedFile ? (
        <div 
          {...getRootProps()} 
          className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="dropzone-content">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-upload text-primary mb-3">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            {isDragActive ? (
              <p className="mb-0">Drop your .ipynb file here</p>
            ) : (
              <div>
                <p className="mb-2">Drag & drop your Jupyter Notebook file here</p>
                <p className="text-muted small mb-0">or click to browse files</p>
                <p className="text-muted smaller mb-0 mt-2">(Maximum file size: 20MB)</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="selected-file-container">
          <div className="card bg-light p-3">
            <div className="d-flex align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text text-primary me-3">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <div className="flex-grow-1">
                <p className="mb-0 fw-semibold">{selectedFile.name}</p>
                <p className="text-muted small mb-0">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          </div>
          
          <div className="d-flex justify-content-center mt-4">
            <button 
              className="btn btn-outline-secondary me-2" 
              onClick={handleCancel}
              disabled={isUploading}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Uploading...
                </>
              ) : (
                'Convert to PDF'
              )}
            </button>
          </div>
        </div>
      )}
      
      {uploadError && (
        <div className="alert alert-danger mt-3">
          {uploadError}
        </div>
      )}
      
      <div className="info-container mt-5">
        <h5 className="text-center mb-3">How it works</h5>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="text-center">
              <div className="step-icon mb-2">1</div>
              <h6>Upload</h6>
              <p className="text-muted small">Upload your Jupyter Notebook file (.ipynb)</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center">
              <div className="step-icon mb-2">2</div>
              <h6>Convert</h6>
              <p className="text-muted small">Our system converts your notebook to PDF</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center">
              <div className="step-icon mb-2">3</div>
              <h6>Download</h6>
              <p className="text-muted small">Download your PDF file when ready</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
