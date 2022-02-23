import { Entity } from '@backstage/catalog-model';

export const AWS_CODEPIPELINE_ANNOTATION = 'aws.com/code-pipeline-name';
export const AWS_CODEPIPELINE_REGION_ANNOTATION =
  'aws.com/code-pipeline-region';
export const useServiceEntityAnnotations = (entity: Entity) => {
  const pipelineName =
    entity?.metadata.annotations?.[AWS_CODEPIPELINE_ANNOTATION] ?? '';
  const pipelineRegion =
    entity?.metadata.annotations?.[AWS_CODEPIPELINE_REGION_ANNOTATION] ?? '';

  return {
    pipelineName,
    pipelineRegion,
  };
};
