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

  // Handle Google credentials dynamically:
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
    // In deployed environment, decode base64 and write the JSON file
    const base64Key = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
    const keyFilePath = path.join(process.cwd(), 'voice-dubbing-app.json');
    try {
      const keyFileJson = Buffer.from(base64Key, 'base64').toString('utf8');
      fs.writeFileSync(keyFilePath, keyFileJson, { encoding: 'utf8' });
      process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFilePath;
    } catch (err) {
      console.error('Error writing Google credentials file:', err);
      return res.status(500).json({ error: 'Failed to setup Google credentials' });
    }
  } else {
    // On local system, assume voice-dubbing-app.json is already present
    const localKeyPath = path.join(process.cwd(), 'voice-dubbing-app.json');
    if (fs.existsSync(localKeyPath)) {
      process.env.GOOGLE_APPLICATION_CREDENTIALS = localKeyPath;
    } else {
      return res.status(500).json({ error: 'Google credentials not found locally' });
    }
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

    const translate = new TranslateV2.Translate();
    const [translatedText] = await translate.translate(transcription, 'hi');

    const ttsClient = new textToSpeech.TextToSpeechClient();
    const [ttsResponse] = await ttsClient.synthesizeSpeech({
      input: { text: translatedText },
      voice: { languageCode: 'hi-IN', ssmlGender: 'FEMALE' },
      audioConfig: { audioEncoding: 'MP3' },
    });

    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(ttsResponse.audioContent);
  } catch (err) {
    console.error('Conversion error:', err.message || err);
    res.status(500).json({ error: '❌ Audio conversion failed. Try again.' });
  }
}
