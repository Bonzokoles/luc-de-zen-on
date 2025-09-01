export async function post({ request }) {
  try {
    const { prompt } = await request.json()

    if (!prompt || prompt.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Prompt jest wymagany' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const FLOWISE_API_URL = 'https://twoj-flowise-endpoint/api/flow/run'
    const FLOWISE_API_TOKEN = import.meta.env.PUBLIC_FLOWISE_API_TOKEN

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
      return new Response(
        JSON.stringify({ error: `Flowise API error: ${response.status} - ${errText}` }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: `Server error: ${error.message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
