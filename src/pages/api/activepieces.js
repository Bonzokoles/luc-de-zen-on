export async function POST({ request }) {
  const inputData = await request.json()

  const ACTIVEPIECES_API_URL = import.meta.env.PUBLIC_ACTIVEPIECES_API_URL || 'https://your-activepieces-instance.com/api/v1/flows/your-flow-id/run'
  const ACTIVEPIECES_API_TOKEN = import.meta.env.PUBLIC_ACTIVEPIECES_API_TOKEN

  try {
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
      throw new Error(`ActivePieces API error: ${response.status} ${errText}`)
    }

    const data = await response.json()
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json', },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', },
    })
  }
}
