export async function post({ request }) {
  try {
    const inputData = await request.json()

    const ACTIVEPIECES_API_URL = 'https://twoj-activepieces-endpoint/api/workflows/TWOJ_WORKFLOW_ID/run'
    const ACTIVEPIECES_API_TOKEN = import.meta.env.PUBLIC_ACTIVEPIECES_API_TOKEN

    const response = await fetch(ACTIVEPIECES_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACTIVEPIECES_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputData),
    })

    if (!response.ok) {
      const errText = await response.text()
      return new Response(
        JSON.stringify({ error: `ActivePieces API error: ${response.status} - ${errText}` }),
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
