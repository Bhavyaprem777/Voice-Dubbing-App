# 🗣️ Voice Dubbing App – Hindi AI Synthesis with Next.js + Google APIs

This project is a voice dubbing interface built using **React (Next.js)** and integrated with **Google Cloud APIs** to enable automatic dubbing of audio files into **Hindi**. It features file upload with animated transitions, AI-based voice processing, and playback + download options.

---

## 🚀 Features

### 🔹 1. File Upload System
- Drag & Drop + file picker
- Supports `.mp3`, `.wav`, `.m4a`, `.aac`
- Shows filename, size
- Validates format and size
- Visual hover and invalid feedback

### 🔹 2. Upload Animation
- Smooth transition from left to center
- Blue/teal animated waveform using CSS keyframes
- Upload progress bar with % indicator
- Text: `"Uploading your file..."`

### 🔹 3. AI Voice Conversion
- Converts speech to Hindi voice using:
  - **Google Cloud Speech-to-Text**
  - **Google Cloud Translate**
  - **Google Cloud Text-to-Speech**
- Triggered via microphone icon
- Conversion status + animated feedback
- Handles API errors and rate limits gracefully

### 🔹 4. Conversion Animation
- Orange/red waveform with glowing particle effect
- Text: `"Converting to Hindi..."`
- Smooth transition from center to right

### 🔹 5. Audio Playback
- Play/Pause with animated toggle
- Volume slider (0–100%)
- Progress bar with seek
- Current/Total time in `MM:SS` format

### 🔹 6. Download Function
- Download dubbed audio: `original_filename_hindi.mp3`
- Shows progress + success confirmation
- Option to process a new file

---

## 🧰 Tech Stack

- **Frontend**: Next.js (React), CSS Modules / SCSS
- **Animations**: CSS keyframes, React state, optional `framer-motion`
- **APIs Used**:
  - 🗣️ Google Cloud Speech-to-Text
  - 🌐 Google Cloud Translate API
  - 🔊 Google Cloud Text-to-Speech
- **Deployment**: (Optional) Vercel or any static host

---


---

## 🔑 Google API Configuration Guide

1. **Create Google Cloud Project**  
   Go to [Google Cloud Console](https://console.cloud.google.com/)

2. **Enable APIs**:  
   - Speech-to-Text  
   - Translate API  
   - Text-to-Speech  

3. **Generate API Key or Service Account JSON**  
   For frontend, use API key (restricted by referrer).  
   For backend/serverless, use service account JSON.

4. **Add to `.env.local` file**:

```env
NEXT_PUBLIC_GOOGLE_API_KEY=your_api_key_here
GOOGLE_APPLICATION_CREDENTIALS=your_service_account.json (for backend if needed)

🧪 Usage Instructions
npm install

npm run dev to start locally

Upload audio file (left panel)

Wait for animated upload & transcription

Click 🎤 to convert to Hindi

Preview dubbed audio (right panel)

Click ⬇️ to download

🧪 Usage Instructions
npm install

npm run dev to start locally

Upload audio file (left panel)

Wait for animated upload & transcription

Click 🎤 to convert to Hindi

Preview dubbed audio (right panel)

Click ⬇️ to download
## 🔎 Notes

- 🖥️ This app is optimized for **desktop use only**.
- 📱 Mobile or tablet view is not fully supported at this time.


