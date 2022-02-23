import { Logger } from 'winston';
import { CodePipeline } from '@aws-sdk/client-codepipeline';
import {Credentials, GetSessionTokenCommand, STSClient} from "@aws-sdk/client-sts";
import {CodePipelineData} from "../../types";

export class AwsCodePipelineApi {
  public constructor(private readonly logger: Logger) {}
  public async listPipelineExecutions({
    awsRegion,
    pipelineName,
    credentials,
  }: {
    awsRegion: string;

    pipelineName: string;
    credentials: { accessKeyId: string; secretAccessKey: string };
  }): Promise<CodePipelineData> {

    const codePipelineApi = new CodePipeline({
      region: awsRegion,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
      },
    });
    this.logger?.debug(
      `Calling AWS for pipeline executions for pipeline ${pipelineName}`,
    );
    const resp = await codePipelineApi.listPipelineExecutions({
      pipelineName: pipelineName,
    });

    const executions: Array<any> | undefined =
      resp.pipelineExecutionSummaries?.map(execution => ({
        ...execution,
        startTime: execution.startTime,
          lastUpdateTime: execution.lastUpdateTime,
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

export async function getTemporarySessionToken(
  awsRegion: string,
  credentials: { accessKeyId: string; secretAccessKey: string },
): Promise< Credentials | undefined> {
  const stsClient = new STSClient({ region: awsRegion,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
    }});

  const command = new GetSessionTokenCommand({DurationSeconds: 300});
  const response = await stsClient.send(command);
  return response.Credentials;
}

