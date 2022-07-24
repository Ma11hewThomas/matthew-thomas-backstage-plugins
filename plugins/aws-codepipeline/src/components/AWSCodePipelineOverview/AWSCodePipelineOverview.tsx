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
import {
  Typography,
  Card,
  CardHeader,
  Divider,
  CardContent,
  makeStyles,
  Link,
  LinearProgress,
  Box,
} from '@material-ui/core';
import { Entity } from '@backstage/catalog-model';
import { DateTime } from 'luxon';
import { useCodePipeline } from '../../hooks/useCodePipeline';
import { CodePipelineData } from '../../types';
import {
  AWS_CODEPIPELINE_REGION_ANNOTATION,
  useServiceEntityAnnotations,
} from '../../hooks/useServiceEntityAnnotations';
import {
  MissingAnnotationEmptyState,
  StructuredMetadataTable,
} from '@backstage/core-components';
import ErrorBoundary from '../ErrorBoundary';
import { useEntity } from '@backstage/plugin-catalog-react';
import ExternalLinkIcon from '@material-ui/icons/Launch';
import { CodePipelineRunStatus } from '../Status';
import { getDurationFromDates } from '../../utils/getDurationFromDates';

const useStyles = makeStyles(() => ({
  externalLinkIcon: {
    fontSize: 'inherit',
    verticalAlign: 'bottom',
  },
}));

export const OverviewComponent = ({
  codePipeline,
}: {
  codePipeline: CodePipelineData;
}) => {
  const sinceExecution = codePipeline.latestExecution?.startTime
    ? DateTime.fromMillis(
        new Date(codePipeline.latestExecution.startTime).getTime() as number,
      ).toRelative()
    : 'Not yet run';

  const classes = useStyles();
  return (
    <Card>
      <CardHeader
        title={<Typography variant="h5">CodePipeline latest build</Typography>}
      />
      <Divider />
      <CardContent>
        <StructuredMetadataTable
          metadata={{
            name: codePipeline.name,
            status: (
              <CodePipelineRunStatus
                status={codePipeline.latestExecution?.status as string}
              />
            ),
            'latest run': <Box aria-label="latest-run">{sinceExecution}</Box>,
            duration: (
              <Box aria-label="duration">
                {codePipeline.latestExecution?.startTime !== undefined &&
                  codePipeline.latestExecution?.lastUpdateTime !== undefined &&
                  getDurationFromDates(new Date(codePipeline.latestExecution?.startTime), new Date(codePipeline.latestExecution?.lastUpdateTime))}
              </Box>
            ),
            link: (
              <Link href={codePipeline.pipelineHref} target="_blank">
                See more on AWS CodePipeline{' '}
                <ExternalLinkIcon className={classes.externalLinkIcon} />
              </Link>
            ),
          }}
        />
      </CardContent>
    </Card>
  );
};

export const isRegionInAnnotations = (entity: Entity) =>
  entity?.metadata.annotations?.[AWS_CODEPIPELINE_REGION_ANNOTATION];

export const AWSCodePipelineOverview = ({ entity }: { entity: Entity }) => {
  const { pipelineName, pipelineRegion } = useServiceEntityAnnotations(entity);

  const [codePipelineData] = useCodePipeline({
    pipelineName,
    region: pipelineRegion,
  });
  if (codePipelineData.loading) {
    return (
      <Card>
        <CardHeader
          title={<Typography variant="h5">AWS CodePipeline</Typography>}
        />
        <LinearProgress />
      </Card>
    );
  }
  return (
    <>
      {codePipelineData.pipeline && (
        <OverviewComponent codePipeline={codePipelineData.pipeline} />
      )}
    </>
  );
};

export const AWSCodePipelineOverviewWidget = () => {
  const { entity } = useEntity();
  return !isRegionInAnnotations(entity) ? (
    <MissingAnnotationEmptyState
      annotation={AWS_CODEPIPELINE_REGION_ANNOTATION}
    />
  ) : (
    <ErrorBoundary>
      <AWSCodePipelineOverview entity={entity} />
    </ErrorBoundary>
  );
};
