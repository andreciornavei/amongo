// import { EJSON } from 'bson';
import merge from 'deepmerge';
import { encodeProjection } from './codec-projection';
import {
  TriggerOriginalBaseConfigType,
  TriggerOriginalFullType,
  TriggerOriginalType,
  TriggerParsedType,
} from '../types';

export const buildOriginalTrigger = (
  trigger: TriggerParsedType,
  triggerBase: TriggerOriginalBaseConfigType,
): TriggerOriginalFullType => {
  const constVariables: TriggerOriginalType = {
    name: trigger.name,
    disabled: trigger.disabled !== undefined ? trigger.disabled : false,
    config: {
      collection: trigger.collection,
      match: trigger.match || {},
      project: encodeProjection(trigger.project),
      operation_types: trigger.operation_types,
      unordered: trigger.unordered !== undefined ? trigger.unordered : true,
      full_document: trigger.full_document !== undefined ? trigger.full_document : true,
      full_document_before_change:
        trigger.full_document_before_change !== undefined ? trigger.full_document_before_change : false,
      tolerate_resume_errors: trigger.tolerate_resume_errors !== undefined ? trigger.tolerate_resume_errors : false,
      skip_catchup_events: trigger.skip_catchup_events !== undefined ? trigger.skip_catchup_events : false,
    },
  };
  return merge(constVariables, triggerBase);
};
