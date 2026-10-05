import express from 'express';
import { analyzeEWasteImage, getChatAssistantResponse } from '../services/gemini.js';

const router = express.Router();

// Analyze e-waste image
router.post('/identify', async (req, res) => {
  try {
    const { imageBase64, prompt } = req.body;
    const result = await analyzeEWasteImage(imageBase64, prompt);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Chat assistant route
router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    const reply = await getChatAssistantResponse(message, history);
    res.json({ success: true, reply });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
