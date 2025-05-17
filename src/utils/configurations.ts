import fs from "node:fs";

type Configurations = Record<string, any>;

let serverConfigurations: Configurations | null = null;
const configPath = `${global.__ROOT_DIR__}/server-config.json`;

export const getConfigurations = () => {
  if (!serverConfigurations) {
    try {
      const data = fs.readFileSync(configPath, {
        encoding: "utf-8",
      });
      serverConfigurations = JSON.parse(data);
    } catch (error) {
      console.error(error);
      serverConfigurations = null;
    }
  }

  return serverConfigurations as Configurations;
};

export const setConfiguration = (configs: Configurations) => {
  const currentConfigs = getConfigurations();
  const newConfigs = { ...currentConfigs, ...configs };

  try {
    fs.writeFileSync(configPath, JSON.stringify(newConfigs), {
      encoding: "utf-8",
    });
  } catch (error) {
    console.error(error);
  }

  serverConfigurations = null;
};

export const deleteConfiguration = (key: string | string[]) => {
  const configs = getConfigurations();

  const keys = Array.isArray(key) ? key : [key];
  for (const key of keys) {
    delete configs[key];
  }

  setConfiguration(configs);

  serverConfigurations = null;
};
