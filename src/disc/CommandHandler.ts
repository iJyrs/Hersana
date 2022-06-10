import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v10";
import {Hersana} from "../Hersana";
import { Command } from "./commands/Command";
import Logger from "../utils/Logger";

export class CommandHandler {

    private static instance: CommandHandler;

    static readonly cache: Map<string, Command> = new Map();

    constructor() {
        const rest = new REST({ version: "10" }).setToken(Hersana.getInstance().internalConf.getNested("discord_token"));

        let cmdArr: Command[] = Array.from(CommandHandler.cache.values());
        let str = "";

        for(let i = 0; i < cmdArr.length; i++) {
            if(i !== cmdArr.length - 1) {
                str+="/"+cmdArr[i].name+", ";
            }else str+="/"+cmdArr[i].name;
        }

        Logger.info("Registering Commands... ("+str+")");

        /** TODO: For Production remove Guild Only Commands. */
        rest.put(Routes.applicationGuildCommands("981073935942684704", "947880925633601577"), { body: Command.exportArray(cmdArr) }).then();
    }

    static register(command: Command) {
        if(!CommandHandler.cache.has(command.name)) {
            CommandHandler.cache.set(command.name, command);
        }
    }

    static getInstance(): CommandHandler {
        if(CommandHandler.instance === undefined) {
            CommandHandler.instance = new CommandHandler();
        }

        return CommandHandler.instance;
    }

}