export async function getJson(path: string, signal?: AbortSignal): Promise<unknown> {
  const response = await fetch(path, signal ? { signal } : undefined);
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json() as Promise<unknown>;
}
