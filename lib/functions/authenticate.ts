import { api } from "./api";

export const authenticate = async (apiKey: string, apiSecret: string) => {
  const response = await api.post("/auth/providers/mongodb-cloud/login", {
    username: apiKey,
    apiKey: apiSecret,
  });
  return response.data.access_token;
};
