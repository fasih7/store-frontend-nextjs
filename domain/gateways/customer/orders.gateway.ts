import { OrderDetails } from "@/domain/entities";
import { HttpClient } from "../http-client";

export class OrdersGateway extends HttpClient {
  constructor() {
    super(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/orders`);
  }

  async submitOrder(params: OrderDetails) {
    const { saveAddress, addressLabel, userId, ...paramsWithoutAddress } =
      params as any; //Todo: update the type to include userId
    const response = await this.post("", paramsWithoutAddress);
    return response.id;
  }

  async getOrderById(id: string) {
    console.log("id: ", id);
    const response = await this.get(`/${id}`);
    return response;
  }

  async getOrderDetailsForAdmin(id: string) {
    const response = await this.get(`/admin/order/${id}`);
    return response;
  }

  async getCurrentUserOrders() {
    const response = await this.get("/me");
    return response;
  }

  async getAllOrders() {
    const response = await this.get("");
    return response;
  }

  async getOrdersWithPagination(page: number, limit: number) {
    const response = await this.get(`?limit=${limit}&page=${page}`);
    return response;
  }

  async verifyEmailForOrder(email: string, firstName: string) {
    const response = await this.post("/verification-email-for-order", {
      email,
      firstName,
    });
    return response;
  }

  async updateOrderStatus(orderId: string, status: string) {
    const response = await this.patch(`/${orderId}/status`, { status });
    return response;
  }
}

export const ordersGateway = new OrdersGateway();
