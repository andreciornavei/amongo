import deepPick from 'deepPick';
import { TriggerParsedType, TriggerOriginalType } from '../types';
import { signTrigger } from './hash-trigger';
import { parseTriggers } from './parse-trigger';

export const findTriggersToUpdate = (onlineTriggers: TriggerOriginalType[], deployTriggers: TriggerParsedType[]) => {
  const compareFields = [
    'name',
    'operation_types',
    'match',
    'project',
    'collection',
    'unordered',
    'full_document',
    'full_document_before_change',
    'skip_catchup_events',
    'tolerate_resume_errors',
  ];
  const parsedTriggers = parseTriggers(onlineTriggers);
  const triggersToUpdated = parsedTriggers.reduce((list: TriggerParsedType[], current: TriggerParsedType) => {
    const trigger = deployTriggers.find((trigger) => {
      return (
        trigger.name === current.name &&
        signTrigger(deepPick(trigger, compareFields)) !== signTrigger(deepPick(current, compareFields))
      );
    });
    if (trigger) {
      trigger._id = current._id;
      list.push(trigger);
    }
    return list;
  }, []);
  return triggersToUpdated;
};
