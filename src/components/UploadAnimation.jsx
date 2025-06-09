import React, { useState, useEffect } from 'react';
import styles from './UploadAnimation.module.css';

const UploadAnimation = ({ isUploading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;

    if (isUploading) {
      let start = 0;
      interval = setInterval(() => {
        start += 1;
        setProgress(start);
        if (start >= 100) {
          clearInterval(interval);
        }
      }, 30); // Total ~3s
    } else {
      setProgress(0);
    }

    return () => clearInterval(interval);
  }, [isUploading]);

  return (
    <div className={styles.uploadWrapper}>
      <div className={`${styles.waveformContainer} ${isUploading ? styles.animate : ''}`}>
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className={styles.waveSvg}>
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00c6ff" />
              <stop offset="100%" stopColor="#0072ff" />
            </linearGradient>
          </defs>
          <path
            fill="url(#wave-gradient)"
            d="M0 20 Q 25 0 50 20 T 100 20 V40 H0 Z"
          />
        </svg>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>

      {isUploading && (
        <p className={styles.uploadingText}>Uploading your file... {progress}%</p>
      )}
    </div>
  );
};

export default UploadAnimation;
