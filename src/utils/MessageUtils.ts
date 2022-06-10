import {Command} from "../disc/commands/Command";
import {GuildEmoji, MessageEmbed} from "discord.js";
import {Hersana} from "../Hersana";

type MessageDefaults =
    | "ASANA_NOT_ENABLED"

export class MessageUtils {

    static readonly DEFAULTS: Record<MessageDefaults, MessageEmbed> = {
        ASANA_NOT_ENABLED: Command.generateErrorEmbed("**"+"<:rarrow:734880402673762387>"+" Whoops! Looks like you don't have your Asana account connected to Hersana!**\n\n*You can link your account using `/settings link` and following the directions listed!*"),
    }

    static EMOJIFY(name: string) {
        let emoji: GuildEmoji|undefined = Hersana.getInstance().getDiscord().emojis.cache.find(e => e.name === name);

        if(emoji !== undefined) {
            return "<:" + emoji.name + ":" + emoji.id + ">";
        }

        return "";
    }

}