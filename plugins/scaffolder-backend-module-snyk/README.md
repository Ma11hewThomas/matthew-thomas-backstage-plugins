# plugin-scaffolder-backend-module-snyk

Welcome to the `plugin-scaffolder-backend-module-snyk` custom action!

This contains one action: `snyk:import-projects`

The `snyk:import-projects` action allows the task to automatically import repositories into Snyk so that they are monitored for vulnerabilities. It uses the [Snyk API](https://snyk.docs.apiary.io/#) and requires paid plan. 

Setup to work with GitHub, GH Enterprise, Bitbucket Cloud and Azure Repos.

## Getting started

Create your Backstage application using the Backstage CLI as described here:
https://backstage.io/docs/getting-started/create-an-app

> Note: If you are using this plugin in a Backstage monorepo that contains the code for `@backstage/plugin-scaffolder-backend`, you need to modify your internal build processes to transpile files from the `node_modules` folder as well.

You need to configure the action in your backend:

## From your Backstage root directory

```
cd packages/backend
yarn add @ma11hewthomas/plugin-scaffolder-backend-module-snyk
```

Configure the action:
(you can check the [docs](https://backstage.io/docs/features/software-templates/writing-custom-actions#registering-custom-actions) to see all options):

```typescript
// packages/backend/src/plugins/scaffolder.ts

import { snykImportProjectAction } from '@ma11hewthomas/plugin-scaffolder-backend-module-snyk';
import { ScmIntegrations } from '@backstage/integration';

const integrations = ScmIntegrations.fromConfig(config);

const builtInActions = createBuiltinActions({
containerRunner,
integrations,
config,
catalogClient,
reader,
});

const actions = [...builtInActions, snykImportProjectAction()];

return await createRouter({
  containerRunner,
  logger,
  config,
  database,
  catalogClient,
  reader,
  actions,
});
```

### Authorization
In order to use `plugin-scaffolder-backend-module-snyk`, you must provide an API token which it can use to access the Snyk API.
Get your [Snyk API token](https://docs.snyk.io/features/integrations/managing-integrations/service-accounts) (Admin permission is required to import projects) and provide SNYK_TOKEN env var with the value "token <YOURTOKEN>"
```
export SNYK_TOKEN="token 123-123-123-123"
```

### Example of using

```yaml
---
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: debug
  title: debug
  description: Template for debugging
  tags:
    - debug
spec:
  owner: MatthewThomas
  type: debug
  steps:
    - id: template
      name: Snyk import projects
      action: snyk:import-projects
      input:
        repoOwner: Ma11thewThomas
        repoName: matthew-thomas-backstage-plugins
        repoBranchName: main
        snykOrganizationId: your-org-id
        snykIntegrationId: your-integration-id
```
This action is typically used after the publish action, but can be used on its own.

You can visit the `/create/actions` route in your Backstage application to find out more about the parameters this action accepts when it's installed to configure how you like.
