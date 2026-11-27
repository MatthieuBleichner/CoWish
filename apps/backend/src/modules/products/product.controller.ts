import type { NextFunction, Request, Response } from 'express';

import { ProductImportError, ProductNotFoundError, UnsupportedProductUrlError } from './errors.js';
import { productService, type ProductService } from './product.service.js';
import type { Product, ProductRefreshResult } from './types.js';

interface ErrorResponse {
  error: string;
}

interface ListProductsResponse {
  products: Product[];
}

interface ImportProductRequestBody {
  url: string;
}

type ImportProductResponse = ProductRefreshResult | ErrorResponse;

interface RefreshProductRequestParams {
  id: string;
}

type RefreshProductResponse = ProductRefreshResult | ErrorResponse;

type RefreshProductOutcome =
  | { status: 'fulfilled'; value: ProductRefreshResult }
  | { status: 'rejected'; productId: string; error: string };

interface RefreshAllProductsResponse {
  results: RefreshProductOutcome[];
}

const errorMessage = (reason: unknown): string =>
  reason instanceof Error ? reason.message : 'Product refresh failed';

export class ProductController {
  public constructor(private readonly service: ProductService) {}

  public list = async (
    _request: Request,
    response: Response<ListProductsResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      response.status(200).json({ products: await this.service.list() });
    } catch (error) {
      next(error);
    }
  };

  public import = async (
    request: Request<Record<string, never>, ImportProductResponse, ImportProductRequestBody>,
    response: Response<ImportProductResponse>,
    next: NextFunction
  ): Promise<void> => {
    if (typeof request.body?.url !== 'string' || request.body.url.trim() === '') {
      response.status(400).json({ error: 'A product URL is required' });
      return;
    }

    try {
      const result = await this.service.import(request.body.url);
      response.status(result.previousPrice === null ? 201 : 200).json(result);
    } catch (error) {
      if (error instanceof UnsupportedProductUrlError) {
        response.status(400).json({ error: error.message });
        return;
      }
      if (error instanceof ProductImportError) {
        response.status(422).json({ error: error.message });
        return;
      }
      next(error);
    }
  };

  public refresh = async (
    request: Request<RefreshProductRequestParams, RefreshProductResponse>,
    response: Response<RefreshProductResponse>,
    next: NextFunction
  ): Promise<void> => {
    const productId = request.params.id;
    if (typeof productId !== 'string' || productId === '') {
      response.status(400).json({ error: 'A product identifier is required' });
      return;
    }

    try {
      response.status(200).json(await this.service.refresh(productId));
    } catch (error) {
      if (error instanceof ProductNotFoundError) {
        response.status(404).json({ error: error.message });
        return;
      }
      if (error instanceof ProductImportError) {
        response.status(422).json({ error: error.message });
        return;
      }
      next(error);
    }
  };

  public refreshAll = async (
    _request: Request,
    response: Response<RefreshAllProductsResponse | ErrorResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const results = (await this.service.refreshAll()).map(result =>
        result.status === 'fulfilled'
          ? result
          : {
              status: result.status,
              productId: result.productId,
              error: errorMessage(result.reason)
            }
      );
      response.status(200).json({ results });
    } catch (error) {
      next(error);
    }
  };
}

export const productController = new ProductController(productService);
