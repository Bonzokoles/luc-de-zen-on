Etap 2: Integracja Cloudflare R1 (relacyjna baza) i R2 (obiektowy magazyn)
Krok 1: Konfiguracja dostępu do R1 i R2 w Cloudflare
W panelu Cloudflare utwórz lub skonfiguruj instancję R1 (np. bazę danych SQL) oraz R2 (storage obiektowy).

Wygeneruj odpowiednie dane uwierzytelniające (credentials) i adresy endpointów, które będą używane w Workers.

Krok 2: Obsługa R1 (relacyjna baza danych) w Workers
Zaimportuj lub zaimplementuj klienta do łączenia się z R1 w kodzie Workers (Cloudflare oferuje SDK lub REST API).

Zaprojektuj funkcje CRUD do operacji na tabelach np. dla agentów, logów czy konfiguracji:

createAgent(data)

readAgent(id)

updateAgent(id, data)

deleteAgent(id)

Przykładowy kod zapytania do R1 (pseudokod):

javascript
async function queryR1(sql, params) {
  // Wywołanie HTTP do endpointu R1 z SQL i parametrami
  const response = await fetch(R1_ENDPOINT, { 
    method: "POST", 
    headers: { "Authorization": `Bearer ${R1_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: sql, parameters: params })
  });
  return await response.json();
}
Krok 3: Obsługa R2 (obiektowy magazyn) w Workers
Skorzystaj z wbudowanych API Cloudflare Workers do operacji na R2 (np. R2_BUCKET.put(), R2_BUCKET.get(), R2_BUCKET.delete()).

Przechowuj większe lub binarne dane, jak pliki, obrazy wygenerowane przez AI, dokumenty itp.

Przykład zapisu pliku do R2:

javascript
await R2_BUCKET.put("some-key", fileData, { httpMetadata: { contentType: "image/png" } });
Przykład pobrania pliku z R2:

javascript
const object = await R2_BUCKET.get("some-key");
const arrayBuffer = await object.arrayBuffer();
Krok 4: Migracja i plan danych
Zdecyduj, które dane możesz przenieść z KV do R1 i R2, na podstawie potrzeb:

R1: dane strukturalne, które wymagają zapytań SQL, relacji i bardziej złożonych operacji.

R2: pliki, obrazy, kopie zapasowe, większe obiekty.

Zaadaptuj API w Workers do korzystania z nowych magazynów dla wybranych zasobów.

Po wykonaniu tej integracji Twoja aplikacja będzie mogła korzystać z zaawansowanego przechowywania danych i skalowalności oferowanej przez R1 i R2.