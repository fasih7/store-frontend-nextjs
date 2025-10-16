import Cookies from "js-cookie";
import { HttpError } from "../http-error";

export class HttpClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  protected async get(endpoint: string, headers: Record<string, string> = {}) {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
        ...headers,
      },
    });

    return this.handleResponse(res);
  }

  protected async post(
    endpoint: string,
    body: any,
    headers: Record<string, string> = {}
  ) {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
        ...headers,
      },
      body: JSON.stringify(body),
    });

    return this.handleResponse(res);
  }

  protected async put(
    endpoint: string,
    body: any,
    headers: Record<string, string> = {}
  ) {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
        ...headers,
      },
      body: JSON.stringify(body),
    });

    return this.handleResponse(res);
  }

  protected async patch(
    endpoint: string,
    body: any,
    headers: Record<string, string> = {}
  ) {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
        ...headers,
      },
      body: JSON.stringify(body),
    });

    return this.handleResponse(res);
  }

  protected async delete(
    endpoint: string,
    headers: Record<string, string> = {}
  ) {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
        ...headers,
      },
    });

    return this.handleResponse(res);
  }

  // need fixing once and for all
  private async handleResponse(res: Response) {
    if (!res.ok) {
      let parsedBody: any = null;
      let message = res.statusText;

      try {
        parsedBody = await res.clone().json();
        message = parsedBody?.message || message;
      } catch {
        try {
          parsedBody = await res.clone().text();
          message = parsedBody || message;
        } catch {
          message = res.statusText;
        }
      }

      console.log({ message });

      const error = new HttpError(message, res.status, res.url, parsedBody);
      console.log("newError: ", error);
      throw error;
    }

    // Handle empty responses (like 204 No Content or 200 OK with no body)
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return null;
    }

    // Check if response has content before trying to parse JSON
    const text = await res.text();
    if (!text.trim()) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  private getAuthHeader(): Record<string, string> {
    console.log("fromCookies: ", Cookies.get("access_token"));
    const token = Cookies.get("access_token") ?? null;
    console.log("the token: ", token);

    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
