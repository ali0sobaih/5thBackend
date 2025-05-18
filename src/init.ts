import { initEnv } from "@core";
import path from "path";

initEnv();

let appRoot = path.resolve(__dirname);
global.__SRC_DIR__ = appRoot;
global.__ROOT_DIR__ = path.normalize(`${appRoot}/..//`);
