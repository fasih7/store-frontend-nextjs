import { OrderDetails } from "@/lib/types";
import { HttpClient } from "./http-client";

export class OrdersGateway extends HttpClient {
  constructor() {
    super(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/orders`);
  }

  async submitOrder(params: OrderDetails) {
    const response = await this.post("", params);
    return response.id;
  }

  async getOrderById(id: string) {
    const response = await this.get(`/${id}`);
    return response;
  }

  async getAllOrders() {
    const response = await this.get("");
    return response;
  }

  async verifyEmailForOrder(email: string, firstName: string) {
    const response = await this.post("/verification-email-for-order", {
      email,
      firstName,
    });
    return response;
  }
}

export const ordersGateway = new OrdersGateway();
