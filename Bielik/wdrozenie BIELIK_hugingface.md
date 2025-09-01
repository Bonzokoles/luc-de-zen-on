Aby korzystać z modelu Bielik za pośrednictwem API Hugging Face i ustawić wywołania tego API w Cloudflare Workers, wykonaj poniższe kroki:

1. Uzyskaj token dostępu do API Hugging Face
Zaloguj się lub zarejestruj na https://huggingface.co

W ustawieniach konta wygeneruj token API z odpowiednimi uprawnieniami (read access)

2. Przykład wywołania API Hugging Face w Cloudflare Workerze
javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  try {
    const { prompt } = await request.json()

    const response = await fetch('https://api-inference.huggingface.co/models/nazwa-uzytkownika/bielik', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + HUGGINGFACE_API_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        options: { wait_for_model: true }
      })
    })

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`)
    }

    const data = await response.json()
    // Zakładamy, że odpowiedź jest tablicą z wynikiem w data[0].generated_text
    const generatedText = data[0]?.generated_text || "Brak odpowiedzi z modelu."

    return new Response(JSON.stringify({ result: generatedText }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
3. Ustawienie sekretnych zmiennych środowiskowych w Cloudflare
Zaloguj się do panelu Cloudflare.

W sekcji Workers dodaj zmienną środowiskową HUGGINGFACE_API_TOKEN z wartością Twojego tokena Hugging Face.

W powyższym skrypcie zmienna HUGGINGFACE_API_TOKEN powinna pochodzić ze środowiska Workers (np. env.HUGGINGFACE_API_TOKEN zależnie od sposobu wdrożenia).

4. Jak to działa?
Worker odbiera zapytanie POST z prompt w JSON.

Przekazuje prompt do API Hugging Face.

Odbiera wygenerowany tekst i zwraca go do klienta.

Worker pełni rolę proxy i zabezpieczonej bramy do modelu Bielik.

