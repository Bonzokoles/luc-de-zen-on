Przykład 1: Integracja prostego fetch z UI (np. React, Svelte, Astro)
tsx
import { fetchFromWorker } from "./cloudflareApi";
import { useState, useEffect } from "react";

export function WorkerDataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFromWorker("/api/data")
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError("Błąd podczas pobierania danych");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Ładowanie danych...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Dane z Worker API:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
Przykład 2: Formularz wysyłający dane przez POST do Workers (Svelte)
text
<script lang="ts">
  import { postData } from "./cloudflareApi";
  let inputValue = "";
  let responseMessage = "";
  let errorMessage = "";

  async function handleSubmit() {
    try {
      const response = await postData({ value: inputValue });
      responseMessage = "Wysłano pomyślnie";
      errorMessage = "";
    } catch (e) {
      errorMessage = "Błąd wysyłania danych";
      responseMessage = "";
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <input type="text" bind:value={inputValue} placeholder="Wpisz coś" />
  <button type="submit">Wyślij</button>
</form>

{#if responseMessage}
  <p style="color: green;">{responseMessage}</p>
{/if}
{#if errorMessage}
  <p style="color: red;">{errorMessage}</p>
{/if}
Przykład 3: Wywołanie Durable Object w komponencie front-end (Astro + TS)
ts
import { DurableObjectClient } from "./durableObjects";

async function loadSessionData(namespace: any, sessionId: string) {
  const client = new DurableObjectClient(namespace);
  try {
    const session = await client.fetchFromDO(sessionId, "/session");
    console.log("Sesja:", session);
    return session;
  } catch (err) {
    console.error("Błąd pobierania sesji: ", err);
  }
}
Dobre praktyki w integracji:
Pokaż użytkownikowi status ładowania i błędów w UI,

Używaj centralized fetch helpers (np. fetchFromWorker, postData) aby unikać duplikacji,

W przypadku Durable Objects staraj się cachować stan frontendowy i odświeżać w określonych momentach,

Dbaj o obsługę wyjątków i czytelne logi.