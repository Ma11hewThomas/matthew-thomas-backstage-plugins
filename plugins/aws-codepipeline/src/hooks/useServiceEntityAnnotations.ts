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
