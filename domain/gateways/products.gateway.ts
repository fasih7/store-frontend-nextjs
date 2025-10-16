import { HttpClient } from "./http-client";

export class ProductGateway extends HttpClient {
  constructor() {
    super(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}`);
  }
  async getManyProducts(options?: any) {
    let queryOptions = "?";
    options?.limit && (queryOptions += `pageNumber=1&limit=${options.limit}`);
    options?.sortBy &&
      (queryOptions += `&sortBy=${options.sortBy}&sortOrder=${
        options.order || 1
      }`);
    options?.category && (queryOptions += `&category=${options.category}`);

    console.log({ queryOptions });

    return await this.get(`/products${queryOptions}`);
  }

  async getProductById(id: string) {
    return this.get(`/products/product/${id}`);
  }

  async getFeaturedProducts() {
    return this.get("/featured-products");
  }

  async getRecentlyAddedProducts() {
    return this.get("/products/recently-added");
  }
}

export const productGateway = new ProductGateway();
