import { EJSON } from 'bson';
import merge from 'deepmerge';

export const encodeProjection = (project?: Object | undefined) => {
  if (!project) return {};
  if (Object.keys(project).length === 0) return {};
  return merge(project, { operationType: 1 });
  // const encoded = EJSON.stringify(document, { relaxed: false });
  // console.log(JSON.parse(encoded));
  // return JSON.parse(encoded);
};

export const decodeProjection = (project?: Object | undefined) => {
  return EJSON.parse(JSON.stringify(project || {}));
};
