declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      API_PORT: string;
      API_HOST: string;
      LOG_LEVEL: "info" | "debug";
      MONGODB_URL: string;
      JWT_SECRET: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
