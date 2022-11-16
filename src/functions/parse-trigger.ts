import deepPick from 'deepPick';
import { TriggerParsedType, TriggerOriginalType } from '../types';

export const parseTriggers = (originalTriggers: TriggerOriginalType[]): TriggerParsedType[] => {
  return deepPick(originalTriggers, ['_id', 'name', 'config.match', 'config.collection', 'config.operation_types']).map(
    (originalTrigger: TriggerOriginalType): TriggerParsedType => ({
      _id: originalTrigger._id,
      name: originalTrigger.name,
      match: originalTrigger.config.match,
      collection: originalTrigger.config.collection,
      operation_types: originalTrigger.config.operation_types,
    }),
  );
};
