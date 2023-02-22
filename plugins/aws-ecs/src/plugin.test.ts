import { awsEcsPlugin } from './plugin';

describe('aws-ecs', () => {
  it('should export plugin', () => {
    expect(awsEcsPlugin).toBeDefined();
  });
});
