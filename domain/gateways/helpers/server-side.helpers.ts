"use server";

import { cookies } from "next/headers";

export const getServerAccessToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
};
