export async function safeFetch(url: string, options?: RequestInit) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Fetch error ${response.status}: ${error}`);
  }
  return response.json();
}

export function authFetch(url: string, token: string, options: RequestInit = {}) {
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`
  };
  return fetch(url, options);
}