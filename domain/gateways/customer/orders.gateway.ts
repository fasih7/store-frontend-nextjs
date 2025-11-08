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

  async getOrdersWithPagination(
    page: number,
    limit: number,
    options?: {
      searchQuery?: string;
      status?: string;
      sortBy?: string;
      sortOrder?: number;
    }
  ) {
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("limit", limit.toString());

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

    const response = await this.get(queryOptions);
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
