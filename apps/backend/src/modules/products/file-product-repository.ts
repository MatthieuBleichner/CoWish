import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import type { Product, ProductRepository } from './types.js';

interface ProductStore {
  version: 1;
  products: Product[];
}

const emptyStore = (): ProductStore => ({ version: 1, products: [] });

/**
 * Temporary JSON-file persistence used while the product prototype has no database.
 *
 * This repository is intended for local, single-process use only. Keeping it behind the
 * ProductRepository interface allows it to be replaced by a database-backed implementation
 * without changing the product service.
 */
export class FileProductRepository implements ProductRepository {
  private writeQueue = Promise.resolve();

  public constructor(private readonly path: string) {}

  public async list(): Promise<Product[]> {
    await this.writeQueue;
    return structuredClone((await this.readStore()).products);
  }

  public async findById(id: string): Promise<Product | undefined> {
    return (await this.list()).find(product => product.id === id);
  }

  public async findBySourceUrl(sourceUrl: string): Promise<Product | undefined> {
    return (await this.list()).find(product => product.sourceUrl === sourceUrl);
  }

  public async save(product: Product): Promise<void> {
    const operation = this.writeQueue.then(async () => {
      const store = await this.readStore();
      const index = store.products.findIndex(candidate => candidate.id === product.id);
      if (index === -1) store.products.push(structuredClone(product));
      else store.products[index] = structuredClone(product);
      await this.writeStore(store);
    });
    this.writeQueue = operation.catch(() => undefined);
    await operation;
  }

  private async readStore(): Promise<ProductStore> {
    try {
      const parsed: unknown = JSON.parse(await readFile(this.path, 'utf8'));
      if (!this.isProductStore(parsed)) throw new Error(`Invalid product store at ${this.path}`);
      return parsed;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return emptyStore();
      throw error;
    }
  }

  private async writeStore(store: ProductStore): Promise<void> {
    await mkdir(dirname(this.path), { recursive: true });
    const temporaryPath = `${this.path}.tmp`;
    await writeFile(temporaryPath, `${JSON.stringify(store, null, 2)}\n`, 'utf8');
    await rename(temporaryPath, this.path);
  }

  private isProductStore(value: unknown): value is ProductStore {
    return (
      typeof value === 'object' &&
      value !== null &&
      'version' in value &&
      value.version === 1 &&
      'products' in value &&
      Array.isArray(value.products)
    );
  }
}
