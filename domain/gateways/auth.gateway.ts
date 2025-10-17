import { HttpClient } from "./http-client";
import { HttpError } from "../http-error";
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

  async signUp(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    const response = await this.post("/sign-up", {
      firstName,
      lastName,
      email,
      password,
    });
    return response;
  }

  async verifyEmail(email: string, token: string) {
    const response = await this.post("/verify-email", { token, email });
    Cookies.set("access_token", response.access_token);
    return response;
  }

  async resendToken(email: string) {
    const formData = new URLSearchParams();
    formData.append("email", email);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/resend-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      }
    );

    if (!response.ok) {
      let parsedBody: any = null;
      let message = response.statusText;

      try {
        parsedBody = await response.clone().json();
        message = parsedBody?.message || message;
      } catch {
        try {
          parsedBody = await response.clone().text();
          message = parsedBody || message;
        } catch {
          message = response.statusText;
        }
      }

      const error = new HttpError(
        message,
        response.status,
        response.url,
        parsedBody
      );
      throw error;
    }

    return { success: true };
  }
}

export const authGateway = new AuthGateway();
