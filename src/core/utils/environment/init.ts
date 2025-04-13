import dotenv from "dotenv";

let initializedEnv = false;

/**
 * If env hasn't been initialized yet, calling this function will initialize it.
 * Otherwise this function will do nothing.
 */
export const initEnv = () => {
  if (initializedEnv) return;

  dotenv.config();

  //? Convert env string values to their JS corresponding values
  const env = process.env as Record<any, any>;
  for (const variable in env) {
    if (Object.prototype.hasOwnProperty.call(env, variable)) {
      const value = env[variable];

      if (value === "true") env[variable] = true;
      else if (value === "false") env[variable] = false;
      else if (!Number.isNaN(Number(value))) {
        env[variable] = Number.parseFloat(value);
      }
    }
  }

  initializedEnv = true;
};
