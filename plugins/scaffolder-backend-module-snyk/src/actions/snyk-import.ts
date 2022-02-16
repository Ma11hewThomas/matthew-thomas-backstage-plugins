import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';
import fetch from 'cross-fetch';

export const snykImportProjectAction = () => {
  return createTemplateAction<{
    repoOwner: string;
    repoName: string;
    repoBranchName?: string;
    snykOrganizationId: string;
    snykIntegrationId: string;
  }>({
    id: 'snyk:import-projects',
    schema: {
      input: {
        required: [
          'repoOwner',
          'repoName',
          'snykOrganizationId',
          'snykIntegrationId',
        ],
        type: 'object',
        properties: {
          repoOwner: {
            type: 'string',
            title: 'Owner of the repository',
            description:
              'Owner of the repository, e.g. for Github this is the organization, user or project that the repo belongs to and Bitbucket the organization that the repo belongs to',
          },
          repoName: {
            type: 'string',
            title: 'Name of repository',
            description: 'Name of the repository to import',
          },
          repoBranchName: {
            type: 'string',
            title: 'Branch name of repository',
            description: 'Branch of the repository to import, defaults to main',
          },
          snykOrganizationId: {
            type: 'string',
            title: 'Snyk organisation id',
            description:
              'The organization ID. The API_KEY must have admin access to this organization. Example: 4a18d42f-0706-4ad0-b127-24078731fbed',
          },
          snykIntegrationId: {
            type: 'string',
            title: 'Snyk integration id',
            description:
              'The unique identifier for the configured integration. This can be found on the Integration page in the Settings area for all integrations that have been configured. Example: 9a3e5d90-b782-468a-a042-9a2073736f0b.',
          },
        },
      },
    },
    async handler(ctx) {
      let response: Response;
      const baseUrl = `https://snyk.io/api/v1`;
      const options: RequestInit = {
        method: 'POST',
        body: JSON.stringify({
          target: {
            owner: ctx.input.repoOwner,
            name: ctx.input.repoName,
            branch: ctx.input.repoBranchName || 'main',
          },
        }),
        headers: {
          Authorization: `${process.env.SNYK_TOKEN}`,
          'Content-Type': 'application/json',
        },
      };

      try {
        response = await fetch(
          `${baseUrl}/org/${ctx.input.snykOrganizationId}/integrations/${ctx.input.snykIntegrationId}/import`,
          options,
        );
      } catch (e) {
        throw new Error(`Unable to import projects, ${e}`);
      }

      if (response.status !== 201) {
        throw new Error(
          `Unable to import projects, ${response.status} ${
            response.statusText
          }, ${await response.text()}`,
        );
      }
      ctx.logger.info(`Imported Snyk projects successfully`);
    },
  });
};
