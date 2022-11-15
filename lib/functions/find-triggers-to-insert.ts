import { TriggerOriginalType, TriggerParsedType } from "../types";

export const findTriggersToCreate = (
  onlineTriggers: TriggerOriginalType[],
  deployTriggers: TriggerParsedType[]
): TriggerParsedType[] => {
  const triggersToCreate = deployTriggers.reduce(
    (list: TriggerParsedType[], current: TriggerParsedType) => {
      if (!onlineTriggers.some((trigger) => trigger.name === current.name))
        list.push(current);
      return list;
    },
    []
  );
  return triggersToCreate;
};
