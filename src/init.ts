import { initEnv } from "@core";
import path from "path";

initEnv();

let appRoot = path.resolve(__dirname);
global.appRoot = appRoot;
