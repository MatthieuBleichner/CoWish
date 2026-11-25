import assert from 'node:assert/strict';
import { test } from 'node:test';

import { extractProductFromHtml } from '../src/modules/products/product-extractor.js';

test('extracts the Ruggable variant selected by size', () => {
  const html = `
    <meta property="og:title" content="Farrow rug">
    <script type="application/ld+json">
      [{"@type":"ProductGroup","hasVariant":[
        {"@type":"Product","name":"Farrow 150x215","size":"150x215","image":"https://img/small.jpg","offers":{"price":"349.30","priceCurrency":"EUR"}},
        {"@type":"Product","name":"Farrow 185x275","size":"185x275","image":"https://img/large.jpg","offers":[{"price":"496.30","priceCurrency":"EUR"}]}
      ]}]
    </script>`;

  assert.deepEqual(
    extractProductFromHtml(
      html,
      'https://ruggable.eu/fr/products/farrow-ivory-brown-easy-care-wool-rug?size=185x275'
    ),
    {
      name: 'Farrow 185x275',
      imageUrl: 'https://img/large.jpg',
      price: 496.3,
      currency: 'EUR'
    }
  );
});

test('extracts the selected Teppana variant and upgrades its image URL', () => {
  const html = `
    <meta property="og:title" content="Tapis Tilda Rouge Bordeaux">
    <meta property="og:image" content="http://teppana.fr/tilda.jpg">
    <script type="application/ld+json">
      {"@type":"Product","name":"Tapis Tilda Rouge Bordeaux","image":"//teppana.fr/tilda-variant.jpg","offers":{"price":"284.25","priceCurrency":"EUR"}}
    </script>`;

  assert.deepEqual(
    extractProductFromHtml(
      html,
      'https://teppana.fr/products/tapis-tilda-rouge-bordeaux?variant=56656117465468'
    ),
    {
      name: 'Tapis Tilda Rouge Bordeaux',
      imageUrl: 'https://teppana.fr/tilda-variant.jpg',
      price: 284.25,
      currency: 'EUR'
    }
  );
});

test('falls back to Open Graph product metadata', () => {
  const html = `
    <meta content="Fallback rug &amp; runner" property="og:title">
    <meta content="69,00" property="og:price:amount">
    <meta content="EUR" property="og:price:currency">
    <meta content="https://teppana.fr/fallback.jpg" property="og:image:secure_url">`;

  assert.deepEqual(extractProductFromHtml(html, 'https://teppana.fr/products/rug'), {
    name: 'Fallback rug & runner',
    imageUrl: 'https://teppana.fr/fallback.jpg',
    price: 69,
    currency: 'EUR'
  });
});
