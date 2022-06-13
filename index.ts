import { Logger } from "./src/utils/system/Logger";
import { version } from "./package.json";

Logger.info("Starting Hersana@v"+version+"...")

import { Hersana } from "./src/Hersana";

Hersana.getInstance();

