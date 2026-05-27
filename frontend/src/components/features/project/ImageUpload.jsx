import React, { useState, useRef } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
      onFileSelect?.(file);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileSelect = (e) => {
    e.stopPropagation(); 
    inputRef.current.click();
  };
  return (
    <div 
      className={`upload-wrapper ${dragActive ? 'drag-active' : ''} ${preview ? 'has-preview' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={triggerFileSelect} /* Клік по блоку відкрива файли*/
    >
      <input 
        type="file" 
        ref={inputRef}
        className="hidden-input" 
        onChange={handleChange}
        accept="image/*"
      />
      
      <div className="upload-content">
        {/* Зображення встає замість тексту */}
        {preview && (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="preview-image" />
          </div>
        )}

        {!preview && (
          <div className="empty-state-elements">
            <p className="upload-title">
              ЗАВАНТАЖИТИ ЗОБРАЖЕННЯ<br/>
              <span>Обов'язково для АІ генерації</span>
            </p>
            
            <div className="upload-icon-box">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
          </div>
        )}

        <button type="button" className="upload-button" onClick={triggerFileSelect}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Завантажити
        </button>
      </div>
    </div>
  );
};

export default ImageUpload;