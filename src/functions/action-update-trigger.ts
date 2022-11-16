import { api } from './api';
import { TriggerOriginalBaseConfigType, TriggerParsedType } from '../types';
import { buildOriginalTrigger } from './build-original-trigger';

export const updateTrigger = async (
  token: string,
  groupId: string,
  appId: string,
  trigger: TriggerParsedType,
  triggerBaseType: TriggerOriginalBaseConfigType,
) => {
  try {
    await api.put(
      `/groups/${groupId}/apps/${appId}/triggers/${trigger._id}`,
      buildOriginalTrigger(trigger, triggerBaseType),
      { headers: { Authorization: `Bearer ${token}` } },
    );
  } catch (error) {}
};
