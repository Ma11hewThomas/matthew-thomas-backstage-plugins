import React from 'react';
import {
  StatusRunning,
  StatusOK,
  StatusWarning,
  StatusAborted,
  StatusError,
} from '@backstage/core-components';

export const CodePipelineRunStatus = ({
  status,
}: {
  status: string | undefined;
}) => {
  if (status === undefined) return null;
  switch (status) {
    case 'InProgress':
    case 'Stopping':
      return (
        <>
          <StatusRunning /> In progress
        </>
      );
    case 'Superseded':
      return (
        <>
          <StatusWarning /> Superseded
        </>
      );
    case 'Failed':
      return (
        <>
          <StatusError /> Failed
        </>
      );
    case 'Succeeded':
      return (
        <>
          <StatusOK /> Succeeded
        </>
      );
    case 'Cancelled':
    case 'Stopped':
      return (
        <>
          <StatusAborted /> Cancelled
        </>
      );
    default:
      return (
        <>
          <StatusWarning /> {status}
        </>
      );
  }
};
