# this is a shortcut cmd execution
# to run yarn develop faster

AWS_REGION=your-account-region
AWS_ACCOUNT_ID=your-account-id
MONGODB_GROUP_ID=your-mongodb-group-id
MONGODB_APP_ID=your-mongodb-app-id
MONGODB_API_KEY=your-mongodb-api-key
MONGODB_API_SECRET=your-mongodb-api-secret
MONGODB_CLUSTER_NAME=cluster_name
MONGODB_DATABASE=database_name
SCHEMA=run_schema.json

rm .env & yarn develop \
--aws_region=$AWS_REGION \
--aws_account_id=$AWS_ACCOUNT_ID \
--mongodb_group_id=$MONGODB_GROUP_ID \
--mongodb_app_id=$MONGODB_APP_ID \
--mongodb_api_key=$MONGODB_API_KEY \
--mongodb_api_secret=$MONGODB_API_SECRET \
--mongodb_cluster_name=$MONGODB_CLUSTER_NAME \
--mongodb_database=$MONGODB_DATABASE \
--schema=$SCHEMA