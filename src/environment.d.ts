declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_HOST: string;
      SERVER_PORT: number;
      API_VERSION: `v${number}`;

      DB_PORT: number;
      DATABASE_URL: string;

      JWT_SECRET: string;
    }
  }
}

export {};
