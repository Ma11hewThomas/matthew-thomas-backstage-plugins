import { createRouter } from '@ma11hewthomas/backstage-plugin-aws-codepipeline-backend';
import { PluginEnvironment } from '../types';
import {Router} from "express";

export default function createPlugin({
                                         logger,
                                         config,
                                     }: PluginEnvironment): Promise<Router> {
    return createRouter({ logger, config });
}

