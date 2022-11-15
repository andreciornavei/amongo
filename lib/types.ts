export type CliArgsType = {
  aws_account_id: string;
  aws_region: string;
  mongodb_group_id: string;
  mongodb_app_id: string;
  mongodb_api_key: string;
  mongodb_api_secret: string;
  mongodb_cluster_name: string;
  mongodb_database: string;
  mongodb_service_id: string;
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
  config: {
    collection: string;
    operation_types: Array<"INSERT" | "UPDATE" | "DELETE">;
    match: Object;
    full_document: boolean;
  };
};

export type TriggerOriginalFullType = Omit<
  TriggerOriginalBaseConfigType &
    TriggerOriginalType & { config: { full_document: boolean } },
  "_id"
>;

export type TriggerParsedType = {
  _id?: string;
  name: string;
  collection: string;
  operation_types: Array<"INSERT" | "UPDATE" | "DELETE">;
  match: Object;
};
