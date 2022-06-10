import { Client as DiscordClient, Intents } from "discord.js";

import Logger from "./utils/Logger";
import Color from "./utils/Color";
import { EventHandler } from "./disc/EventHandler";
import { ActivityTypes } from "discord.js/typings/enums";
import Config from "./utils/conf/Config";
import { CommandHandler } from "./disc/CommandHandler";
import {SettingsCommand} from "./disc/commands/SettingsCommand";
import Keyv = require("keyv");

type HersanaConstants =
    | "DEVELOPER_SNOWFLAKE"
    | "INTERNAL_CONFIG_RESOURCE_PATH"
    | "KEYV_SQLITE_PATH";

export class Hersana {

    static CONSTANTS: Record<HersanaConstants, string> = {
        DEVELOPER_SNOWFLAKE: "697045706988322826",
        INTERNAL_CONFIG_RESOURCE_PATH: "./resources/internal.config.json",
        KEYV_SQLITE_PATH: "sqlite://resources/store/database.sqlite"
    }

    private static instance: Hersana;

    readonly internalConf = new Config(Hersana.CONSTANTS.INTERNAL_CONFIG_RESOURCE_PATH, "JSON");
    readonly keyv = new Keyv(Hersana.CONSTANTS.KEYV_SQLITE_PATH);

    private readonly discord: DiscordClient;

    constructor() {
        // Initialize Discord.js
        let client: DiscordClient = this.discord = new DiscordClient({intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_TYPING ]});

        // Register all the client's events to static functions.
        client.on("ready", () => {
            client.user?.setStatus("dnd");
            client.user?.setActivity("VALORANT", { type: ActivityTypes.STREAMING })
        });

        // Login to Discord...
        client.login(this.internalConf.getNested("discord_token")).then(async () => {
            Logger.info("Discord Client is " + Color.CONSTANTS.BOLD + "ACTIVE" + Color.CONSTANTS.RESET + ". (discord.js@v13.7.0)");

            // Initialize CommandHandler & Register all commands... (Make sure that you register all commands before initializing CommandHandler through .getInstance())
            CommandHandler.register(new SettingsCommand());

            CommandHandler.getInstance();

            // Register EventHandler events under Discord client...
            client.on("messageCreate", EventHandler.messageCreate);
            client.on("interactionCreate", EventHandler.interactionCreate);
        }).catch(() => {
            // Error Case: INVALID_TOKEN_PROVIDED

            Logger.error("Whoops! An error occurred while attempting to login to Discord client... (INVALID_TOKEN_PROVIDED)")
            Logger.error("To modify the application's stored token, navigate to resources/internal.config.json.")
            Logger.error("Having issues? Contact a Project Contributor @ contact@ijyrs.com")
        })
    }

    getDiscord(): DiscordClient {
        return this.discord;
    }

    static getInstance(): Hersana {
        if(Hersana.instance === undefined) {
            Hersana.instance = new Hersana();
        }

        return Hersana.instance;
    }

}