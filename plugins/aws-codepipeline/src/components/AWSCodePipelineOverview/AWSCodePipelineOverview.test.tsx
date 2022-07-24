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
import { renderInTestApp } from '@backstage/test-utils';
import { OverviewComponent } from './AWSCodePipelineOverview';
import { codePipelineResponseMock } from '../../mocks/mocks';

describe('<OverviewComponent />', () => {
  it('renders without issue', async () => {
    const { getByText } = await renderInTestApp(
      <OverviewComponent codePipeline={codePipelineResponseMock} />,
    );
    expect(getByText('CodePipeline latest build')).toBeInTheDocument();
  });
  it('renders pipeline name', async () => {
    const { getByText } = await renderInTestApp(
      <OverviewComponent codePipeline={codePipelineResponseMock} />,
    );
    expect(getByText(codePipelineResponseMock.name)).toBeInTheDocument();
  });
  it('renders latest status', async () => {
    const { getByText } = await renderInTestApp(
      <OverviewComponent codePipeline={codePipelineResponseMock} />,
    );
    expect(
      getByText(codePipelineResponseMock.latestExecution.status),
    ).toBeInTheDocument();
  });
  it('renders latest link', async () => {
    const { getByText } = await renderInTestApp(
      <OverviewComponent codePipeline={codePipelineResponseMock} />,
    );
    expect(getByText('See more on AWS CodePipeline')).toHaveAttribute(
      'href',
      codePipelineResponseMock.pipelineHref,
    );
  });
  it('renders latest duration', async () => {
    const { getByLabelText } = await renderInTestApp(
      <OverviewComponent codePipeline={codePipelineResponseMock} />,
    );
    expect(getByLabelText('duration')).toBeInTheDocument();
  });
  it('renders time since latest run', async () => {
    const { getByLabelText } = await renderInTestApp(
      <OverviewComponent codePipeline={codePipelineResponseMock} />,
    );
    expect(getByLabelText('latest-run')).toBeInTheDocument();
  });
  it('renders latest not yet run when startTime undefined', async () => {
    const mock = {
      ...codePipelineResponseMock,
      latestExecution: {
        ...codePipelineResponseMock.latestExecution,
        startTime: undefined,
      },
    };
    const { getByText } = await renderInTestApp(
      <OverviewComponent codePipeline={mock} />,
    );
    expect(getByText('Not yet run')).toBeInTheDocument();
  });
});
