1. Wywołanie prostego endpointu Workers
ts
import { fetchFromWorker } from "./cloudflareApi";

async function getData() {
  try {
    const data = await fetchFromWorker("/api/data");
    console.log("Otrzymane dane:", data);
    return data;
  } catch (error) {
    console.error("Błąd podczas pobierania danych z Workera:", error);
  }
}
Wywołuje endpoint /api/data hostowany w Workerze,

Automatycznie wykrywa i zgłasza błędy.

2. Wywołanie POST z wysłaniem danych JSON
ts
async function postData(payload: object) {
  try {
    const response = await fetchFromWorker("/api/post-endpoint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log("Odpowiedź po POST:", response);
    return response;
  } catch (error) {
    console.error("Błąd podczas wysyłania danych do Workera:", error);
  }
}
Wysyła JSON do wskazanego endpointu,

Używa fetchFromWorker do standaryzacji zapytania i obsługi błędów.

Wzory wywołań Durable Objects
3. Przykładowe wywołanie Durable Object po ID
ts
import { DurableObjectClient } from "./durableObjects";

async function fetchFromDO(namespace: any, objectId: string, path: string) {
  const client = new DurableObjectClient(namespace);
  try {
    const data = await client.fetchFromDO(objectId, path);
    console.log("Dane z Durable Object:", data);
    return data;
  } catch (error) {
    console.error("Błąd wywołania Durable Object:", error);
  }
}
namespace to instancja Cloudflare Durable Object namespace (dostępna w workerze),

objectId to identyfikator konkretnego obiektu,

path to ścieżka w Durable Object, którą chcesz wywołać.

4. Durable Object – wysłanie danych POST
ts
async function sendDataToDO(namespace: any, objectId: string, path: string, payload: object) {
  const client = new DurableObjectClient(namespace);
  try {
    const response = await client.fetchFromDO(objectId, path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log("Odpowiedź Durable Object po wysłaniu:", response);
    return response;
  } catch (error) {
    console.error("Błąd wysyłania do Durable Object:", error);
  }
}
Przesyła JSON do Durable Object przez POST,

Przydatne do aktualizacji stanu lub wywołań akcji po stronie Workers.

Przykłady użycia w praktyce
ts
// Pobieranie listy zmyć z worker/api
const list = await getData();

// Wysyłanie formularza lub polecenia
const result = await postData({ command: "start", id: 123 });

// Wywołanie Durable Object (np. trzymanie sesji)
const doResponse = await fetchFromDO(namespace, "unique-id", "/session");

// Aktualizacja Durable Object
const updateResult = await sendDataToDO(namespace, "unique-id", "/update", { status: "active" });