import assert from 'node:assert/strict';
import test from 'node:test';
import type { Product } from '@cowish/shared';
import { QueryClientProvider } from '@tanstack/react-query';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../src/App';
import { ProductCollection } from '../src/features/products/components/ProductCollection';
import { ProductTile } from '../src/features/products/components/ProductTile';
import i18n from '../src/i18n';
import { cowishTheme } from '../src/theme';
import { createQueryClient } from '../src/api/query-client';

const renderApp = (route = '/') =>
  renderToStaticMarkup(
    <QueryClientProvider client={createQueryClient()}>
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>
  );

test('exposes the CoWish visual identity through the shared MUI theme', () => {
  assert.equal(cowishTheme.palette.primary.main, '#eb674e');
  assert.equal(cowishTheme.palette.background.default, '#fbf8f1');
  assert.equal(cowishTheme.typography.fontFamily, "'DM Sans', sans-serif");
});

test('renders the landing page and its three-step journey', async () => {
  await i18n.changeLanguage('en');
  const markup = renderApp();

  assert.match(markup, /data-testid="landing-page"/);
  assert.match(markup, /data-testid="landing-step-gather"/);
  assert.match(markup, /data-testid="landing-step-compare"/);
  assert.match(markup, /data-testid="landing-step-choose"/);
});

test('provides navigation and an accessible language switcher', async () => {
  await i18n.changeLanguage('en');
  const markup = renderApp();

  assert.match(markup, /href="#how-it-works"/);
  assert.match(markup, /href="\/products"/);
  assert.match(markup, /id="how-it-works"/);
  assert.match(markup, /data-testid="language-switcher"/);
  assert.match(markup, /aria-pressed="true"/);
});

test('renders the product library at /products', async () => {
  await i18n.changeLanguage('en');
  const markup = renderApp('/products');

  assert.match(markup, /data-testid="products-page"/);
  assert.match(markup, /data-testid="product-import-form"/);
  assert.match(markup, /type="url"/);
  assert.match(markup, /Add product/);
  assert.match(markup, /data-testid="products-loading"/);
  assert.match(markup, /href="\/"/);
});

test('displays every product metadata field', async () => {
  await i18n.changeLanguage('en');
  const product: Product = {
    id: 'product-1',
    name: 'Tilda rug',
    imageUrl: 'https://images.example/tilda.jpg',
    price: 269,
    currency: 'EUR',
    availability: 'out_of_stock',
    sourceUrl: 'https://shop.example/products/tilda',
    createdAt: '2026-11-24T10:00:00Z',
    lastCheckedAt: '2026-11-25T10:00:00Z',
    priceHistory: [
      { price: 284.25, currency: 'EUR', checkedAt: '2026-11-24T10:00:00Z' },
      { price: 269, currency: 'EUR', checkedAt: '2026-11-25T10:00:00Z' }
    ]
  };
  const markup = renderToStaticMarkup(<ProductTile product={product} language="en" />);

  assert.match(markup, /data-testid="product-tile-product-1"/);
  assert.match(markup, /data-testid="product-name"/);
  assert.match(markup, /data-testid="product-availability"/);
  assert.match(markup, /data-testid="product-identifier"/);
  assert.match(markup, /data-testid="product-price-history"/);
  assert.equal(markup.match(/data-testid="product-price-observation"/g)?.length, 2);
  assert.match(markup, /data-testid="product-source-link"/);
});

test('shows a dedicated empty-products state', async () => {
  await i18n.changeLanguage('en');
  const markup = renderToStaticMarkup(<ProductCollection products={[]} language="en" />);
  assert.match(markup, /data-testid="products-empty-state"/);
});
