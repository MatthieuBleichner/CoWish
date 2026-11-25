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
      { name: 'Tilda', imageUrl: 'https://img/one.jpg', price: 284.25, currency: 'EUR' },
      { name: 'Tilda', imageUrl: 'https://img/two.jpg', price: 269, currency: 'EUR' }
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
  assert.equal(second.product.priceHistory.length, 2);
  assert.equal((await service.list()).length, 1);

  const persisted = JSON.parse(await readFile(storePath, 'utf8')) as { products: unknown[] };
  assert.equal(persisted.products.length, 1);
});

test('rejects missing and non-HTTPS product URLs', () => {
  assert.throws(() => normalizeProductUrl(''), UnsupportedProductUrlError);
  assert.throws(
    () => normalizeProductUrl('http://example.com/product'),
    new UnsupportedProductUrlError('Only HTTPS product URLs are supported')
  );
});
