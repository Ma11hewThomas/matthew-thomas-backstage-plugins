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
import { CodePipelineRunStatus } from './CodePipelineRunStatus';
import { renderInTestApp } from '@backstage/test-utils';

describe('<CodePipelineRunStatus>', () => {
  it('should return Status ok for succeeded', async () => {
    const { getByLabelText, getByText } = await renderInTestApp(
      <CodePipelineRunStatus status="Succeeded" />,
    );

    expect(getByLabelText('Status ok')).toBeInTheDocument();
    expect(getByText('Succeeded')).toBeInTheDocument();
  });
  it('should return Status error for failed', async () => {
    const { getByLabelText, getByText } = await renderInTestApp(
      <CodePipelineRunStatus status="Failed" />,
    );

    expect(getByLabelText('Status error')).toBeInTheDocument();
    expect(getByText('Failed')).toBeInTheDocument();
  });
  it('should return Status aborted for cancelled', async () => {
    const { getByLabelText, getByText } = await renderInTestApp(
      <CodePipelineRunStatus status="Cancelled" />,
    );

    expect(getByLabelText('Status aborted')).toBeInTheDocument();
    expect(getByText('Cancelled')).toBeInTheDocument();
  });
  it('should return Status running for InProgress', async () => {
    const { getByLabelText, getByText } = await renderInTestApp(
      <CodePipelineRunStatus status="InProgress" />,
    );

    expect(getByLabelText('Status running')).toBeInTheDocument();
    expect(getByText('In progress')).toBeInTheDocument();
  });
  it('should return Status running for Stopping', async () => {
    const { getByLabelText, getByText } = await renderInTestApp(
      <CodePipelineRunStatus status="Stopping" />,
    );

    expect(getByLabelText('Status running')).toBeInTheDocument();
    expect(getByText('In progress')).toBeInTheDocument();
  });
  it('should return Status warning for Superseded', async () => {
    const { getByLabelText, getByText } = await renderInTestApp(
      <CodePipelineRunStatus status="Superseded" />,
    );

    expect(getByLabelText('Status warning')).toBeInTheDocument();
    expect(getByText('Superseded')).toBeInTheDocument();
  });
  it('should return Status aborted for Stopped', async () => {
    const { getByLabelText, getByText } = await renderInTestApp(
      <CodePipelineRunStatus status="Stopped" />,
    );

    expect(getByLabelText('Status aborted')).toBeInTheDocument();
    expect(getByText('Cancelled')).toBeInTheDocument();
  });
  it('should return Status warning for an unknown status', async () => {
    const { getByLabelText, getByText } = await renderInTestApp(
      <CodePipelineRunStatus status="unknown status" />,
    );

    expect(getByLabelText('Status warning')).toBeInTheDocument();
    expect(getByText('unknown status')).toBeInTheDocument();
  });
});
