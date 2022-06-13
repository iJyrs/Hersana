import {Command, CommandExecutionResponse} from "./Command";
import { Interaction } from "discord.js";
import { Session } from "../../session/Session";
import { Client as Asana } from "asana";

export class SettingsCommand extends Command {

    constructor() {
        super("settings", "Manage your settings!", {
            sessionRequired: true
        });
    }

    execute(action: Interaction, session?: Session): CommandExecutionResponse {
        if(action.isCommand()) {
            session.getAsana().then(() => {
                action.reply("Asana!!!").then();
            }).catch(() => {
                action.reply("No Asana Linked or Invalid Asana Token").then();
            })
        }

        return {
            deferSessionClose: true
        }
    }

}