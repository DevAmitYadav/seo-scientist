import fetch from 'node-fetch';

export async function getPageSpeedReport(req, res) {
  try {
    const { url, key } = req.query;

    if (!url) return res.status(400).json({ error: 'Missing URL parameter' });

    const apiKey = key || process.env.GOOGLE_API_KEY;
    if (!apiKey) return res.status(400).json({ error: 'Missing API key' });

const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=performance&category=seo&key=${apiKey}`;


    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.error?.message || 'Google API error' });
    }

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error('Error fetching PageSpeed report:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
