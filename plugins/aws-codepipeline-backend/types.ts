export type CodePipelineData = {
  region: string;
  name: string;
  pipelineHref: string;
  latestExecution: CodePipelineExecution | undefined;
  executions: CodePipelineExecution[] | undefined;
};

export type CodePipelineExecution = {
  pipelineExecutionId?: string;
  executionHref?: string;
  status?: PipelineExecutionStatus | string;
  startTime?: Date;
  lastUpdateTime?: Date;
  sourceRevisions?: SourceRevision[];
  trigger?: ExecutionTrigger;
};

export type SourceRevision = {
  actionName: string | undefined;
  revisionId?: string;
  revisionSummary?: string;
  revisionUrl?: string;
};

export type ExecutionTrigger = {
  triggerType?: TriggerType | string;
  triggerDetail?: string;
};

export declare enum PipelineExecutionStatus {
  Cancelled = 'Cancelled',
  Failed = 'Failed',
  InProgress = 'InProgress',
  Stopped = 'Stopped',
  Stopping = 'Stopping',
  Succeeded = 'Succeeded',
  Superseded = 'Superseded',
}

export declare enum TriggerType {
  CloudWatchEvent = 'CloudWatchEvent',
  CreatePipeline = 'CreatePipeline',
  PollForSourceChanges = 'PollForSourceChanges',
  PutActionRevision = 'PutActionRevision',
  StartPipelineExecution = 'StartPipelineExecution',
  Webhook = 'Webhook',
}
