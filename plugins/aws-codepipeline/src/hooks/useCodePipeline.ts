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

import {useAsync, useAsyncRetry} from 'react-use';
import {configApiRef, errorApiRef, identityApiRef, useApi,} from '@backstage/core-plugin-api';
import {CodePipelineData} from '../types';
import {useCallback} from 'react';
import {awsCodePipelineApiRef} from '../api';

export function useCodePipeline({
  pipelineName,
  region,
}: {
  pipelineName: string;
  region: string;
}) {
  const codePipelineApi = useApi(awsCodePipelineApiRef);
  const errorApi = useApi(errorApiRef);
  const configApi = useApi(configApiRef);
  const identityApi = useApi(identityApiRef);

  const identity = useAsync(async () => {
    return await identityApi.getCredentials();
  });

  const listPipelineExecutions = useCallback(
    async () => {
      return await codePipelineApi.listPipelineExecutions({
        backendUrl: configApi.getString('backend.baseUrl'),
        awsRegion: region,
        pipelineName: pipelineName,
        token: identity.value?.token || undefined,
      });
    },
    [region, pipelineName], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const {
    loading,
    value: pipeline,
    error,
    retry,
  } = useAsyncRetry<CodePipelineData | null>(async () => {
    try {
      return await listPipelineExecutions();
    } catch (err) {
      // @ts-ignore
      if (err?.message === 'MissingBackendAwsAuthException') {
        errorApi.post(new Error('Please add aws auth backend plugin'));
        return null;
      }
      // @ts-ignore
      errorApi.post(err);
      return null;
    }
  }, []);

  return [
    {
      loading,
      pipeline,
      error,
      retry,
    },
  ] as const;
}
