import { Box, Typography } from '@material-ui/core';
import {
  Link,
  ResponseErrorPanel,
  Table,
  TableColumn,
} from '@backstage/core-components';

import React from 'react';
import { CodePipelineExecution } from '../../types';
import { CodePipelineRunStatus } from '../Status';
import { DateTime } from 'luxon';
import { getDurationFromDates } from '../../utils/getDurationFromDates';

const columns: TableColumn[] = [
  {
    title: 'ID',
    field: 'id',
    highlight: false,
    width: 'auto',
    render: (row: Partial<CodePipelineExecution>) => (
      <Link to={row.executionHref ?? ''}>{row.pipelineExecutionId ?? ''}</Link>
    ),
  },
  {
    title: 'Build',
    field: 'build',
    width: 'auto',
    render: (row: Partial<CodePipelineExecution>) =>
      row.sourceRevisions !== undefined ? (
        <Link to={row.sourceRevisions[0].revisionUrl ?? ''}>
          {row.sourceRevisions[0].revisionSummary || ''}
        </Link>
      ) : (
        'No source revisions'
      ),
  },
  {
    title: 'Source',
    field: 'source',
    width: 'auto',
    render: (row: Partial<CodePipelineExecution>) =>
      row.sourceRevisions !== undefined ? (
        <Box display="flex" alignItems="center">
          <Typography> {row.sourceRevisions[0].actionName}</Typography>
        </Box>
      ) : (
        'No source revisions'
      ),
  },
  {
    title: 'State',
    width: 'auto',
    render: (row: Partial<CodePipelineExecution>) => (
      <Box display="flex" alignItems="center">
        <CodePipelineRunStatus status={row.status} />
      </Box>
    ),
  },
  {
    title: 'Duration',
    field: 'duration',
    width: 'auto',
    render: (row: Partial<CodePipelineExecution>) => (
      <Box aria-label="duration">
        {row.startTime &&
          row.lastUpdateTime &&
          getDurationFromDates(row.startTime, row.lastUpdateTime)}
      </Box>
    ),
  },
  {
    title: 'Age',
    field: 'age',
    width: 'auto',
    render: (row: Partial<CodePipelineExecution>) => (
      <Box aria-label="age">
        {DateTime.fromMillis(row.startTime?.getTime() as number).toRelative()}
      </Box>
    ),
  },
];

type BuildTableProps = {
  items?: CodePipelineExecution[];
  loading: boolean;
  error?: Error;
};

export const BuildTable = ({ items, loading, error }: BuildTableProps) => {
  if (error) {
    return (
      <div>
        <ResponseErrorPanel error={error} />
      </div>
    );
  }

  return (
    <Table
      isLoading={loading}
      columns={columns}
      options={{
        search: true,
        paging: true,
        pageSize: 5,
        showEmptyDataSourceMessage: !loading,
      }}
      title={
        <Box display="flex" alignItems="center">
          <Box mr={1} aria-label="title" />
          CodePipeline - Builds ({items ? items.length : 0})
        </Box>
      }
      data={items ?? []}
    />
  );
};
