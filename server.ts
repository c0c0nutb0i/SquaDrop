import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Gemini SDK with telemetry header as required by skill guidelines
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Backend simulation & Gemini AI endpoint for Smart Hangout & Venue Matchmaker
app.post('/api/ai-matchmaker', async (req, res) => {
  try {
    const { venues, members, userPreferences, activeVenueId } = req.body;

    // Simulation calculation logic: Overlap, budget constraints, travel distances, preferences
    const scoredVenues = (venues || []).map((v: any) => {
      const votes = v.swipedRightBy?.length || 0;
      const budgetFitScore = v.priceForTwo <= 4000 ? 98 : v.priceForTwo <= 5000 ? 92 : 85;
      const travelDistanceNum = parseFloat(v.distance) || 2.0;
      const travelScore = Math.max(70, Math.round(100 - travelDistanceNum * 8));
      const groupOverlapScore = Math.round((votes / 5) * 50 + (budgetFitScore / 100) * 25 + (travelScore / 100) * 25);
      
      return {
        id: v.id,
        name: v.name,
        votes,
        groupOverlapScore,
        travelMinutes: Math.round(travelDistanceNum * 6),
        budgetPerPerson: Math.round(v.priceForTwo / 2),
        meetsThreshold: votes >= 3,
      };
    });

    // Determine top match
    scoredVenues.sort((a: any, b: any) => b.groupOverlapScore - a.groupOverlapScore);
    const topMatch = scoredVenues[0] || null;

    let aiExplanation = '';

    // If Gemini API Key is available, generate real AI reasoning from Gemini 3.8 Flash
    if (ai && topMatch) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are the AI Matchmaker for Squadrop, a group hangout app in Bangalore. 
Briefly in 2 short bullet points, explain why "${topMatch.name}" is the optimal venue choice for 5 friends tonight considering travel time (${topMatch.travelMinutes} mins), budget (₹${topMatch.budgetPerPerson}/person), and group consensus. Keep it punchy and witty.`,
        });
        aiExplanation = response.text || '';
      } catch (geminiErr) {
        console.warn('Gemini generateContent skipped/failed, using simulation response:', geminiErr);
      }
    }

    return res.json({
      success: true,
      topMatch,
      scoredVenues,
      aiExplanation: aiExplanation || `Optimal group choice based on 5/5 budget feasibility, ${topMatch?.travelMinutes || 15}m transit average, and strong group consensus.`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in /api/ai-matchmaker:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', matchmaker: 'active' });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Squadrop Server with Smart Matchmaker running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
