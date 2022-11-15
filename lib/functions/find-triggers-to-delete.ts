import { TriggerOriginalType, TriggerParsedType } from "../types";
import { parseTriggers } from "./parse-trigger";

export const findTriggersToDelete = (
  onlineTriggers: TriggerOriginalType[],
  deployTriggers: TriggerParsedType[]
) => {
  const triggersToDelete = onlineTriggers.reduce(
    (list: TriggerOriginalType[], current: TriggerOriginalType) => {
      if (!deployTriggers.some((trigger) => trigger.name === current.name))
        list.push(current);
      return list;
    },
    []
  );

  return parseTriggers(triggersToDelete);
};
