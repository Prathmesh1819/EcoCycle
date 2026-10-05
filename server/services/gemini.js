import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
let aiClient = null;

if (apiKey && apiKey !== 'your-gemini-api-key') {
  try {
    aiClient = new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.warn('Gemini AI client initialization warning:', err.message);
  }
}

/**
 * E-Waste Image Analysis using Gemini AI
 */
export async function analyzeEWasteImage(imageBase64, promptText) {
  if (aiClient) {
    try {
      const model = aiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = promptText || `Analyze this electronic waste item. Provide a detailed JSON response with the following keys:
      {
        "deviceName": "Name of device",
        "category": "Category like Smartphone, Laptop, Battery, Display, Small Appliance",
        "estimatedAge": "Estimated age e.g. 3-5 years",
        "estimatedValue": "Estimated resale or scrap value range e.g. $15 - $30",
        "hazardLevel": "Low, Medium, High, or Critical",
        "hazardDetails": "Brief safety hazard description e.g. contains lithium battery or lead solder",
        "recommendedAction": "Repair, Donate, Recycle, or Sell",
        "explanation": "Detailed explanation of why this action is recommended and how to dispose of it safely",
        "recyclableMaterials": ["Gold", "Copper", "Aluminum", "Plastic"]
      }`;

      const imagePart = {
        inlineData: {
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
          mimeType: 'image/jpeg'
        }
      };

      const response = await model.generateContent([prompt, imagePart]);
      const text = response.response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { rawText: text };
    } catch (error) {
      console.error('Error analyzing image with Gemini API:', error.message);
    }
  }

  return getFallbackEWasteAnalysis();
}

/**
 * EcoBot AI Chat Assistant response handler
 */
export async function getChatAssistantResponse(userMessage, chatHistory = []) {
  if (aiClient) {
    try {
      const model = aiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const systemPrompt = `You are EcoBot, an expert AI sustainability and e-waste recycling assistant for EcoCycle AI. 
      Help users understand how to prepare devices for recycling (e.g. data wiping, battery removal), answer questions about e-waste hazards, point system, environmental benefits, and local disposal laws. Be encouraging, friendly, and informative. Keep responses structured and concise.\n\nUser Question: ${userMessage}`;
      
      const response = await model.generateContent(systemPrompt);
      return response.response.text();
    } catch (error) {
      console.error('Error in EcoBot chat:', error.message);
    }
  }

  return getFallbackChatResponse(userMessage);
}

function getFallbackEWasteAnalysis() {
  const samples = [
    {
      deviceName: "Old Lithium Smartphone (iPhone / Galaxy)",
      category: "Mobile Device",
      estimatedAge: "4 - 6 Years",
      estimatedValue: "$25 - $45 (Trade-in / Scrap)",
      hazardLevel: "High",
      hazardDetails: "Contains a Lithium-ion battery which poses fire/explosion risk if punctured, along with lead and cobalt in circuitry.",
      recommendedAction: "Recycle",
      explanation: "This device is past its functional support window. Recycling will recover precious rare-earth metals (gold, silver, copper) while safely deactivating the battery.",
      recyclableMaterials: ["Gold (0.03g)", "Silver (0.35g)", "Copper (15g)", "Aluminum", "Lithium"]
    },
    {
      deviceName: "Legacy Laptop Computer",
      category: "Computing & IT",
      estimatedAge: "5 - 7 Years",
      estimatedValue: "$40 - $80",
      hazardLevel: "Medium",
      hazardDetails: "Contains mercury in older CCFL backlit screen, cadmium in circuit board components, and heavy metals.",
      recommendedAction: "Donate",
      explanation: "If memory and storage are securely wiped, this laptop can still be refurbished for educational non-profits or local schools before final recycling.",
      recyclableMaterials: ["Aluminum Casing", "Copper Heat Pipes", "PCB Precious Metals", "Plastic"]
    },
    {
      deviceName: "Rechargeable Power Bank / Battery Pack",
      category: "Batteries",
      estimatedAge: "2 - 3 Years",
      estimatedValue: "$5 Scrap / Points",
      hazardLevel: "Critical",
      hazardDetails: "High chemical toxicity hazard. Must never be placed in standard waste bins due to fire risks in garbage compaction trucks.",
      recommendedAction: "Recycle",
      explanation: "Batteries must be dropped off at certified hazardous e-waste kiosks where nickel, lithium, and cobalt can be extracted into raw battery supply chains.",
      recyclableMaterials: ["Lithium", "Cobalt", "Nickel", "Steel Shielding"]
    }
  ];

  return samples[Math.floor(Math.random() * samples.length)];
}

function getFallbackChatResponse(message) {
  const msg = message.toLowerCase();
  if (msg.includes('data') || msg.includes('wipe') || msg.includes('personal')) {
    return "🔒 **How to wipe your device before recycling:**\n\n1. **Backup Data**: Save your photos & files to cloud storage or an external drive.\n2. **Sign Out**: Log out of Apple ID, Google Account, and disable Find My Device.\n3. **Factory Reset**: Go to Settings → General/System → Reset → Erase All Content.\n4. **Remove SIM/SD Card**: Don't forget your memory cards!\n\nOnce wiped, your device is 100% safe to hand over to our EcoCycle collection agent!";
  }
  if (msg.includes('point') || msg.includes('reward')) {
    return "🎁 **Eco-Points Guide:**\n\n- Smartphone: **40 Points**\n- Laptop / PC: **100 Points**\n- Battery Pack: **20 Points**\n- Monitor / TV: **60 Points**\n- Large Appliance: **150 Points**\n\nYou can redeem points for gift cards, eco-friendly products, tree planting, or discount vouchers in the **Rewards Marketplace**!";
  }
  if (msg.includes('pickup') || msg.includes('schedule') || msg.includes('how')) {
    return "🚚 **Scheduling a Pickup is easy!**\n\n1. Click **Request Pickup** in your dashboard.\n2. Enter device details, photo, preferred date & time.\n3. Get a unique Pickup ID & QR code.\n4. Our collection agent will pick it up at your doorstep!";
  }
  return "🌱 Welcome to **EcoCycle AI**! I can help you identify e-waste hazards, calculate reward points, wipe personal data before recycling, or find local collection drop-off points. How can I assist your recycling journey today?";
}
