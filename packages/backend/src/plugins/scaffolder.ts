import { CatalogClient } from '@backstage/catalog-client';
import { createRouter } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';
import { createBuiltinActions } from '@backstage/plugin-scaffolder-backend';
import { ScmIntegrations } from '@backstage/integration';
import { snykImportProjectAction } from '@ma11hewthomas/plugin-scaffolder-backend-module-snyk';
import { projenNewAction } from '@ma11hewthomas/plugin-scaffolder-backend-module-projen';
import { sonarQubeCreateProjectAction } from '@ma11hewthomas/plugin-scaffolder-backend-module-sonarqube';
import { grafanaCreateDashboardAction } from '../../../../plugins/scaffolder-backend-module-grafana/src/actions';

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
    projenNewAction(),
    snykImportProjectAction(),
    sonarQubeCreateProjectAction({
      config: env.config,
    }),
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
