# amongo

##### ___- trigger migrations among aws and mongodb___

This cli package was created to help CI/CD pipelines, keeping in sync mongodb trigger declarations with mongodb platform and reflecting it on aws event-bridge partners section.

---

## # mongodb trigger declarations

This cli abstract most of mongodb trigger configurations, requiring only what you realy need to know about your trigger, also it applies aws event-bridge connection by default to make the integration easier.

You can find all you need to know about mongodb database-triggers on official documentation:

[database triggers doc](https://www.mongodb.com/docs/atlas/app-services/triggers/database-triggers/)

#### ___`migration_schema.json`___
```json
[
    {
        "name": "EVENT_ON_INSERT_USER",
        "operation_types": ["INSERT"],
        "collection": "users",
        "match": {}
    },{
        "name": "EVENT_ON_INSERT_ORDER",
        "operation_types": ["INSERT"],
        "collection": "orders",
        "match": {}
    }
]
```

## # amongo command cli
#### ___`cicd_script.sh`___
```sh
amongo 
--aws_region=${AWS_DEFAULT_REGION}
--aws_account_id=${AWS_ACCOUNT_ID}
--mongodb_group_id=${MONGODB_GROUP_ID}
--mongodb_app_id=${MONGODB_APP_ID}
--mongodb_api_key=${MONGODB_API_KEY}
--mongodb_api_secret=${MONGODB_API_SECRET}
--mongodb_cluster_name=${MONGODB_CLUSTER_NAME}
--mongodb_service_id=${MONGODB_SERVICE_ID}
--mongodb_database=${MONGODB_DATABASE}
--schema=migration_schema.json
```
After run `amongo command cli` all database trigger events will be available with `Pending` status on `https://<your-region>.console.aws.amazon.com/events/home?region=<your-region>#/partners` and ready to be validated with an event-bus ARN.

![image](https://www.mongodb.com/docs/atlas/app-services/images/eventbridge-partner-event-sources-table.png)

## # serverless

After `amongo` command runs, it exports the trigger names as environment variables with it respective values (`aws partner event source name`) and store it on the `.env` files, where it can be used to continue the CI/CD pipeline being imported by serverless.yml and used to trigger lambda functions.

#### ___`serverless.yml`___
```yml
service: amongo-example
useDotenv: true

plugins:
  - serverless-dotenv-plugin
  
provider:
  name: aws
  stage: ${opt:stage, 'develop'}
  environment:
    EVENT_ON_INSERT_ORDER: ${env:EVENT_ON_INSERT_ORDER}

functions:
  send-order-email:
    name: send-order-email-${self:provider.stage}
    handler: functions/send-order-email.handle
    description: "Send order e-mail when it is created on database"
    memorySize: 512
    runtime: nodejs16.x
    timeout: 300
    events:
      - eventBridge:
          enabled: true
          eventBus: !GetAtt MongoDbOnInserOrderEventBus.Name

resources:
  Resources:
    MongoDbOnInserOrderEventBus:
      Type: "AWS::Events::EventBus"
      Properties:
        EventSourceName: ${self:provider.environment.EVENT_ON_INSERT_ORDER}
        Name: ${self:provider.environment.EVENT_ON_INSERT_ORDER}
```