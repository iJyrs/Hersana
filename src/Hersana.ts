import {Client, ClientEvents, Intents, Interaction} from "discord.js";
import {EventHandler} from "./discord/EventHandler";
import Keyv = require("keyv");
import {Logger} from "./utils/system/Logger";
import Color from "./utils/system/Color";
import {CommandManager} from "./discord/etc/CommandManager";

/**
 * @Singleton
 * 
 * Designated Instance Initialization (DII): index.ts
 */
export class Hersana {

    static CONSTANTS: Record<HersanaConstants, any> = {
        DEVELOPER_SNOWFLAKE: "697045706988322826",
        DISCORD_CLIENT_TOKEN: require("../resources/internal.config.json").token,
        KEYV_SQLITE_PATH: "sqlite://resources/store/database.sqlite"
    }

    private static instance: Hersana;
    
    readonly discord: Client = new Client({ intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.DIRECT_MESSAGES
        ] });

    readonly keyv: Keyv = new Keyv(Hersana.CONSTANTS.KEYV_SQLITE_PATH);

    private constructor() {
        this.discord.on("ready", EventHandler.ready);
        this.discord.on("interactionCreate", EventHandler.interactionCreate);
        this.discord.on("messageCreate", EventHandler.messageCreate);

        this.discord.login(Hersana.CONSTANTS.DISCORD_CLIENT_TOKEN).then(() => {
            Logger.info("Discord Client is " + Color.BOLD + "ACTIVE" + Color.RESET + ". (discord.js@v13.7.0)");

            // Designated Instance Initialization (DII)
            CommandManager.getInstance();
        }).catch(() => {
            Logger.error("Whoops! An error occurred while attempting to login to Discord client... (INVALID_TOKEN_PROVIDED)")
            Logger.error("To modify the application's stored token, navigate to resources/internal.config.json.")
            Logger.error("Having issues? Contact a Project Contributor @ contact@ijyrs.com")

            process.exit(0);
        })
    }

    static getInstance() {
        if(Hersana.instance === undefined) {
            Hersana.instance = new Hersana();
        }

        return Hersana.instance;
    }
    
}

type HersanaConstants =
    | "DEVELOPER_SNOWFLAKE"
    | "DISCORD_CLIENT_TOKEN"
    | "KEYV_SQLITE_PATH"