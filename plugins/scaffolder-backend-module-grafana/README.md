# scaffolder-backend-module-grafana

Welcome to the `scaffolder-backend-module-grafana` custom action!

This contains one action: `grafana:dashboard:create`

The `grafana:dashboard:create` action creates a new job in Grafana.

## Getting started

```
cd packages/backend
yarn add @ma11hewthomas/plugin-scaffolder-backend-module-grafana
```

Configure the action:
(you can check the [docs](https://backstage.io/docs/features/software-templates/writing-custom-actions#registering-custom-actions) to see all options):

```typescript
// packages/backend/src/plugins/scaffolder.ts
---
import { ScmIntegrations } from '@backstage/integration';
import { grafanaCreateDashboardAction } from '@ma11hewthomas/plugin-scaffolder-backend-module-grafana';

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

  const actions = [
    ...builtInActions,
    grafanaCreateDashboardAction({
      config: env.config,
    }),
  ];

  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    catalogClient: catalogClient,
    reader: env.reader,
    identity: env.identity,
    actions,
    scheduler: env.scheduler,
  });
}
```

### Authorization

In order to use `scaffolder-backend-module-grafana`, you must provide an api key to allow access the grafana API (permission to create dashboards is required)

You must define api key in the `app-config.yaml`:

```yaml
scaffolder:
  grafana:
    key: ${GRAFANA_API_KEY}
    server: ${GRAFANA_SERVER_URL}
```

### Example of using

```yaml
---
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: debug-grafana
  title: debug-grafana
  description: Template for debugging
  tags:
    - debug
spec:
  owner: MatthewThomas
  type: debug
  steps:
    - id: grafana
      name: Grafana create dashboard
      action: grafana:dashboard:create
      input:
        dashboardModelPath: path/to/dashboard-model.json
  output:
    links:
      - title: Grafana Dashboard
        url: ${{ steps.grafana.output.dashboardUrl }}
```

You can visit the `/create/actions` route in your Backstage application to find out more about the parameters this action accepts when it's installed to configure how you like.

This scaffolder requires the path to a Grafana dashboard model json file. A dashboard in Grafana is represented by a JSON object, which stores metadata of its dashboard. Dashboard metadata includes dashboard properties, metadata from panels, template variables, panel queries, etc. For more information on the dashboard model, see the [Grafana documentation](https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/view-dashboard-json-model/).
