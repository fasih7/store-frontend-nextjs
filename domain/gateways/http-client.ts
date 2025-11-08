import Cookies from "js-cookie";
import { HttpError } from "../http-error";
import { getServerAccessToken } from "./helpers/server-side.helpers";

interface QueuedRequest {
  endpoint: string;
  method: string;
  body?: any;
  headers?: Record<string, string>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
}

export class HttpClient {
  private readonly baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<any> | null = null;
  private requestQueue: QueuedRequest[] = [];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  protected async get(endpoint: string, headers: Record<string, string> = {}) {
    return this.makeRequest(endpoint, "GET", undefined, headers);
  }

  protected async post(
    endpoint: string,
    body: any,
    headers: Record<string, string> = {}
  ) {
    return this.makeRequest(endpoint, "POST", body, headers);
  }

  protected async put(
    endpoint: string,
    body: any,
    headers: Record<string, string> = {}
  ) {
    return this.makeRequest(endpoint, "PUT", body, headers);
  }

  protected async patch(
    endpoint: string,
    body: any,
    headers: Record<string, string> = {}
  ) {
    return this.makeRequest(endpoint, "PATCH", body, headers);
  }

  protected async delete(
    endpoint: string,
    headers: Record<string, string> = {}
  ) {
    return this.makeRequest(endpoint, "DELETE", undefined, headers);
  }

  private async makeRequest(
    endpoint: string,
    method: string,
    body?: any,
    headers: Record<string, string> = {}
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const requestConfig = {
        endpoint,
        method,
        body,
        headers,
        resolve,
        reject,
      };

      // If we're already refreshing, queue this request
      if (this.isRefreshing) {
        this.requestQueue.push(requestConfig);
        return;
      }

      try {
        const result = await this.executeRequest(
          endpoint,
          method,
          body,
          headers
        );
        resolve(result);
      } catch (error: any) {
        // If it's a 401 error, try to refresh token
        // if (error.status === 401) {
        //   this.requestQueue.push(requestConfig);
        //   await this.handleTokenRefresh();
        // } else {
        reject(error);
        // }
      }
    });
  }

  private async executeRequest(
    endpoint: string,
    method: string,
    body?: any,
    headers: Record<string, string> = {}
  ): Promise<any> {
    const authHeader = await this.getAuthHeader();

    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

    const requestHeaders: Record<string, string> = {
      ...authHeader,
      ...headers,
    };

    // Only set JSON content-type when not sending FormData
    if (!isFormData) {
      requestHeaders["Content-Type"] = "application/json";
    }

    const requestBody = isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined;

    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: requestHeaders,
      body: requestBody,
    });

    return this.handleResponse(res);
  }

  private async handleTokenRefresh(): Promise<void> {
    console.log("is refreshing: ", this.isRefreshing);

    if (this.isRefreshing) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performTokenRefresh();

    try {
      await this.refreshPromise;
      // Retry all queued requests
      await this.retryQueuedRequests();
    } catch (error) {
      // Refresh failed, reject all queued requests and logout
      this.rejectQueuedRequests(error);
      await this.handleRefreshFailure();
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
      this.requestQueue = [];
    }
  }

  private async performTokenRefresh(): Promise<any> {
    const authHeader = await this.getAuthHeader();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader,
        },
        credentials: "include", // Include cookies (refreshToken)
        mode: "cors", // Explicitly set CORS mode
      }
    );

    if (!response.ok) {
      throw new HttpError(
        "Token refresh failed",
        response.status,
        response.url,
        null
      );
    }

    const data = await response.json();
    if (data.access_token) {
      Cookies.set("access_token", data.access_token);
    }
    return data;
  }

  private async retryQueuedRequests(): Promise<void> {
    const requests = [...this.requestQueue];
    this.requestQueue = [];

    for (const request of requests) {
      try {
        const result = await this.executeRequest(
          request.endpoint,
          request.method,
          request.body,
          request.headers
        );
        request.resolve(result);
      } catch (error) {
        request.reject(error);
      }
    }
  }

  private rejectQueuedRequests(error: any): void {
    this.requestQueue.forEach((request) => {
      request.reject(error);
    });
  }

  private async handleRefreshFailure(): Promise<void> {
    // Clear cookies
    Cookies.remove("access_token");

    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/auth";
    }
  }

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

  private async getAuthHeader(): Promise<Record<string, string>> {
    if (typeof window !== "undefined") {
      const clientToken = Cookies.get("access_token");
      return { Authorization: `Bearer ${clientToken}` };
    }
    const serverToken = await getServerAccessToken();
    return { Authorization: `Bearer ${serverToken}` };
  }
}
