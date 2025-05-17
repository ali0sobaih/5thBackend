import fs from "node:fs";

type Configurations = Record<string, any>;

let serverConfigurations: Configurations | null = null;
const configPath = "/server-config.json";

export const getConfigurations = () => {
  if (!serverConfigurations) {
    try {
      const data = fs.readFileSync(__dirname + configPath, {
        encoding: "utf-8",
      });
      serverConfigurations = JSON.parse(data);
    } catch (error) {
      console.error(error);
      serverConfigurations = null;
    }
  }

  return serverConfigurations;
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
