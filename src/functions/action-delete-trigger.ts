import { api } from './api';
import { TriggerParsedType } from '../types';

export const deleteTrigger = async (token: string, groupId: string, appId: string, trigger: TriggerParsedType) => {
  try {
    await api.delete(`/groups/${groupId}/apps/${appId}/triggers/${trigger._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {}
};
