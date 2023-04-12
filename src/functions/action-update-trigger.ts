import { api } from './api';
import { TriggerOriginalBaseConfigType, TriggerParsedType } from '../types';
import { buildOriginalTrigger } from './build-original-trigger';

export const updateTrigger = async (
  token: string,
  groupId: string,
  appId: string,
  trigger: TriggerParsedType,
  triggerBase: TriggerOriginalBaseConfigType,
) => {
  try {
    await api.put(
      `/groups/${groupId}/apps/${appId}/triggers/${trigger._id}`,
      buildOriginalTrigger(trigger, triggerBase),
      { headers: { Authorization: `Bearer ${token}`, 'Accept-Encoding': 'gzip,deflate,compress' } },
    );
  } catch (error: any) {
    console.log('error on update trigger', trigger.name, '::', error?.response?.data || error?.message);
  }
};
