import multer from 'multer';
import fs from 'fs';
import path from 'path';
import speech from '@google-cloud/speech';
import textToSpeech from '@google-cloud/text-to-speech';
import { v2 as TranslateV2 } from '@google-cloud/translate';

const upload = multer({ storage: multer.memoryStorage() });

const runMiddleware = (req, res, fn) =>
  new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });

export const config = {
  api: {
    bodyParser: false, // Required for multer
  },
};

const getEncodingFromExtension = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'mp3':
      return 'MP3';
    case 'wav':
      return 'LINEAR16';
    case 'm4a':
    case 'aac':
      return 'AAC_LC';
    default:
      return 'LINEAR16';
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  // Decode base64 service account key from env var and write to file
  const base64Key = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
  if (!base64Key) {
    return res.status(500).json({ error: 'Google credentials missing' });
  }

  // Define a path for temp JSON file
  const keyFilePath = path.join(process.cwd(), 'voice-dubbing-app.json');

  try {
    // Write decoded JSON to file (overwrite if exists)
    const keyFileJson = Buffer.from(base64Key, 'base64').toString('utf8');
    fs.writeFileSync(keyFilePath, keyFileJson, { encoding: 'utf8' });

    // Set environment variable so Google SDK can pick it up
    process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFilePath;
  } catch (err) {
    console.error('Error writing Google credentials file:', err);
    return res.status(500).json({ error: 'Failed to setup Google credentials' });
  }

  try {
    await runMiddleware(req, res, upload.single('audio'));
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'File upload failed.' });
  }

  const audioBuffer = req.file.buffer;
  const filename = req.file.originalname;
  const encoding = getEncodingFromExtension(filename);

  try {
    // 1. Transcribe English audio
    const speechClient = new speech.SpeechClient();
    const [speechResponse] = await speechClient.recognize({
      audio: { content: audioBuffer.toString('base64') },
      config: {
        encoding,
        sampleRateHertz: 44100,
        languageCode: 'en-US',
      },
    });

    const transcription = speechResponse.results
      .map((r) => r.alternatives[0].transcript)
      .join(' ');

    if (!transcription) throw new Error('❌ Transcription failed');

    // 2. Translate English text to Hindi
    const translate = new TranslateV2.Translate();
    const [translatedText] = await translate.translate(transcription, 'hi');

    // 3. Convert translated Hindi text to speech
    const ttsClient = new textToSpeech.TextToSpeechClient();
    const [ttsResponse] = await ttsClient.synthesizeSpeech({
      input: { text: translatedText },
      voice: { languageCode: 'hi-IN', ssmlGender: 'FEMALE' },
      audioConfig: { audioEncoding: 'MP3' },
    });

    // Send back the audio file
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(ttsResponse.audioContent);
  } catch (err) {
    console.error('Conversion error:', err);
    res.status(500).json({ error: '❌ Audio conversion failed. Try again.' });
  } finally {
    // Optional: delete the temp key file for security, or keep it for next calls
    // fs.unlinkSync(keyFilePath);
  }
}
