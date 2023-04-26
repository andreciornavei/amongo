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
        "collection": "users"
    },{
        "name": "EVENT_ON_INSERT_ORDER",
        "collection": "orders",
        "operation_types": ["INSERT"],
        "match": { "fullDocument.status": "PENDING" },
        "project": { "fullDocument": 1 },
        "disabled": false,
        "unordered": true,
        "full_document": true,
        "full_document_before_change": false,
        "skip_catchup_events": false,
        "tolerate_resume_errors": false
    }
]
```

## # amongo command cli

### # collecting environment variables

* __`AWS_REGION`__ = The aws region where you want to register yours event bridges.
* __`AWS_ACCOUNT_ID`__ = Your AWS Account ID.
* __`MONGODB_GROUP_ID`__ = Can be founded on URL of your mongodb dashboard After select an organization project.
* __`MONGODB_APP_ID`__ = Can be founded on URL of your mongodb dashboard when you access your application on __`AppServices`__
* __`MONGODB_API_KEY`__ = Can be created on your organizanization section at `Access Manager` section (The permission must to be __`Organization Owner`__, __pay attention at this part if you get error 403 after authentication!!!__)
* __`MONGODB_API_SECRET`__ = Auto generated when you create your API KEY on your organizanization section at `Access Manager` section.
* __`MONGODB_CLUSTER_NAME`__ = The cluster name where your database was created.
* __`MONGODB_DATABASE`__ = The name of yor database.


### # calling amongo coomand

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
--mongodb_database=${MONGODB_DATABASE}
--schema=migration_schema.json
```
After run `amongo command cli` all database trigger events will be available with `Pending` status on `https://<your-region>.console.aws.amazon.com/events/home?region=<your-region>#/partners` and ready to be associated to an event-bus ARN.

![image](./doc/assets/aws-partner-event-source.png)

> _PS:_ for development, you can run the `run.sh` shell file at this project to test in dev mode ASAP. * Dont forget to setting up your credentials on environment variables. 

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
          pattern:
            source:
              - prefix: aws.partner/mongodb.com

resources:
  Resources:
    MongoDbOnInserOrderEventBus:
      Type: "AWS::Events::EventBus"
      Properties:
        EventSourceName: ${self:provider.environment.EVENT_ON_INSERT_ORDER}
        Name: ${self:provider.environment.EVENT_ON_INSERT_ORDER}
```