import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  createRouteRef,
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
  apis: [createApiFactory(awsCodePipelineApiRef, new AwsCodePipelineClient())],
  routes: {
    entityContent: entityContentRouteRef,
  },
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
