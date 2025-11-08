import { HttpClient } from "../http-client";

export class CategoriesGateway extends HttpClient {
  constructor() {
    super(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/categories`);
  }
  async getManyCategories() {
    return await this.get("");
  }

  async getOneWithSlug(slug: string) {
    return await this.get(`/slug/${slug}`);
  }

  async createCategory(form: FormData) {
    return this.post("", form);
  }

  async updateCategory(id: string, form: FormData) {
    return this.patch(`/${id}`, form);
  }

  async deleteCategory(id: string) {
    return this.delete(`/${id}`);
  }
}

export const categoriesGateway = new CategoriesGateway();





