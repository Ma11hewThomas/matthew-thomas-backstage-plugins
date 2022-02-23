import { awsCodePipelinePlugin } from './plugin';

describe('codepipeline', () => {
  it('should export plugin', () => {
    expect(awsCodePipelinePlugin).toBeDefined();
  });
});
