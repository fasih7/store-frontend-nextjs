import { SavedAddress } from "../../lib/types";
import { HttpClient } from "./http-client";

export class UserGateway extends HttpClient {
  constructor() {
    super(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user`);
  }

  async getCurrentUser() {
    const response = await this.get("/current-user");

    return response;
  }

  async saveAddressForCurrentUser(address: Partial<SavedAddress>) {
    const response = await this.post(`/address`, address);
    return response;
  }

  async getSavedAddressForCurrentUser() {
    const response = await this.get("/address");
    return response;
  }

  async updateAddressForCurrentUser(address: SavedAddress) {
    const response = await this.patch(`/address`, address);
    return response;
  }

  async deleteAddressForCurrentUser(addressId: string) {
    const response = await this.delete(`/address/${addressId}`);
    return response;
  }
}

export const userGateway = new UserGateway();
