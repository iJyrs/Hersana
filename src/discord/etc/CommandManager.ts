import { REST } from "@discordjs/rest";
import { Command } from "../command/Command";
import { Logger } from "../../utils/system/Logger";
import { Routes } from "discord-api-types/v10";
import {Hersana} from "../../Hersana";
import {SettingsCommand} from "../command/SettingsCommand";

/**
 * @Singleton
 *
 * Designated Instance Initialization (DII): Hersana.ts
 */
export class CommandManager {

    private static instance: CommandManager;

    /**
     * Where all registered commands are stored.
     *
     * @protected
     */
    protected readonly cache: Map<string, Command> = new Map();

    private constructor() {
        /** [===================] REGISTER COMMANDS [==================]  */

        this.registerCommand(new SettingsCommand());

        /** [===========================================================] */

        const rest = new REST({ version: "10" }).setToken(Hersana.CONSTANTS.DISCORD_CLIENT_TOKEN);

        let cmdArr: Command[] = Array.from(this.cache.values());
        let str = "";

        for(let i = 0; i < cmdArr.length; i++) {
            if(i !== cmdArr.length - 1) {
                str+="/"+cmdArr[i].name+", ";
            }else str+="/"+cmdArr[i].name;
        }

        Logger.info("Registering Commands... ("+str+")");

        /** FIXME: For Production remove Guild Only Commands. */
        rest.put(Routes.applicationGuildCommands("981073935942684704", "947880925633601577"), { body: Command.exportArray(cmdArr) }).then();
    }

    registerCommand(command: Command): boolean {
        if(!this.cache.has(command.name.toLowerCase())) {
            this.cache.set(command.name.toLowerCase(), command);

            return true;
        }

        return false;
    }

    search(name: string): Command|undefined {
        return this.cache.get(name.toLowerCase());
    }

    unregisterCommand(command: Command): boolean {
        if(this.cache.has(command.name.toLowerCase())) {
            this.cache.delete(command.name.toLowerCase());

            return true;
        }

        return false;
    }

    static getInstance(): CommandManager {
        if(CommandManager.instance === undefined) {
            CommandManager.instance = new CommandManager();
        }

        return CommandManager.instance;
    }

}