export interface Config {
  /** Configuration options for the aws-codepipeline plugin */
  awsCodePipeline: {
    /**
     * Access key used to authenticate requests.
     * @visibility secret
     */
    accessKeyId: string;
    /**
     * Secret key used to authenticate requests.
     * @visibility secret
     */
    secretAccessKey: string;
  };
}
