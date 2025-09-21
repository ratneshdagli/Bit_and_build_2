import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const groqRes = await fetch('https://api.groq.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}` // Set your API key in .env.local
      },
      body: JSON.stringify({
        model: 'llama-3-1-8b-instant',
        messages: [
          { role: 'system', content: 'You are an expert prompt enhancer for color palette generation. Improve clarity, specificity, and creativity. Add mood, style, and design intent. Output a single enhanced prompt string.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 120,
        temperature: 0.7
      })
    });

    // Handle HTTP errors
    if (groqRes.status === 401 || groqRes.status === 403) {
      return res.status(groqRes.status).json({ error: 'Invalid Groq API key or unauthorized.' });
    }
    if (groqRes.status === 404) {
      return res.status(404).json({ error: 'Groq API endpoint not found.' });
    }
    if (!groqRes.ok) {
      return res.status(groqRes.status).json({ error: `Groq API error: ${groqRes.statusText}` });
    }

    // Validate content type
    const contentType = groqRes.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(502).json({ error: 'Groq API did not return JSON. Please check your API key and endpoint.' });
    }

    let data;
    try {
      data = await groqRes.json();
    } catch (jsonErr) {
      return res.status(502).json({ error: 'Groq API returned invalid JSON.' });
    }

    const enhancedPrompt = data.choices?.[0]?.message?.content?.trim();
    if (!enhancedPrompt) {
      return res.status(500).json({ error: 'No enhanced prompt returned.' });
    }
    return res.status(200).json({ enhancedPrompt });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Groq API error.' });
  }
}
