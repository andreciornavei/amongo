import { api } from './api';

export const findAllServices = async (token: string, groupId: string, appId: string) => {
  try {
    const response = await api.get(`/groups/${groupId}/apps/${appId}/services`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
