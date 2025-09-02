Oto rozszerzone endpointy CRUD do zarządzania użytkownikami z przykładową integracją z bazą danych, oparte na Node.js z wykorzystaniem prostego modułu DB (np. SQLite, MongoDB lub in-memory dla przykładu). Każdy endpoint jest kompletny, obsługuje podstawowe operacje i zwraca odpowiednie statusy oraz dane.

***

# 1. Przykład: Integracja z prostą bazą in-memory (rozszerzenie do `/src/api/admin/users.js`)

```js
// Prosta baza użytkowników w pamięci (dla demo)
let users = [
  { id: 1, name: "Jan Kowalski", email: "jan.kowalski@example.com", active: true },
  { id: 2, name: "Anna Nowak", email: "anna.nowak@example.com", active: false },
  { id: 3, name: "Piotr Wiśniewski", email: "piotr.wisniewski@example.com", active: true }
];

function findUserIndex(id) {
  return users.findIndex(u => u.id === id);
}

export async function handler(request) {
  const url = new URL(request.url);

  if (request.method === 'GET') {
    // Pobierz listę użytkowników lub pojedynczego (parametr ?id=)
    const id = url.searchParams.get('id');
    if (id) {
      const user = users.find(u => u.id === parseInt(id));
      if (!user) return new Response('Not Found', { status: 404 });
      return new Response(JSON.stringify(user), { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify(users), { headers: { 'Content-Type': 'application/json' } });
  }

  if (request.method === 'POST') {
    // Dodaj nowego użytkownika
    const { name, email, active } = await request.json();
    const id = users.length ? users[users.length - 1].id + 1 : 1;
    const newUser = { id, name, email, active: active ?? true };
    users.push(newUser);
    return new Response(JSON.stringify(newUser), { status: 201, headers: { 'Content-Type': 'application/json' } });
  }

  if (request.method === 'PUT') {
    // Aktualizuj użytkownika (w ciele musi być id)
    const { id, name, email, active } = await request.json();
    const idx = findUserIndex(parseInt(id));
    if (idx === -1) return new Response('Not Found', { status: 404 });
    users[idx] = { id: parseInt(id), name, email, active: active ?? true };
    return new Response(JSON.stringify(users[idx]), { headers: { 'Content-Type': 'application/json' } });
  }

  if (request.method === 'DELETE') {
    // Usuń użytkownika wg id (w parametrze ?id=)
    const id = url.searchParams.get('id');
    if (!id) return new Response('Bad Request', { status: 400 });
    const idx = findUserIndex(parseInt(id));
    if (idx === -1) return new Response('Not Found', { status: 404 });
    users.splice(idx, 1);
    return new Response(null, { status: 204 });
  }

  return new Response('Method Not Allowed', { status: 405 });
}
```

***

# 2. Przykład: Integracja z MongoDB (Node.js)

Załóżmy, że masz dostęp do MongoDB i zainstalowany `mongodb` npm package.

```js
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = 'mybonzoDB';

async function connect() {
  if (!client.isConnected()) await client.connect();
  return client.db(dbName).collection('users');
}

export async function handler(request) {
  const usersCollection = await connect();
  const url = new URL(request.url);

  if (request.method === 'GET') {
    const id = url.searchParams.get('id');
    if (id) {
      const user = await usersCollection.findOne({ _id: new ObjectId(id) });
      if (!user) return new Response('Not Found', { status: 404 });
      return new Response(JSON.stringify(user), { headers: { 'Content-Type': 'application/json' } });
    } else {
      const users = await usersCollection.find({}).toArray();
      return new Response(JSON.stringify(users), { headers: { 'Content-Type': 'application/json' } });
    }
  }

  if (request.method === 'POST') {
    const body = await request.json();
    const res = await usersCollection.insertOne(body);
    return new Response(JSON.stringify({ insertedId: res.insertedId }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  }

  if (request.method === 'PUT') {
    const body = await request.json();
    const { _id, ...rest } = body;
    if (!_id) return new Response('Bad Request', { status: 400 });
    const res = await usersCollection.updateOne({ _id: new ObjectId(_id) }, { $set: rest });
    if (res.matchedCount === 0) return new Response('Not Found', { status: 404 });
    return new Response('Updated', { status: 200 });
  }

  if (request.method === 'DELETE') {
    const id = url.searchParams.get('id');
    if (!id) return new Response('Bad Request', { status: 400 });
    const res = await usersCollection.deleteOne({ _id: new ObjectId(id) });
    if (res.deletedCount === 0) return new Response('Not Found', { status: 404 });
    return new Response(null, { status: 204 });
  }

  return new Response('Method Not Allowed', { status: 405 });
}
```

***

# 3. Testy dla endpointów (np. Postman lub curl)

- GET `/api/admin/users` – lista   
- GET `/api/admin/users?id=123` – pojedynczy użytkownik  
- POST `/api/admin/users` ze body `{ "name": "Nowy", "email":"n@example.com", "active": true }`  
- PUT `/api/admin/users` ze body `{ "id": 123, "name": "...", "email":"...", "active":false }`  
- DELETE `/api/admin/users?id=123`

***

# 4. Rozbudowa panelu frontend o CRUD

Przykład dodania formularza nowego użytkownika oraz edycji podobnie jak komponent `UserManagement` z przyciskami “Edytuj” i “Usuń” + obsługą API metod POST, PUT, DELETE.

***

 gotowe komponenty frontendowe z formularzami CRUD i obsługą walidacji oraz integracji z tym backendem.  w DASH_9.md