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

import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { AwsCodePipelineApi } from '../api';
import { Config } from '@backstage/config';

export interface RouterOptions {
  awsCodePipelineApi?: AwsCodePipelineApi;
  logger: Logger;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;
  const config = options.config.getConfig('awsCodePipeline');
  const accessKeyId = config.getString('accessKeyId');
  const secretAccessKey = config.getString('secretAccessKey');

  const awsCodePipelineApi = new AwsCodePipelineApi(logger);

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.send({ status: 'ok' });
  });

  router.get('/pipeline-executions/:region/:pipelineName', async (req, res) => {
    const { region, pipelineName } = req.params;
    const pipelineExecutions = await awsCodePipelineApi.listPipelineExecutions({
      awsRegion: region,
      pipelineName: pipelineName,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });

    res.status(200).json(pipelineExecutions);
  });

  router.use(errorHandler());
  return router;
}
