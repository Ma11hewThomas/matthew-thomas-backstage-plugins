import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { awsEcsPlugin, AwsEcsPage } from '../src/plugin';

createDevApp()
  .registerPlugin(awsEcsPlugin)
  .addPage({
    element: <AwsEcsPage />,
    title: 'Root Page',
    path: '/aws-ecs'
  })
  .render();
