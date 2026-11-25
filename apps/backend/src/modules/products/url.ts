import { UnsupportedProductUrlError } from './errors.js';

const selectionParameters = new Set(['size', 'variant']);

export const normalizeProductUrl = (input: string): string => {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new UnsupportedProductUrlError('A valid product URL is required');
  }

  if (url.protocol !== 'https:') {
    throw new UnsupportedProductUrlError('Only HTTPS product URLs are supported');
  }

  const normalized = new URL(`${url.origin}${url.pathname}`);
  for (const [key, value] of url.searchParams) {
    if (selectionParameters.has(key)) normalized.searchParams.set(key, value);
  }
  normalized.searchParams.sort();
  return normalized.toString();
};
