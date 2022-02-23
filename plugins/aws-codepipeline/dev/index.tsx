import { createDevApp } from '@backstage/dev-utils';
import { awsCodePipelinePlugin } from '../src/plugin';

createDevApp().registerPlugin(awsCodePipelinePlugin).render();
