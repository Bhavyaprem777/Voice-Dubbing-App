import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './UploadSection.module.css';

const acceptedFormats = ['.mp3', '.wav', '.m4a', '.aac'];
const maxFileSize = 50 * 1024 * 1024; // 50MB

function UploadSection({ onStartUpload, onFileUpload }) {
  const [fileInfo, setFileInfo] = useState(null);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    setError('');
    if (fileRejections.length > 0) {
      setError(fileRejections[0].errors[0]?.message || 'Invalid file');
      return;
    }

    const file = acceptedFiles[0];
    setFileInfo({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
    });

    if (onStartUpload) {
      onStartUpload();
    }

    if (onFileUpload) {
      onFileUpload(file);
    }
  }, [onStartUpload, onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: maxFileSize,
    accept: acceptedFormats.reduce((acc, ext) => ({ ...acc, [ext]: [] }), {}),
  });

  return (
    <div className={styles.uploadContainer}>
      <div
        {...getRootProps()}
        className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop file here...</p>
        ) : (
          <>
            <p>Drag and drop</p>
            <p className={styles.subText}>Upload your audio and let our AI transcribe it for you</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                document.querySelector('input[type="file"]').click();
              }}
              className={styles.selectButton}
            >
              Select File
            </button>
          </>
        )}
      </div>

      {fileInfo && (
        <div className={styles.fileInfo}>
          <p><strong>File:</strong> {fileInfo.name}</p>
          <p><strong>Size:</strong> {fileInfo.size}</p>
        </div>
      )}

      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}

export default UploadSection;
