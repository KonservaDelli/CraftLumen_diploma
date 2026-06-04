import React, { useRef } from 'react';
import './UploadButton.css';

const UploadButton = ({ 
  label = "Upload File", 
  onFileSelect, 
  accept = "image/*",
  className = ""
}) => {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
    e.target.value = null;
  };

  return (
    <div className={`upload-button-wrapper ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        style={{ display: 'none' }}
      />
      
      <button 
        type="button" 
        className="upload-custom-btn" 
        onClick={handleButtonClick}
      >
        <svg 
          className="upload-btn-svg"
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span className="upload-btn-text">{label}</span>
      </button>
    </div>
  );
};

export default UploadButton;