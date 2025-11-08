import { HttpClient } from "../http-client";

export class AdminUsersGateway extends HttpClient {
  constructor() {
    super(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user`);
  }

  async getAllUsers(
    page?: number,
    limit?: number,
    options?: {
      searchQuery?: string;
      status?: string;
      sortBy?: string;
      sortOrder?: number;
    }
  ) {
    const params = new URLSearchParams();

    if (page) {
      params.append("page", page.toString());
    }
    if (limit) {
      params.append("limit", limit.toString());
    }

    if (options?.searchQuery) {
      params.append("searchQuery", options.searchQuery);
    }

    if (options?.status) {
      params.append("status", options.status);
    }

    if (options?.sortBy) {
      params.append("sortBy", options.sortBy);
      params.append("sortOrder", (options.sortOrder || -1).toString());
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

