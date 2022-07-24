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
