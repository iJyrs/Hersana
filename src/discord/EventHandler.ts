import {Client, Interaction, Message} from "discord.js";
import {Hersana} from "../Hersana";
import {Logger} from "../utils/system/Logger";
import Color from "../utils/system/Color";
import {CommandManager} from "./etc/CommandManager";
import {Command, CommandExecutionResponse} from "./command/Command";
import {Session} from "../session/Session";
import {SessionManager} from "../session/SessionManager";
import {ActionManager} from "./etc/ActionManager";

export class EventHandler {

    static ready() {
        const client: Client = Hersana.getInstance().discord;

        client.user.setPresence({
            status: "dnd",
            activities: [
                { name: "asana@v0.18.14", type: "PLAYING" }
            ]
        });

        Logger.info("Discord Client is "+Color.BOLD+"READY"+Color.RESET+". (discord.js@v13.7.0)");
    }

    static async interactionCreate(action: Interaction) {
        if(action.isCommand()) {
            let command: Command|undefined = CommandManager.getInstance().search(action.commandName);

            if(command !== undefined) {
                if (!command.options?.sessionRequired) {
                    command.execute(action);

                    return;
                }

                let session: Session = SessionManager.getInstance().search(action.user.id);
                session === undefined ? session = await SessionManager.getInstance().open(action.user) : undefined;

                // @ts-ignore (Getting on my nerves >:( )
                let response: CommandExecutionResponse = command.execute(action, session);

                if (!response?.deferSessionClose) {
                    await session.close();
                }
            }
        }

        if(action.isButton()) {
            ActionManager.getInstance().execute(parseInt(action.customId), action);
        }
    }

    static async messageCreate(message: Message) {

    }

}