import { string } from "yargs";
import { TriggerOriginalType } from "../types";
import { api } from "./api";

export const findAllTriggers = async (
  token: string,
  groupId: string,
  appId: string
) => {
  try {
    const response = await api.get(
      `/groups/${groupId}/apps/${appId}/triggers`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data as TriggerOriginalType[];
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
