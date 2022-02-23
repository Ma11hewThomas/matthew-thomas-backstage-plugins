import { CodePipelineData } from '../types';
import {AwsCodePipelineApi} from './AWSCodePipelineApi';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';

export class AwsCodePipelineClient implements AwsCodePipelineApi {
    private readonly discoveryApi: DiscoveryApi;
    private readonly identityApi: IdentityApi;

    constructor(options: {
        discoveryApi: DiscoveryApi;
        identityApi: IdentityApi;
    }) {
        this.discoveryApi = options.discoveryApi;
        this.identityApi = options.identityApi;
    }

    public async listPipelineExecutions({
        awsRegion,
        pipelineName}: {
        awsRegion: string;
        pipelineName: string;
    }
    ): Promise<CodePipelineData> {

        const urlSegment = `pipeline-executions/${encodeURIComponent(awsRegion)}/${encodeURIComponent(
            pipelineName
        )}/`;

        let codePipelineData = await this.get<CodePipelineData>(urlSegment);

        codePipelineData = {...codePipelineData, executions: codePipelineData.executions?.map(execution => ({
                ...execution,
                // @ts-ignore
                startTime: new Date(execution.startTime),
                // @ts-ignore
                lastUpdateTime: new Date(execution.lastUpdateTime),

        }))};
        return  codePipelineData ;
    }

    private async get<T>(path: string): Promise<T> {
        const baseUrl = `${await this.discoveryApi.getBaseUrl('aws-codepipeline')}/`;
        const url = new URL(path, baseUrl);

        const credentialsToken = await this.identityApi.getCredentials();
        const response = await fetch(url.toString(), {
            headers: credentialsToken ? { Authorization: `Bearer ${credentialsToken}` } : {},
        });

        if (!response.ok) {
            throw await ResponseError.fromResponse(response);
        }

        return await response.json() as Promise<T>;
    }
}

