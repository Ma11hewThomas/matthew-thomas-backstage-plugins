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

import {
  executeShellCommand,
} from '@backstage/plugin-scaffolder-backend';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { resolveSafeChildPath } from '@backstage/backend-common';

export const projenNewAction = () => {
  return createTemplateAction<{
    template: string;
    external?: boolean;
    post?: boolean;
    targetPath?: string;
    args?: string;

  }>({
    id: 'projen:new',
    description: 'Runs the projen new command',
    schema: {
      input: {
        required: ['template'],
        type: 'object',
        properties: {
          template: {
            type: 'string',
            title: 'Template name',
          },
          external: {
            title: 'External',
            description:
              'Projen provide built in templates for many different projects. If you are using a custom template, set this to true to use the external projen command --from. Default is false.',
            type: 'boolean',
          },
          post: {
            title: 'Post',
            description:
            'Run post-synthesis steps such as installing dependencies. Default is true.',
            type: 'boolean',
          },
          targetPath: {
            title: 'Target Path',
            description:
              'Target path within the working directory to generate contents to. Defaults to the working directory root.',
            type: 'string',
          },
          args: {
            type: 'string',
            title: 'Additional arguments to pass to the command, see projen documentation for more information',
          },
        },
      },
    },
    async handler(ctx) {
      const targetPath = ctx.input.targetPath ?? './';
      const outputDir = resolveSafeChildPath(ctx.workspacePath, targetPath);

      const post = ctx.input.post ?? true;
      const postArg = post ? '--post' : '--no-post'

      const args = ['projen', 'new', ctx.input.template, postArg ];

      ctx.input.external && args.splice(2, 0, '--from');

      const additionalArgs =  ctx.input.args ? ctx.input.args.split(' ') : false;
      additionalArgs && args.push(...additionalArgs);
      
      const argsString = args.map(x => `${x}`).join(' ');
      
      ctx.logger.info(  
        `Running "npx ${argsString}" script with projen:new scaffolder action`,
      );

      await executeShellCommand({
        command: 'npx',
        args: args,
        options: {
          cwd: outputDir,
        },
        logStream: ctx.logStream,
      });

      ctx.logger.info(`Template result written to ${outputDir}`);
    },
  });
};
