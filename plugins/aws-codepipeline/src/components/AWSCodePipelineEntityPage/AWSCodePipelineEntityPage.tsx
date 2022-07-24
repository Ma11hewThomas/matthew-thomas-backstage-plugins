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
