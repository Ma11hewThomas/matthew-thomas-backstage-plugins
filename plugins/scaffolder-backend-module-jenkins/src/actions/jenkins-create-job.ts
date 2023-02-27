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

export const jenkinsCreateJobAction = (options: { config: Config }) => {
  const { config } = options;

  return createTemplateAction<{
    configPath: string;
    jobName: string;
    folderName?: string;
    serverUrl?: string;
  }>({
    id: 'jenkins:job:create',
    description: 'Create a new job in Jenkins',
    schema: {
      input: {
        required: ['configPath', 'jobName'],
        type: 'object',
        properties: {
          configPath: {
            type: 'string',
            title: 'Config Path',
          },
          jobName: {
            type: 'string',
            title: 'Job Name',
          },
          folderName: {
            type: 'string',
            title: 'Folder',
          },
          serverUrl: {
            type: 'string',
            title: 'URL',
          },
        },
      },
    },

    async handler(ctx) {
      const { configPath, jobName, folderName, serverUrl } = ctx.input;

      const username = config.getOptionalString('scaffolder.jenkins.username');
      const apiKey = config.getOptionalString('scaffolder.jenkins.key');
      const server =
        serverUrl || config.getOptionalString('scaffolder.jenkins.server');

      if (!username || !apiKey) {
        throw new InputError(
          `No valid Jenkins credentials given. Please add them to the config file.`,
        );
      }

      if (!server) {
        throw new InputError(
          `No valid Jenkins server given. Please add it to the config file.`,
        );
      }

      const token = Buffer.from(`${username}:${apiKey}`).toString('base64');

      let url = `${server}`;

      if (folderName) {
        url = url.concat(`/job/${folderName}`);
      }

      url = url.concat(`/createItem?name=${jobName}`);

      let readStream = readFileSync(configPath, 'utf8');

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${token}`,
          'Content-Type': 'application/xml',
        },
        body: readStream,
      });

      if (response.ok) {
        ctx.logger.info(`Successfully created job ${jobName}`);
        ctx.logger.info(
          `Job URL: ${server}${
            folderName ? `/job/${folderName}` : ''
          }/job/${jobName}`,
        );
      }

      if (!response.ok) {
        throw new Error(
          `Failed to create job, ${response.status} ${response.statusText}`,
        );
      }
    },
  });
};
