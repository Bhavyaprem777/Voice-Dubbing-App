import React, { useState } from 'react';
import UploadSection from './components/UploadSection';
import UploadAnimation from './components/UploadAnimation';

function App() {
  const [isUploading, setIsUploading] = useState(false);

  const handleStartUpload = () => {
    setIsUploading(true);

    // simulate upload completion after 3s
    setTimeout(() => {
      setIsUploading(false);
    }, 3000);
  };

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh', color: 'white' }}>
      <header style={{ textAlign: 'center', padding: '2rem 0', fontSize: '2rem', fontWeight: '900' }}>
        Voice Dubbing App
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2rem', alignItems: 'center' }}>
        {/* Left: Upload Section */}
        <div style={{ flex: 1, paddingRight: '1rem' }}>
          <UploadSection onStartUpload={handleStartUpload} />
        </div>

        {/* Center: Upload Animation */}
        <div style={{ flex: 1, textAlign: 'center', color: '#888' }}>
          <UploadAnimation isUploading={isUploading} />
        </div>

        {/* Right placeholder */}
        <div style={{ flex: 1, paddingLeft: '1rem', textAlign: 'center', color: '#888' }}>
          <p>Playback Section</p>
        </div>
      </div>
    </div>
  );
}

export default App;
