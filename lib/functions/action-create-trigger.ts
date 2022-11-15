import { api } from "./api";
import { TriggerOriginalBaseConfigType, TriggerParsedType } from "../types";
import { buildOriginalTrigger } from "./build-original-trigger";

export const createTrigger = async (
  token: string,
  groupId: string,
  appId: string,
  trigger: TriggerParsedType,
  triggerBaseConfig: TriggerOriginalBaseConfigType
) => {
  try {
    const response = await api.post(
      `/groups/${groupId}/apps/${appId}/triggers`,
      buildOriginalTrigger(trigger, triggerBaseConfig),
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {}
};
