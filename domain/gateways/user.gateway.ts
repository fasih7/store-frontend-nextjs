import { HttpClient } from "./http-client";

export class UserGateway extends HttpClient {
  constructor() {
    super(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user`);
  }

  async getCurrentUser() {
    const response = await this.get("/current-user");

    return response;
  }
}

export const userGateway = new UserGateway();
