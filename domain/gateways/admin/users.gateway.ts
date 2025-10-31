import { HttpClient } from "../http-client";

export class AdminUsersGateway extends HttpClient {
  constructor() {
    super(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user`);
  }

  async getAllUsers(page?: number, limit?: number) {
    const params = new URLSearchParams();

    if (page) {
      params.append("page", page.toString());
    }
    if (limit) {
      params.append("limit", limit.toString());
    }

    const queryString = params.toString();
    const queryOptions = queryString ? `?${queryString}` : "";

    return await this.get(`/all${queryOptions}`);
  }

  async updateUserStatus(userId: string, status: string) {
    return await this.patch(`/${userId}/status`, { status });
  }
}

export const adminUsersGateway = new AdminUsersGateway();

