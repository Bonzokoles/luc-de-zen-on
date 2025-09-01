export async function POST({ request }) {
  const { prompt } = await request.json()

  if (!prompt || prompt.trim() === '') {
    return new Response(JSON.stringify({ error: 'Brak promptu' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const FLOWISE_API_URL = import.meta.env.PUBLIC_FLOWISE_API_URL || 'https://your-flowise-instance.com/api/v1/prediction/your-flow-id'
  const FLOWISE_API_TOKEN = import.meta.env.PUBLIC_FLOWISE_API_TOKEN

  try {
    const response = await fetch(FLOWISE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FLOWISE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Flowise API error: ${response.status} ${errText}`)
    }

    const data = await response.json()
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
