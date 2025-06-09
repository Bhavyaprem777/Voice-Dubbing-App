import React, { useEffect, useState, useRef } from 'react';
import { FaMicrophone, FaSpinner } from 'react-icons/fa';
import styles from './VoiceConverter.module.css';

const VoiceConverter = ({ audioFile, onAudioEnd, onAudioReady  }) => {
  const [status, setStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioFile) {
      handleConversion(audioFile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioFile]);

  const handleConversion = async (file) => {
    setIsProcessing(true);
    setError('');
    setStatus('Uploading & processing audio...');

    try {
      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Conversion failed');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
    if (onAudioReady) {
      onAudioReady(audioUrl); // pass url up to parent
    }

      setStatus('✅ Hindi Audio Ready. Playing...');
      
      // Create new Audio element and save ref
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      // Listen for when audio ends
      audio.addEventListener('ended', () => {
        if (onAudioEnd) onAudioEnd();
      });

      audio.play();
    } catch (err) {
      console.error(err);
      setError('❌ Error: Conversion failed. Try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      <button
        className={`${styles.micButton} ${isProcessing ? styles.recording : ''}`}
        disabled
      >
        {isProcessing ? <FaSpinner className={styles.spinner} /> : <FaMicrophone />}
      </button>

      {status && <p className={styles.status}>{status}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default VoiceConverter;
