import React from 'react';
import styles from './ConversionAnimation.module.css';

export default function ConversionAnimation() {
  return (
    <div className={styles.conversionWrapper}>
      <div className={styles.waveform}></div>
      <div className={styles.particles}></div>
    </div>
  );
}
