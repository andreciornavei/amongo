import deepPick from 'deepPick';
import { TriggerParsedType, TriggerOriginalType } from '../types';

export const parseTriggers = (originalTriggers: TriggerOriginalType[]): TriggerParsedType[] => {
  return deepPick(originalTriggers, [
    '_id',
    'name',
    'config.match',
    'config.collection',
    'config.operation_types',
    'config.project',
    'config.unordered',
    'config.full_document',
    'config.full_document_before_change',
    'config.skip_catchup_events',
    'config.tolerate_resume_errors',
  ]).map(
    (originalTrigger: TriggerOriginalType): TriggerParsedType => ({
      _id: originalTrigger._id,
      name: originalTrigger.name,
      match: originalTrigger.config.match,
      project: originalTrigger.config.project,
      unordered: originalTrigger.config.unordered,
      collection: originalTrigger.config.collection,
      full_document: originalTrigger.config.full_document,
      operation_types: originalTrigger.config.operation_types,
      skip_catchup_events: originalTrigger.config.skip_catchup_events,
      tolerate_resume_errors: originalTrigger.config.tolerate_resume_errors,
      full_document_before_change: originalTrigger.config.full_document_before_change,
    }),
  );
};
