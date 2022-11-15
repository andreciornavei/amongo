import merge from "deepmerge";
import {
  TriggerOriginalBaseConfigType,
  TriggerOriginalFullType,
  TriggerOriginalType,
  TriggerParsedType,
} from "../types";

export const buildOriginalTrigger = (
  trigger: TriggerParsedType,
  triggerBase: TriggerOriginalBaseConfigType
): TriggerOriginalFullType => {
  const constVariables: TriggerOriginalType = {
    name: trigger.name,
    config: {
      collection: trigger.collection,
      match: trigger.match,
      operation_types: trigger.operation_types,
      full_document: true,
    },
  };
  return merge(constVariables, triggerBase);
};
