#!/usr/bin/env node

// cli bin dependencies
import yargs from 'yargs';
import shell from 'shelljs';
import { exit } from 'process';
import z, { ZodError } from 'zod';
import { hideBin } from 'yargs/helpers';
import { existsSync, readFileSync } from 'fs';
import { CliArgsType, TriggerOriginalBaseConfigType } from './types';
// cli logic dependencies
import { TriggerParsedType } from './types';
import { authenticate } from './functions/authenticate';
import { createTrigger } from './functions/action-create-trigger';
import { deleteTrigger } from './functions/action-delete-trigger';
import { updateTrigger } from './functions/action-update-trigger';
import { findAllTriggers } from './functions/find-all-triggers';
import { findTriggersToCreate } from './functions/find-triggers-to-insert';
import { findTriggersToDelete } from './functions/find-triggers-to-delete';
import { findTriggersToUpdate } from './functions/find-triggers-to-update';

// get all provided arguments
const args = yargs(hideBin(process.argv)).argv as unknown as CliArgsType;
const errors: Array<string> = [];

// <!-- validte required arguments -->
if (!args.aws_region) {
  errors.push('--aws_region argument required');
}
if (!args.aws_account_id) {
  errors.push('--aws_account_id argument required');
}
if (!args.mongodb_group_id) {
  errors.push('--mongodb_group_id argument required');
}
if (!args.mongodb_app_id) {
  errors.push('--mongodb_app_id argument required');
}
if (!args.mongodb_api_key) {
  errors.push('--mongodb_api_key argument required');
}
if (!args.mongodb_api_secret) {
  errors.push('--mongodb_api_secret argument required');
}
if (!args.mongodb_cluster_name) {
  errors.push('--mongodb_cluster_name argument required');
}
if (!args.mongodb_service_id) {
  errors.push('--mongodb_service_id argument required');
}
if (!args.mongodb_database) {
  errors.push('--mongodb_database argument required');
}
if (!args.schema) {
  errors.push('--schema argument required');
}

// <!-- exit error if exists some validation error -->
if (errors.length > 0) {
  console.error(errors);
  exit(1);
}

// import currentTriggers from "./schema.json";

(async () => {
  try {
    // check if provided schema exists
    if (!existsSync(String(args.schema))) {
      throw new Error('Schema file does not exists');
    }

    // load migration schema file
    const data = readFileSync(String(args.schema), { encoding: 'binary' });
    const currentTriggers = JSON.parse(data) as TriggerParsedType[];

    // create validation schema for mapped triggers object
    const validateSchema = z.array(
      z.object({
        name: z.string({ required_error: 'trigger name is required' }),
        operation_types: z.array(z.string({ required_error: 'operation_types item is required' }), {
          required_error: 'operation_types is required',
        }),
        collection: z.string({ required_error: 'collection is required' }),
        match: z.object(
          {},
          {
            required_error: 'match pattern is required, event if an empty object',
          },
        ),
      }),
    );

    // validate loaded triggers
    validateSchema.parse(currentTriggers);

    // mount trigger config
    const triggerBaseConfig: TriggerOriginalBaseConfigType = {
      type: 'DATABASE',
      config: {
        database: String(args.mongodb_database),
        clusterName: String(args.mongodb_cluster_name),
        service_id: String(args.mongodb_service_id),
      },
      event_processors: {
        AWS_EVENTBRIDGE: {
          config: {
            account_id: String(args.aws_account_id),
            region: String(args.aws_region),
          },
        },
      },
    };

    // login to atlas realm
    console.log('Authenticating to atlas mongodb');
    const token = await authenticate(String(args.mongodb_api_key), String(args.mongodb_api_secret));

    // get all created triggers on atlas realm
    console.log('Fetching current triggers');
    const onlineTriggers = await findAllTriggers(token, String(args.mongodb_group_id), String(args.mongodb_app_id));

    // find all triggers that must to be created
    console.log('Finding triggers to create');
    const triggersToCreate = findTriggersToCreate(onlineTriggers, currentTriggers);

    // find all triggers that must to be deleted
    console.log('Finding triggers to delete');
    const triggersToDelete = findTriggersToDelete(onlineTriggers, currentTriggers);

    // find all triggers that muts to be updated
    console.log('Finding triggers to update');
    const triggersToUpdate = findTriggersToUpdate(onlineTriggers, currentTriggers);

    // create triggers
    console.log(`Creating ${triggersToCreate.length} triggers`);
    for (const trigger of triggersToCreate) {
      await createTrigger(
        token,
        String(args.mongodb_group_id),
        String(args.mongodb_app_id),
        trigger,
        triggerBaseConfig,
      );
    }

    // delete triggers
    console.log(`Deleting ${triggersToDelete.length} triggers`);
    for (const trigger of triggersToDelete) {
      await deleteTrigger(token, String(args.mongodb_group_id), String(args.mongodb_app_id), trigger);
    }

    // update triggers
    console.log(`Updating ${triggersToUpdate.length} triggers`);
    for (const trigger of triggersToUpdate) {
      await updateTrigger(
        token,
        String(args.mongodb_group_id),
        String(args.mongodb_app_id),
        trigger,
        triggerBaseConfig,
      );
    }

    // retrive all migrated triggers
    console.log('Fetching updated triggers...');
    const allTriggers = await findAllTriggers(token, String(args.mongodb_group_id), String(args.mongodb_app_id));

    // create .env file if it does not exists yet
    // iterate each trigger to export it
    for (const trigger of allTriggers) {
      const VAR = `${trigger.name}=aws.partner/mongodb.com/stitch.trigger/${trigger._id}`;
      // write triggers to .ENV file
      console.log(`Adding trigger ${trigger.name} to .env file`);
      shell.exec(`echo "${VAR}" >> .env`);
      // export triggers to .ENV file
      console.log(`Export trigger ${trigger.name} env variables`);
      shell.exec(`export ${VAR}`);
    }
  } catch (error: any) {
    if (error instanceof ZodError) {
      console.error('<!-- your trigger migrations contain errors: -->');
      console.error(
        JSON.parse(error.message).reduce((errors: string[], error: any) => {
          errors.push(`${error.path.join('.')} => ${error.message}`);
          return errors;
        }, []),
      );
    } else {
      console.error(error.message);
    }
    exit(1);
  }
})();
