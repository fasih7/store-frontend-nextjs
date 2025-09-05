import { HttpClient } from "./http-client";
import Cookies from "js-cookie";

export class AuthGateway extends HttpClient {
  constructor() {
    super(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth`);
  }

  async login(email: string, password: string) {
    const response = await this.post("/login", { email, password });
    Cookies.set("access_token", response.access_token);
    return { success: true };
  }
}

export const authGateway = new AuthGateway();
