import { api } from './api';
import { TriggerOriginalBaseConfigType, TriggerParsedType } from '../types';
import { buildOriginalTrigger } from './build-original-trigger';

export const createTrigger = async (
  token: string,
  groupId: string,
  appId: string,
  trigger: TriggerParsedType,
  triggerBase: TriggerOriginalBaseConfigType,
) => {
  try {
    const response = await api.post(
      `/groups/${groupId}/apps/${appId}/triggers`,
      buildOriginalTrigger(trigger, triggerBase),
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  } catch (error: any) {
    console.log('error on create trigger', trigger.name, '::', error?.response?.data || error?.message);
  }
};
