import { api } from './api';

export const authenticate = async (apiKey: string, apiSecret: string) => {
  const response = await api.post('/auth/providers/mongodb-cloud/login', {
    username: apiKey,
    apiKey: apiSecret,
  });

  console.log('Response Auth ', response);

  return response.data.access_token;
};
