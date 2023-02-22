import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const awsEcsPlugin = createPlugin({
  id: 'aws-ecs',
  routes: {
    root: rootRouteRef,
  },
});

export const AwsEcsPage = awsEcsPlugin.provide(
  createRoutableExtension({
    name: 'AwsEcsPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
