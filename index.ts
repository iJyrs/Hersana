import Logger from "./src/utils/Logger";
const packageJson = require("./package.json");

Logger.info("Starting Hersana@v"+packageJson.version+"...");

import Config from "./src/utils/conf/Config";
Config.ABS_DIR_PATH = __dirname;

import { Hersana } from "./src/Hersana";
Hersana.getInstance();