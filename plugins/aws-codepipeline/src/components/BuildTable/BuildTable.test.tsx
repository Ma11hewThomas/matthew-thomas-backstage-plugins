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

import { BuildTable } from './BuildTable';
import {
  codePipelineExecutionMock,
  codePipelineResponseMock,
} from '../../mocks/mocks';

describe('<BuildTable />', () => {
  it('renders without issue', async () => {
    const { getByText } = await renderInTestApp(
      <BuildTable
        items={codePipelineResponseMock.executions}
        loading={false}
      />,
    );
    expect(getByText('CodePipeline - Builds (1)')).toBeInTheDocument();
  });

  it('renders execution row', async () => {
    const { getByText } = await renderInTestApp(
      <BuildTable
        items={codePipelineResponseMock.executions}
        loading={false}
      />,
    );
    expect(
      getByText(
        codePipelineResponseMock.executions[0].pipelineExecutionId.substring(
          0,
          8,
        ),
      ),
    ).toBeInTheDocument();
  });
  it('renders execution id with href to execution', async () => {
    const { getByText } = await renderInTestApp(
      <BuildTable
        items={codePipelineResponseMock.executions}
        loading={false}
      />,
    );
    expect(
      getByText(
        codePipelineResponseMock.executions[0].pipelineExecutionId.substring(
          0,
          8,
        ),
      ),
    ).toHaveAttribute(
      'href',
      codePipelineResponseMock.executions[0].executionHref,
    );
  });

  it('renders revision summary with href to revision url', async () => {
    const { getByText } = await renderInTestApp(
      <BuildTable
        items={codePipelineResponseMock.executions}
        loading={false}
      />,
    );
    expect(
      getByText(
        codePipelineResponseMock.executions[0].sourceRevisions[0]
          .revisionSummary,
      ),
    ).toHaveAttribute(
      'href',
      codePipelineResponseMock.executions[0].sourceRevisions[0].revisionUrl,
    );
  });

  it('renders status', async () => {
    const { getByText } = await renderInTestApp(
      <BuildTable
        items={codePipelineResponseMock.executions}
        loading={false}
      />,
    );
    expect(
      getByText(codePipelineResponseMock.executions[0].status),
    ).toBeInTheDocument();
  });
  it('renders multiple rows', async () => {
    const { getByText } = await renderInTestApp(
      <BuildTable items={[codePipelineExecutionMock]} loading={false} />,
    );
    expect(
      getByText(codePipelineExecutionMock.pipelineExecutionId),
    ).toBeInTheDocument();
  });
  it('renders age', async () => {
    const { getByLabelText } = await renderInTestApp(
      <BuildTable
        items={codePipelineResponseMock.executions}
        loading={false}
      />,
    );
    expect(getByLabelText('age')).toBeInTheDocument();
  });
  it('renders duration', async () => {
    const { getByLabelText } = await renderInTestApp(
      <BuildTable
        items={codePipelineResponseMock.executions}
        loading={false}
      />,
    );
    expect(getByLabelText('duration')).toBeInTheDocument();
  });
});
