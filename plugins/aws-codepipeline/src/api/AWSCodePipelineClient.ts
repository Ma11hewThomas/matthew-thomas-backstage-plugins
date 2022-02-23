import { CodePipelineData, CodePipelineExecution } from '../types';
import { AwsCodePipelineApi } from './AWSCodePipelineApi';
import { CodePipeline } from '@aws-sdk/client-codepipeline';

async function generateCredentials(
  backendUrl: string,
  options: {
    token: string | undefined;
  },
) {
  const respData = await fetch(`${backendUrl}/api/aws/credentials`, {
    headers: {
      // Disable eqeqeq rule for next line to allow it to pick up both undefined and null
      // eslint-disable-next-line eqeqeq
      ...((options == null ? void 0 : options.token) && {
        // eslint-disable-next-line eqeqeq
        Authorization: `Bearer ${options == null ? void 0 : options.token}`,
      }),
    },
  });
  try {
    const resp = await respData.json();
    return {
      accessKeyId: resp.AccessKeyId,
      secretAccessKey: resp.SecretAccessKey,
      sessionToken: resp.SessionToken,
    };
  } catch (e: any) {
    throw new Error('MissingBackendAwsAuthException');
  }
}
export class AwsCodePipelineClient implements AwsCodePipelineApi {
  async listPipelineExecutions({
    awsRegion,
    backendUrl,
    pipelineName,
    token,
  }: {
    awsRegion: string;
    backendUrl: string;
    pipelineName: string;
    token?: string;
  }): Promise<CodePipelineData> {
    const credentials = await generateCredentials(backendUrl, { token });
    const codePipelineApi = new CodePipeline({
      region: awsRegion,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        sessionToken: credentials.sessionToken,
      },
    });
    const resp = await codePipelineApi.listPipelineExecutions({
      pipelineName: pipelineName,
    });

    const executions: Array<CodePipelineExecution> | undefined =
      resp.pipelineExecutionSummaries?.map(execution => ({
        ...execution,
        pipelineExecutionId: execution.pipelineExecutionId?.substring(0, 8),
        executionHref: `https://${awsRegion}.console.aws.amazon.com/codesuite/codepipeline/pipelines/${pipelineName}/executions/${execution.pipelineExecutionId}/timeline?region=${awsRegion}`,
      }));

    return {
      region: awsRegion,
      name: pipelineName,
      pipelineHref: `https://${awsRegion}.console.aws.amazon.com/codesuite/codepipeline/pipelines/${pipelineName}?region=${awsRegion}`,
      executions: executions,
      latestExecution:
        resp.pipelineExecutionSummaries !== undefined &&
        resp.pipelineExecutionSummaries.length > 0
          ? resp.pipelineExecutionSummaries[0]
          : undefined,
    };
  }
}
