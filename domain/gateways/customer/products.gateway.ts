import { HttpClient } from "../http-client";

export class ProductGateway extends HttpClient {
  constructor() {
    super(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}`);
  }
  async createProduct(form: FormData) {
    return this.post(`/products`, form);
  }
  async updateProduct(id: string, form: FormData) {
    return this.put(`/products/${id}`, form);
  }
  async getManyProducts(options?: any) {
    const params = new URLSearchParams();

    if (options?.page) {
      params.append("page", options.page.toString());
    }
    if (options?.limit) {
      params.append("limit", options.limit.toString());
    }
    if (options?.sortBy) {
      params.append("sortBy", options.sortBy);
      params.append("sortOrder", (options.order || 1).toString());
    }
    if (options?.category) {
      params.append("category", options.category);
    }
    if (options?.searchQuery) {
      params.append("searchQuery", options.searchQuery);
    }
    if (options?.relations) {
      params.append("relations", options.relations);
    }

    const queryString = params.toString();
    const queryOptions = queryString ? `?${queryString}` : "";

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

  async searchProducts(searchQuery: string) {
    return this.get(
      `/products/search?searchQuery=${encodeURIComponent(searchQuery)}`
    );
  }

  async deleteProduct(id: string) {
    return this.delete(`/products/${id}`);
  }
}

export const productGateway = new ProductGateway();
