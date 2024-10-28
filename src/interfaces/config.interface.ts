export interface Config {
  app: {
    port: number;
    jwtSecret: string;
    node_env: string;
  };
  cors: {
    origin: string;
    credentials: boolean;
  };
  logs: {
    format: string;
    directory: string;
  };
  cloudinary: {
    cloud_name: string;
    api_key: string;
    api_secret: string;
    folder: string;
  };
}
