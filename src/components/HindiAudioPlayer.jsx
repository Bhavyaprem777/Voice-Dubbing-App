import React, { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause, FaDownload, FaRedo } from 'react-icons/fa';

export default function HindiAudioPlayer({ hindiAudioUrl, onReset }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState('');

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, '0');
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDownload = () => {
  setDownloadStatus('Downloading...');
  const link = document.createElement('a');
  link.href = hindiAudioUrl;
  const original = hindiAudioUrl.split('/').pop().split('.')[0];
  link.download = `${original}_hindi.mp3`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Show "Downloaded Successfully" after 1 second
  setTimeout(() => {
    setDownloadStatus('Downloaded Successfully ✅');
  }, 1000);

  // Clear message after 3 more seconds
  setTimeout(() => {
    setDownloadStatus('');
  }, 4000);
};


  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const handleTimeChange = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setTotalTime = () => setDuration(audio.duration);
    const resetPlay = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', setTotalTime);
    audio.addEventListener('ended', resetPlay);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', setTotalTime);
      audio.removeEventListener('ended', resetPlay);
    };
  }, []);

  return (
    <div style={styles.container}>
      <audio ref={audioRef} src={hindiAudioUrl} preload="metadata" />

      {/* Time + Seek Bar */}
      <div style={styles.timeRow}>
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleTimeChange}
          style={styles.seekBar}
        />
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls Row */}
      <div style={styles.controls}>
        <button onClick={handlePlayPause} style={styles.button}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          style={styles.volumeSlider}
          title="Volume"
        />

        <button onClick={handleDownload} style={styles.button}>
          <FaDownload />
        </button>

        {onReset && (
          <button onClick={onReset} style={{ ...styles.button, backgroundColor: '#777' }}>
            <FaRedo />&nbsp;<span style={{ fontSize: '0.9rem' }}>Reset</span>
          </button>
        )}
      </div>

      {/* Download Status */}
      {downloadStatus && (
        <div style={styles.status}>
          {downloadStatus}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: '#2a2a2a',
    borderRadius: '12px',
    textAlign: 'center',
    color: '#fff',
    boxShadow: '0 0 12px rgba(255, 111, 0, 0.3)',
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    marginTop: '1rem',
  },
  button: {
    backgroundColor: '#ff6f00',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
  },
  volumeSlider: {
    width: '100px',
    cursor: 'pointer',
    background: '#d0f0fd',
  },
  seekBar: {
    width: '60%',
    margin: '0 0.5rem',
    cursor: 'pointer',
  },
  timeRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
  },
  status: {
    marginTop: '0.8rem',
    fontSize: '0.95rem',
    color: '#90ee90',
    fontWeight: '600',
    textShadow: '0 0 4px #00ff88',
  },
};
