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

import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { InputError } from '@backstage/errors';
import { Config } from '@backstage/config';
import fetch from 'cross-fetch';

export function sonarQubeCreateProjectAction(options: { config: Config }) {
  const { config } = options;

  return createTemplateAction<{
    name: string;
    organization: string;
    projectKey: string;
    visibility?: boolean;
    server?: string;
    authToken?: string;
  }>({
    id: 'sonarqube:project:create',
    schema: {
      input: {
        required: ['name', 'organization', 'projectKey'],
        type: 'object',
        properties: {
          name: {
            title: 'Name of the project.',
            type: 'string',
          },
          organization: {
            title: 'The key of the organization',
            type: 'string',
          },
          projectKey: {
            title: 'Key of the project',
            type: 'string',
          },
          visibility: {
            title: `Whether the created project should be visible to everyone, or only specific user/groups.
            If no visibility is specified, the default project visibility of the organization will be used.`,
            type: 'string',
          },
          server: {
            title: 'SonarQube server URL. Defaults to https://sonarcloud.io',
            type: 'string',
          },
          authToken: {
            title:
              'Bearer authentication token. Requires Create Projects permission',
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      const { name, organization, projectKey, visibility, server, authToken } =
        ctx.input;

      const sonarServer = server ? server : `https://sonarcloud.io`;

      const token = authToken
        ? authToken
        : config.getOptionalString('scaffolder.sonarqube.token');

      if (!token) {
        throw new InputError(`No valid Sonarqube token given`);
      }

      let url = `${sonarServer}/api/projects/create?name=${name}&organization=${organization}&project=${projectKey}`;

      if (visibility) {
        url = url.concat(`&visibility=${visibility}`);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new InputError(
          `Sonarqube API responded with ${
            response.status
          }: ${await response.text()}`,
        );
      }

      const result = await response.json();

      ctx.logger.info(`Created Sonarqube project ${result.project.key}`);

      ctx.output('key', result.project.key);
    },
  });
}
