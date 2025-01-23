
export async function POST(request) {
  const { bandwidth, latency, downtime } = await request.json();

  console.log('Received request with data:', { bandwidth, latency, downtime });

  try {
    // Call Gemini API
    const response = await fetch('https://api.gemini.com/v1/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        bandwidth,
        latency,
        downtime,
      }),
    });

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Gemini API response data:', data);

    const insights = data.insights || 'No insights available.';

    return Response.json({ insights });
  } catch (error) {
    console.error('Error fetching insights:', error);
    return Response.json(
      { error: 'Failed to fetch insights', details: error.message },
      { status: 500 }
    );
  }
}