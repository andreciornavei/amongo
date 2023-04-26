export type CliArgsType = {
  aws_account_id: string;
  aws_region: string;
  mongodb_group_id: string;
  mongodb_app_id: string;
  mongodb_api_key: string;
  mongodb_api_secret: string;
  mongodb_cluster_name: string;
  mongodb_database: string;
  schema: string;
};

export type TriggerOriginalBaseConfigType = {
  type: string;
  config: {
    database: string;
    clusterName: string;
    service_id: string;
  };
  event_processors: {
    AWS_EVENTBRIDGE: {
      config: { account_id: string; region: string };
    };
  };
};

export type TriggerOriginalType = {
  _id?: string;
  name: string;
  disabled?: boolean;
  config: {
    collection: string;
    operation_types: Array<'INSERT' | 'UPDATE' | 'DELETE'>;
    match: Object;
    project: Object;
    unordered: boolean;
    full_document: boolean;
    full_document_before_change: boolean;
    skip_catchup_events: boolean;
    tolerate_resume_errors: boolean;
  };
};

export type TriggerOriginalFullType = Omit<
  TriggerOriginalBaseConfigType & TriggerOriginalType & { config: { full_document: boolean } },
  '_id'
>;

export type TriggerParsedType = {
  _id?: string;
  name: string;
  disabled?: boolean;
  collection: string;
  operation_types: Array<'INSERT' | 'UPDATE' | 'DELETE'>;
  match?: Object;
  project?: Object;
  unordered?: boolean;
  full_document?: boolean;
  full_document_before_change?: boolean;
  skip_catchup_events?: boolean;
  tolerate_resume_errors?: boolean;
};
