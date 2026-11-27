import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

import { UnsupportedProductUrlError } from '../src/modules/products/errors.js';
import { FileProductRepository } from '../src/modules/products/file-product-repository.js';
import { ProductService } from '../src/modules/products/product.service.js';
import type { ExtractedProduct, ProductExtractor } from '../src/modules/products/types.js';
import { normalizeProductUrl } from '../src/modules/products/url.js';

class SequenceExtractor implements ProductExtractor {
  public constructor(private readonly results: ExtractedProduct[]) {}

  public async extract(): Promise<ExtractedProduct> {
    const result = this.results.shift();
    if (!result) throw new Error('No extraction result configured');
    return result;
  }
}

test('imports, persists, lists, and refreshes a product with price-change detection', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'cowish-products-'));
  const storePath = join(directory, 'products.json');
  const dates = [new Date('2026-11-24T10:00:00Z'), new Date('2026-11-25T10:00:00Z')];
  const service = new ProductService(
    new FileProductRepository(storePath),
    new SequenceExtractor([
      {
        name: 'Tilda',
        imageUrl: 'https://img/one.jpg',
        price: 284.25,
        currency: 'EUR',
        availability: 'in_stock'
      },
      {
        name: 'Tilda',
        imageUrl: 'https://img/two.jpg',
        price: 269,
        currency: 'EUR',
        availability: 'out_of_stock'
      }
    ]),
    () => dates.shift() ?? new Date('2026-11-26T10:00:00Z'),
    () => 'product-1'
  );

  const first = await service.import(
    'https://shop.example.com/products/tapis-tilda?variant=42&_su_rec=tracking'
  );
  assert.equal(first.product.sourceUrl, 'https://shop.example.com/products/tapis-tilda?variant=42');
  assert.equal(first.priceChanged, false);
  assert.equal(first.product.priceHistory.length, 1);

  const second = await service.refresh('product-1');
  assert.equal(second.priceChanged, true);
  assert.equal(second.previousPrice, 284.25);
  assert.equal(second.product.price, 269);
  assert.equal(second.product.imageUrl, 'https://img/two.jpg');
  assert.equal(second.product.availability, 'out_of_stock');
  assert.equal(second.product.priceHistory.length, 2);
  assert.equal((await service.list()).length, 1);

  const persisted = JSON.parse(await readFile(storePath, 'utf8')) as {
    products: Array<{ availability: string }>;
  };
  assert.equal(persisted.products.length, 1);
  assert.equal(persisted.products[0]?.availability, 'out_of_stock');
});

test('rejects missing and non-HTTPS product URLs', () => {
  assert.throws(() => normalizeProductUrl(''), UnsupportedProductUrlError);
  assert.throws(
    () => normalizeProductUrl('http://example.com/product'),
    new UnsupportedProductUrlError('Only HTTPS product URLs are supported')
  );
});

test('refreshes all imported products', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'cowish-products-'));
  const service = new ProductService(
    new FileProductRepository(join(directory, 'products.json')),
    new SequenceExtractor([
      {
        name: 'First product',
        imageUrl: 'https://img/first.jpg',
        price: 10,
        currency: 'EUR',
        availability: 'in_stock'
      },
      {
        name: 'Second product',
        imageUrl: 'https://img/second.jpg',
        price: 20,
        currency: 'EUR',
        availability: 'in_stock'
      },
      {
        name: 'First product',
        imageUrl: 'https://img/first.jpg',
        price: 9,
        currency: 'EUR',
        availability: 'in_stock'
      },
      {
        name: 'Second product',
        imageUrl: 'https://img/second.jpg',
        price: 20,
        currency: 'EUR',
        availability: 'out_of_stock'
      }
    ]),
    () => new Date('2026-11-27T10:00:00Z'),
    (() => {
      const ids = ['product-1', 'product-2'];
      return () => ids.shift() ?? 'unexpected-product';
    })()
  );

  await service.import('https://shop.example.com/products/first');
  await service.import('https://shop.example.com/products/second');

  const results = await service.refreshAll();

  assert.equal(results.length, 2);
  assert.equal(results[0]?.status, 'fulfilled');
  assert.equal(results[1]?.status, 'fulfilled');
  if (results[0]?.status !== 'fulfilled' || results[1]?.status !== 'fulfilled') {
    assert.fail('Expected both product refreshes to succeed');
  }
  assert.equal(results[0].value.product.id, 'product-1');
  assert.equal(results[0].value.priceChanged, true);
  assert.equal(results[1].value.product.id, 'product-2');
  assert.equal(results[1].value.priceChanged, false);
  assert.equal(results[1].value.product.availability, 'out_of_stock');
  assert.deepEqual(
    (await service.list()).map(product => product.priceHistory.length),
    [2, 2]
  );
});

test('continues refreshing products after one refresh fails', async () => {
  const products = [
    {
      id: 'product-1',
      sourceUrl: 'https://shop.example.com/first',
      name: 'First',
      imageUrl: 'https://img/first.jpg',
      price: 10,
      currency: 'EUR',
      availability: 'in_stock' as const,
      createdAt: '2026-11-27T10:00:00.000Z',
      lastCheckedAt: '2026-11-27T10:00:00.000Z',
      priceHistory: []
    },
    {
      id: 'product-2',
      sourceUrl: 'https://shop.example.com/second',
      name: 'Second',
      imageUrl: 'https://img/second.jpg',
      price: 20,
      currency: 'EUR',
      availability: 'in_stock' as const,
      createdAt: '2026-11-27T10:00:00.000Z',
      lastCheckedAt: '2026-11-27T10:00:00.000Z',
      priceHistory: []
    }
  ];
  const repository = {
    list: async () => products,
    findById: async () => undefined,
    findBySourceUrl: async () => undefined,
    save: async () => undefined
  };
  let extraction = 0;
  const extractor: ProductExtractor = {
    extract: async () => {
      extraction += 1;
      if (extraction === 1) throw new Error('Source unavailable');
      return {
        name: 'Second',
        imageUrl: 'https://img/second.jpg',
        price: 19,
        currency: 'EUR',
        availability: 'in_stock'
      };
    }
  };
  const service = new ProductService(repository, extractor);

  const results = await service.refreshAll();

  assert.equal(results[0]?.status, 'rejected');
  if (results[0]?.status !== 'rejected') assert.fail('Expected the first refresh to fail');
  assert.equal(results[0].productId, 'product-1');
  assert.equal(results[1]?.status, 'fulfilled');
});
