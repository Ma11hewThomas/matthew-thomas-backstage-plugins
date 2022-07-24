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
    createApiFactory,
    createComponentExtension,
    createPlugin,
    createRouteRef, discoveryApiRef, identityApiRef,
} from '@backstage/core-plugin-api';
import { awsCodePipelineApiRef, AwsCodePipelineClient } from './api';
import { Entity } from '@backstage/catalog-model';
import { AWS_CODEPIPELINE_ANNOTATION } from './hooks/useServiceEntityAnnotations';

export const isAWSCodePipelineAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[AWS_CODEPIPELINE_ANNOTATION]);

export const entityContentRouteRef = createRouteRef({
  id: 'aws-codepipeline-entity-content',
});

export const awsCodePipelinePlugin = createPlugin({
    id: 'aws-codepipeline',
    apis: [
        createApiFactory({
            api: awsCodePipelineApiRef,
            deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
            factory: ({ discoveryApi, identityApi }) =>
                new AwsCodePipelineClient({ discoveryApi, identityApi }),
        }),
    ],
});

export const EntityAWSCodePipelineOverviewCard = awsCodePipelinePlugin.provide(
  createComponentExtension({
    name: 'EntityAWSCodePipelineOverviewCard',
    component: {
      lazy: () =>
        import(
          './components/AWSCodePipelineOverview/AWSCodePipelineOverview'
        ).then(m => m.AWSCodePipelineOverviewWidget),
    },
  }),
);

export const EntityPageCodePipeline = awsCodePipelinePlugin.provide(
  createComponentExtension({
    name: 'EntityPageCodePipeline',
    component: {
      lazy: () =>
        import(
          './components/AWSCodePipelineEntityPage/AWSCodePipelineEntityPage'
        ).then(m => m.AWSCodePipelineCiCdWidget),
    },
  }),
);
