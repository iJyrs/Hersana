import { Interaction, Message } from "discord.js";
import { Hersana } from "../Hersana";
import { CommandHandler } from "./CommandHandler";
import { MessageUtils } from "../utils/MessageUtils";

export class EventHandler {

    /**
     * For a message to be sent to Asana. It must hinder under this logic:
     *  - Must originate from a "Targeted Channel". (Specified under "config.yml")
     */
    static async messageCreate(message: Message) {
        if(!message.author.bot) {
            let tc: any = await Hersana.getInstance().keyv.get("tcs");

            if (tc === undefined) tc = [];

            for (let i = 0; i < tc.length; i++) {
                // Cannot use a strict comparison because channel.id is type String and tc[i] is type Number.
                if (tc[i] == message.channel.id) {
                    // Apply Some simple parsing to the message. You can separate each part of the message with |.
                    let msgArr: string[] = message.content.split("|");

                    // The first index of the msgArr is always the content of the task.
                    // Remove the first index, so we can loop through the rest of the indexes.
                    let taskContent: any = msgArr.shift();

                    for (let i = 0; i < msgArr.length; i++) {
                        /**
                         * Different types of content we could accept is as listed.
                         *  - Dates (Format: MM-DD-YY / MM-DD) [Ex. 08-24-2004, 08-24, August 24th, 2004, August 24th]
                         */

                        // TODO: Accept Dates In Task.
                    }

                    // Log the task into Asana.
                    // TODO: Actually Log the task into Asana.
                    let data = await Hersana.getInstance().keyv.get(message.author.id)

                    if(data !== undefined) {

                    }
                }
            }
        }
    }

    static async interactionCreate(interaction: Interaction) {
        if(interaction.isCommand()) {
            let command = CommandHandler.cache.get(interaction.commandName);

            if(command !== undefined) {
                if(command.options.asanaEnabled) {
                    if(await Hersana.getInstance().keyv.has(interaction.user.id)) {
                        let userData = await Hersana.getInstance().keyv.get(interaction.user.id);

                        if(userData.asana !== undefined && userData.asana !== null) {
                            return command.execute(interaction, userData);
                        }
                    }

                    return await interaction.reply({ embeds: [ MessageUtils.DEFAULTS.ASANA_NOT_ENABLED ] });
                }

                return command.execute(interaction);
            }
        }

        if(interaction.isButton()) {
            let iN = interaction.customId;

            let [cmd, index] = iN.split(".");

            let command = CommandHandler.cache.get(cmd);

            if(command !== undefined) {
               // await command.execInteractionCallback(index, interaction);
            }
        }
    }

}