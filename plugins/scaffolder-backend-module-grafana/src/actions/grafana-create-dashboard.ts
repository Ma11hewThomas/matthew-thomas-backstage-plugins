/*
 * Copyright 2022 Matthew Thomas
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Config } from '@backstage/config';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { InputError } from '@backstage/errors';
import fetch from 'cross-fetch';
import { readFileSync } from 'fs';

export const grafanaCreateDashboardAction = (options: { config: Config }) => {
  const { config } = options;

  return createTemplateAction<{
    dashboardModelPath: string;
    folderId?: number;
    folderUid?: string;
    overwrite?: boolean;
    message?: string;
    serverUrl?: string;
  }>({
    id: 'grafana:dashboard:create',
    description: 'Create a dashboard in Grafana',
    schema: {
      input: {
        required: ['dashboardModelPath'],
        type: 'object',
        properties: {
          dashboardModelPath: {
            type: 'string',
            title: `The path to the complete dashboard model JSON, id = null to create a new dashboard. For more information about the dashboard model, see https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/view-dashboard-json-model`,
          },
          folderId: {
            type: 'number',
            title: 'The id of the folder to save the dashboard in.',
          },
          folderUid: {
            type: 'string',
            title:
              'The UID of the folder to save the dashboard in. Overrides the folderId.',
          },
          overwrite: {
            type: 'boolean',
            title:
              'Set to true if you want to overwrite existing dashboard with newer version, same dashboard title in folder or same dashboard uid.',
          },
          message: {
            type: 'string',
            title: 'Set a commit message for the version history.',
          },
          serverUrl: {
            type: 'string',
            title:
              'Grafana server URL. If not provided, will use the value from the config file.',
          },
        },
      },
    },

    async handler(ctx) {
      const { dashboardModelPath, serverUrl } = ctx.input;
      let { folderId, folderUid, overwrite, message } = ctx.input;

      const apiKey = config.getOptionalString('scaffolder.grafana.key');
      const server =
        serverUrl || config.getOptionalString('scaffolder.grafana.server');

      if (!apiKey) {
        throw new InputError(
          `No valid Grafana API key provided. Please add to the config file.`,
        );
      }

      if (!server) {
        throw new InputError(
          `No valid Grafana server provided. Please add to the config file.`,
        );
      }

      folderId = folderId ? folderId : 0;
      folderUid = folderUid ? folderUid : '';
      overwrite = overwrite ? overwrite : false;
      message = message
        ? message
        : 'Changes made by plugin-scaffolder-backend-module-grafana';

      const url = `${server}/api/dashboards/db`;

      const readStream = readFileSync(dashboardModelPath, 'utf8');

      const dashboardModel = {
        dashboard: JSON.parse(readStream),
        folderId: folderId,
        folderUid: folderUid,
        overwrite: overwrite,
        message: message,
      };

      // ctx.logger.info(`url: ${url}`);
      ctx.logger.info(`dashboardModel: ${JSON.stringify(dashboardModel)}`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dashboardModel),
      });

      const result = await response.json();

      if (response.status === 412) {
        throw new Error(
          `Failed to create dashboard, ${response.status} ${response.statusText}. ${result.status}: ${result.message}`,
        );
      }

      if (!response.ok) {
        throw new Error(
          `Failed to create dashboard, ${response.status} ${response.statusText}`,
        );
      }

      ctx.output('dashboardUrl', `${server}/${result.url}`);
    },
  });
};
