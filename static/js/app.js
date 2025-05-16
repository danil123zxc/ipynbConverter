// Main React App

const { useState, useEffect, useCallback } = React;
const { createRoot } = ReactDOM;

// API Service functions
const apiService = {
  uploadNotebook: (formData) => {
    return axios.post('/api/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getConversionStatus: (id) => {
    return axios.get(`/api/conversion-status/${id}/`);
  }
};

// FileUpload Component
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
  
  // Setup react-dropzone
  const { getRootProps, getInputProps, isDragActive } = ReactDropzone.useDropzone({
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
      
      const response = await apiService.uploadNotebook(formData);
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
          src="https://cdn.pixabay.com/photo/2016/09/08/04/12/programmer-1653351_1280.png" 
          alt="Notebook concept" 
          className="img-fluid rounded shadow-sm banner-image"
          style={{ maxHeight: "200px", objectFit: "cover" }}
        />
      </div>
      
      <h2 className="text-center mb-4">Convert Jupyter Notebook to PDF</h2>
      
      {!selectedFile ? (
        <div 
          {...getRootProps()} 
          className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
          style={{
            border: "2px dashed #dee2e6",
            borderRadius: "10px",
            padding: "3rem 2rem",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            backgroundColor: "#f8f9fa"
          }}
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
              <div className="step-icon mb-2" style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#4a89dc",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                fontWeight: "bold"
              }}>1</div>
              <h6>Upload</h6>
              <p className="text-muted small">Upload your Jupyter Notebook file (.ipynb)</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center">
              <div className="step-icon mb-2" style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#4a89dc",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                fontWeight: "bold"
              }}>2</div>
              <h6>Convert</h6>
              <p className="text-muted small">Our system converts your notebook to PDF</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center">
              <div className="step-icon mb-2" style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#4a89dc",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                fontWeight: "bold"
              }}>3</div>
              <h6>Download</h6>
              <p className="text-muted small">Download your PDF file when ready</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ConversionProgress Component
const ConversionProgress = ({ status, progress, error, conversionId, onStatusUpdate }) => {
  const [pollingInterval, setPollingInterval] = useState(null);
  
  // Function to fetch the current status
  const checkStatus = useCallback(async () => {
    try {
      const response = await apiService.getConversionStatus(conversionId);
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
          src="https://cdn.pixabay.com/photo/2020/04/25/12/14/coding-5090820_1280.jpg" 
          alt="Coding workspace" 
          className="img-fluid rounded shadow-sm banner-image"
          style={{ maxHeight: "200px", objectFit: "cover" }}
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

// DownloadButton Component
const DownloadButton = ({ pdfUrl }) => {
  if (!pdfUrl) {
    return null;
  }

  return (
    <div className="download-button-container text-center">
      <a 
        href={pdfUrl} 
        className="btn btn-success btn-lg"
        download
        style={{
          transition: "all 0.3s ease",
          padding: "0.75rem 2rem",
          borderRadius: "50px",
          fontWeight: "600"
        }}
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

// Header Component
const Header = () => {
  return (
    <header className="bg-white shadow-sm" style={{ borderBottom: "1px solid #e9ecef" }}>
      <div className="container py-3">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h1 className="mb-0 fw-bold" style={{ color: "#4a89dc" }}>iPynb to PDF Converter</h1>
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

// Footer Component
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

// Main App Component
function App() {
  const [conversionState, setConversionState] = useState({
    isConverting: false,
    conversionId: null,
    status: null, // 'pending', 'processing', 'completed', 'failed'
    progress: 0,
    pdfUrl: null,
    error: null
  });

  // Handle successful upload and start of conversion
  const handleConversionStart = (conversionDetails) => {
    setConversionState({
      isConverting: true,
      conversionId: conversionDetails.id,
      status: conversionDetails.status,
      progress: 10, // Initial progress indicator
      pdfUrl: null,
      error: null
    });
  };

  // Handle conversion status update
  const handleStatusUpdate = (statusDetails) => {
    setConversionState(prevState => ({
      ...prevState,
      status: statusDetails.status,
      progress: getProgressFromStatus(statusDetails.status),
      pdfUrl: statusDetails.pdf_url,
      error: statusDetails.error_message,
      isConverting: statusDetails.status !== 'completed' && statusDetails.status !== 'failed'
    }));
  };

  // Calculate progress percentage based on status
  const getProgressFromStatus = (status) => {
    switch (status) {
      case 'pending': return 10;
      case 'processing': return 50;
      case 'completed': return 100;
      case 'failed': return 0;
      default: return 0;
    }
  };

  // Handle reset of the conversion state
  const handleReset = () => {
    setConversionState({
      isConverting: false,
      conversionId: null,
      status: null,
      progress: 0,
      pdfUrl: null,
      error: null
    });
  };

  return (
    <div className="app-container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      
      <main className="container py-4" style={{ flex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                {!conversionState.isConverting && conversionState.status !== 'completed' && conversionState.status !== 'failed' ? (
                  <FileUpload onConversionStart={handleConversionStart} />
                ) : (
                  <ConversionProgress 
                    status={conversionState.status} 
                    progress={conversionState.progress} 
                    error={conversionState.error}
                    conversionId={conversionState.conversionId}
                    onStatusUpdate={handleStatusUpdate}
                  />
                )}
                
                {conversionState.status === 'completed' && (
                  <div className="text-center mt-4">
                    <DownloadButton pdfUrl={conversionState.pdfUrl} />
                    <button 
                      className="btn btn-outline-secondary mt-3"
                      onClick={handleReset}
                    >
                      Convert Another Notebook
                    </button>
                  </div>
                )}

                {conversionState.status === 'failed' && (
                  <div className="text-center mt-4">
                    <div className="alert alert-danger">
                      <strong>Conversion failed:</strong> {conversionState.error || "Unknown error occurred"}
                    </div>
                    <button 
                      className="btn btn-primary mt-3"
                      onClick={handleReset}
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// Render the App
const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);