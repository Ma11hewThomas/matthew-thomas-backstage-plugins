import React from 'react';
import { useCodePipeline } from '../../hooks/useCodePipeline';
import { BuildTable } from '../BuildTable';
import {
  AWS_CODEPIPELINE_REGION_ANNOTATION,
  useServiceEntityAnnotations,
} from '../../hooks/useServiceEntityAnnotations';
import { Entity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import { MissingAnnotationEmptyState } from '@backstage/core-components';
import ErrorBoundary from '../ErrorBoundary';
import { isRegionInAnnotations } from '../AWSCodePipelineOverview/AWSCodePipelineOverview';

export const AWSCodePipelineEntityPage = ({ entity }: { entity: Entity }) => {
  const { pipelineName, pipelineRegion } = useServiceEntityAnnotations(entity);
  const [codePipelineData] = useCodePipeline({
    pipelineName,
    region: pipelineRegion,
  });

  return (
    <BuildTable
      items={codePipelineData.pipeline?.executions}
      loading={codePipelineData.loading}
    />
  );
};

export const AWSCodePipelineCiCdWidget = () => {
  const { entity } = useEntity();
  return !isRegionInAnnotations(entity) ? (
    <MissingAnnotationEmptyState
      annotation={AWS_CODEPIPELINE_REGION_ANNOTATION}
    />
  ) : (
    <ErrorBoundary>
      <AWSCodePipelineEntityPage entity={entity} />
    </ErrorBoundary>
  );
};
