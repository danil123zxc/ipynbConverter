import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import FileUpload from './components/FileUpload';
import ConversionProgress from './components/ConversionProgress';
import DownloadButton from './components/DownloadButton';
import './App.css';

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
    <div className="app-container">
      <Header />
      
      <main className="container py-4">
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

export default App;
