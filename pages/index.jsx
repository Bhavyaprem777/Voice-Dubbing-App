import React, { useState, useEffect, useRef } from 'react';
import UploadSection from '../src/components/UploadSection';
import UploadAnimation from '../src/components/UploadAnimation';
import VoiceConverter from '../src/components/VoiceConverter';
import ConversionAnimation from '../src/components/ConversionAnimation';
import HindiAudioPlayer from '../src/components/HindiAudioPlayer';

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showRightAnimation, setShowRightAnimation] = useState(false);
  const [hindiAudioUrl, setHindiAudioUrl] = useState('');
  const [waveformVisible, setWaveformVisible] = useState(false);
  const [waveformMoved, setWaveformMoved] = useState(false);
  const animationTimeoutRef = useRef(null);

  const handleStartUpload = () => {
    setIsUploading(true);
    setTimeout(() => setIsUploading(false), 3000);
  };

  const handleFileUpload = (file) => {
    setUploadedFile(file);
    setWaveformVisible(false);
    setWaveformMoved(false);
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
  };

  const handleAudioEnd = () => {
    setWaveformVisible(true);
    setShowRightAnimation(false);

    animationTimeoutRef.current = setTimeout(() => {
      setWaveformMoved(true);
      setShowRightAnimation(true);

      setTimeout(() => {
        setShowRightAnimation(false);
      }, 5000);
    }, 1000);
  };

  const sectionStyle = {
    flex: 1,
    padding: '1.5rem',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #2b2b2b, #1e1e1e)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.3s',
  };

  const headingStyle = {
    marginBottom: '1rem',
    fontWeight: '700',
    borderBottom: '2px solid #00bfff',
    paddingBottom: '0.5rem',
    color: '#00bfff',
    fontSize: '1.5rem',
  };

  const waveformBaseStyle = {
    position: 'absolute',
    bottom: '20px',
    width: '90%',
    height: '80px',
    borderRadius: '12px',
    boxShadow: '0 0 15px 4px orange',
    background: 'linear-gradient(90deg, #FF4500, #FF6347)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '1.1rem',
    userSelect: 'none',
    transition: 'transform 3s ease-in-out',
    zIndex: 10,
  };

  const waveformStartLeft = '5%';
  const moveDistance = '110%';

  return (
    <div style={{ background: '#121212', minHeight: '100vh', padding: '2rem' }}>
      <header
        style={{
          textAlign: 'center',
          padding: '2rem 0 1rem',
          fontSize: '2.8rem',
          fontWeight: '900',
          letterSpacing: '2px',
          color: '#e0e0e0',
          textShadow: '0 0 8px #00bfff',
        }}
      >
        Voice Dubbing App
      </header>

      <div
        style={{
          display: 'flex',
          gap: '2rem',
          padding: '1rem 2rem 0',
          alignItems: 'stretch',
          minHeight: '450px',
          position: 'relative',
          marginTop: '2rem',
        }}
      >
        {/* Left: Upload File Section */}
        <div style={sectionStyle}>
          <h2 style={headingStyle}>Upload File</h2>
          <UploadSection onStartUpload={handleStartUpload} onFileUpload={handleFileUpload} />
        </div>

        {/* Center: Converter Section */}
        <div style={{ ...sectionStyle, position: 'relative' }}>
          <h2 style={headingStyle}>Converter Section</h2>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <UploadAnimation isUploading={isUploading} />
            <VoiceConverter
              audioFile={uploadedFile}
              onAudioEnd={handleAudioEnd}
              onAudioReady={(url) => setHindiAudioUrl(url)}
            />
          </div>

          {/* Waveform animation in center section before moving */}
          {waveformVisible && (
            <div
              style={{
                ...waveformBaseStyle,
                left: waveformStartLeft,
                transform: waveformMoved ? `translateX(${moveDistance})` : 'translateX(0)',
              }}
            >
              <ConversionAnimation />
            </div>
          )}
        </div>

        {/* Right: Playback Section */}
        <div style={sectionStyle}>
          <h2 style={headingStyle}>Playback Section</h2>
          <p style={{ fontStyle: 'italic', color: '#bbb' }}>
            Find Your Audio for Playback Here.
          </p>

          {/* Show Conversion Animation for 5 seconds */}
          {waveformMoved && showRightAnimation && (
            <div style={{ marginTop: '2rem' }}>
              <ConversionAnimation />
              <div
                style={{
                  marginTop: '0.5rem',
                  color: '#ff6f00',
                  fontWeight: '700',
                  fontSize: '1.2rem',
                  textAlign: 'center',
                  textShadow: '0 0 8px #ff6f00',
                }}
              >
                Converted to Hindi
              </div>
            </div>
          )}

          {/* Show Hindi Audio Player AFTER animation ends */}
          {waveformMoved && !showRightAnimation && hindiAudioUrl && (
            <div style={{ marginTop: '2rem' }}>
              <HindiAudioPlayer hindiAudioUrl={hindiAudioUrl}
              onReset={() => {
    setUploadedFile(null);
    setWaveformVisible(false);
    setWaveformMoved(false);
    setShowRightAnimation(false);
    setHindiAudioUrl('');
  }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
