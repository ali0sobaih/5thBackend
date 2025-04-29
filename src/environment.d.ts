declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_HOST: string;
      SERVER_PORT: string;
      API_VERSION: `v${number}`;

      DB_HOST: string;
      DB_USER: string;
      DB_PASSWORD: string | undefined;
      DB_NAME: string;
      DB_PORT: number;
    }
  }
}

export {};
