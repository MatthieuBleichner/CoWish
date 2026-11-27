export async function getJson(path: string, signal?: AbortSignal): Promise<unknown> {
  const response = await fetch(path, signal ? { signal } : undefined);
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json() as Promise<unknown>;
}

export async function postJson(path: string, body: unknown): Promise<unknown> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json() as Promise<unknown>;
}
