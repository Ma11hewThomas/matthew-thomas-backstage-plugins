import { createApiRef } from '@backstage/core-plugin-api';
import { CodePipelineData } from '../types';

export const awsCodePipelineApiRef = createApiRef<AwsCodePipelineApi>({
  id: 'plugin.awscodepipeline.service',
});

export type AwsCodePipelineApi = {
  listPipelineExecutions: ({
    awsRegion,
    backendUrl,
    pipelineName,
    token,
  }: {
    awsRegion: string;
    backendUrl: string;
    pipelineName: string;
    token?: string;
  }) => Promise<CodePipelineData>;
};
