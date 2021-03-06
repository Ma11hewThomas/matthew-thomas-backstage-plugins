# plugin-scaffolder-backend-module-projen

Welcome to the `plugin-scaffolder-backend-module-projen` custom action!

This contains one action: `projen:new`

The `projen:new` action allows the task to create a new projen project. 

## Getting started

Create your Backstage application using the Backstage CLI as described here:
https://backstage.io/docs/getting-started/create-an-app

> Note: If you are using this plugin in a Backstage monorepo that contains the code for `@backstage/plugin-scaffolder-backend`, you need to modify your internal build processes to transpile files from the `node_modules` folder as well.

You need to configure the action in your backend:

## From your Backstage root directory

```
cd packages/backend
yarn add @ma11hewthomas/plugin-scaffolder-backend-module-projen
```

Configure the action:
(you can check the [docs](https://backstage.io/docs/features/software-templates/writing-custom-actions#registering-custom-actions) to see all options):

```typescript
// packages/backend/src/plugins/scaffolder.ts
---
import { ScmIntegrations } from '@backstage/integration';
import { projenNewAction } from '@ma11hewthomas/plugin-scaffolder-backend-module-projen';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });
  const integrations = ScmIntegrations.fromConfig(env.config);

  const builtInActions = createBuiltinActions({
    integrations, 
    catalogClient,
    config: env.config,
    reader: env.reader,
  });

  const actions = [...builtInActions, projenNewAction()];

  return await createRouter({
    actions,
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
    catalogClient,
  });
}
```

## Example of using

```yaml
---
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: projen-template
  title: projen-template
  description: Template for projen
  tags:
    - debug
spec:
  owner: MatthewThomas
  type: debug
  steps:
    - id: projen
      name: Projen new
      action: projen:new
      input:
        template: '@ma11hewthomas/aws-ecs-fargate-service-projen-template'
        external: true
        post: true
        targetPath: ./${{ parameters.component_id }}
```
This action is typically used before the publish action, but can be used on its own.

## Available parameters

The following optonal parameters are available to use:
### external
Projen provide built in templates for many projects. If you are using a custom template, set this to true to use the external projen command --from. Default is false.

### post
Run post-synthesis steps such as installing dependencies. Default is true.

### targetPath
Target path within the working directory to generate contents to. Defaults to the working directory root. Projen uses the the targetPath when scaffolding to generate the project name.

### args
Additional arguments to pass to the command, see projen documentation for more information 

### More information
You can visit the `/create/actions` route in your Backstage application to find out more about the parameters this action accepts when it's installed to configure how you like.
