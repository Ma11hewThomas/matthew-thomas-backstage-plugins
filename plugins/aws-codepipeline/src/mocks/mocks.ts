export const codePipelineResponseMock = {
  region: 'eu-west-2',
  name: 'pipeline-name',
  pipelineHref:
    'https://region.console.aws.amazon.com/codesuite/codepipeline/pipelines/pipeline/executions/executionid/timeline?region=region',
  latestExecution: {
    executionHref:
      'https://region.console.aws.amazon.com/codesuite/codepipeline/pipelines/pipelinename/executions/executionid/timeline?region=region',
    lastUpdateTime: new Date(1.645120109117e9),
    pipelineExecutionId: '',
    sourceRevisions: [
      {
        actionName: '',
        revisionId: '',
        revisionSummary: '',
        revisionUrl: '',
      },
    ],
    startTime: new Date(1.645115628031e9),
    status: 'Succeeded',
    trigger: {
      triggerDetail: '',
      triggerType: '',
    },
  },
  executions: [
    {
      lastUpdateTime: new Date(1.645451570693e9),
      pipelineExecutionId: '11111111',
      executionHref:
        'https://region.console.aws.amazon.com/codesuite/codepipeline/pipelines/pipelinename/executions/executionid/timeline?region=region',
      sourceRevisions: [
        {
          actionName: 'CodeCommit',
          revisionId: '0da39b1ebb21025b338ef85e1111111111111111',
          revisionSummary: 'test revision a',
          revisionUrl:
            'https://console.aws.amazon.com/codecommit/home?region=region#/repository/repository/commit/commithash',
        },
      ],
      startTime: new Date(1.645451570693e9),
      status: 'Succeeded',
      trigger: {
        triggerDetail: 'arn:aws:events:region:account:rule/repository',
        triggerType: 'CloudWatchEvent',
      },
    },
  ],
};

export const codePipelineExecutionMock = {
  lastUpdateTime: new Date(1.645451570693e9),
  pipelineExecutionId: '22222222',
  executionHref:
    'https://region.console.aws.amazon.com/codesuite/codepipeline/pipelines/pipelinename/executions/executionid/timeline?region=region',
  sourceRevisions: [
    {
      actionName: 'CodeCommit',
      revisionId: '0da39b1ebb21025b338ef85e2222222222222222',
      revisionSummary: 'test revision b',
      revisionUrl:
        'https://console.aws.amazon.com/codecommit/home?region=region#/repository/repository/commit/commithash',
    },
  ],
  startTime: new Date(1.645451570693e9),
  status: 'Failed',
  trigger: {
    triggerDetail: 'arn:aws:events:region:account:rule/repository',
    triggerType: 'CloudWatchEvent',
  },
};
