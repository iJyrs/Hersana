import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction, MessageEmbed } from "discord.js";
import {ActionCache} from "../etc/ActionCache";

interface CommandOptions {
    asanaEnabled: boolean
}

export abstract class Command {

    name: string;
    description: string;
    options: CommandOptions;

    private _cachedExport?: SlashCommandBuilder;
    protected readonly actionCache: ActionCache = new ActionCache();

    protected constructor(name: string, description: string, options: CommandOptions = { asanaEnabled: false }) {
        this.name = name;
        this.description = description;
        this.options = options;
    }

    abstract execute(interaction: Interaction, userData?: any): any;

    static generateErrorEmbed(message: string) {
        return new MessageEmbed()
            .setColor('#c70d0d')
            .setTitle('Hersana • Error')
            .setDescription(message)
            .setFooter({text: "© 2022 Meturum Solutions LLC"})
    }

    render(): SlashCommandBuilder {
        if(this._cachedExport === undefined) {
            this._cachedExport = new SlashCommandBuilder()
                .setName(this.name)
                .setDescription(this.description);
        }

        return this._cachedExport;
    }

    static renderArray(commands: Command[]) {
        let cmdArr: SlashCommandBuilder[] = [];

        for(let i = 0; i < commands.length; i++) {
            cmdArr.push(commands[i].render());
        }

        return cmdArr;
    }

    static renderArraySpread(...commands: Command[]) {
        return this.renderArray(commands);
    }

    export(): any {
        return this.render().toJSON();
    }

    static exportArray(commands: Command[]) {
        let exportedArr: any[] = [];
        let arr: SlashCommandBuilder[] = this.renderArray(commands);

        for(let i = 0; i < arr.length; i++) {
            exportedArr.push(arr[i].toJSON());
        }

        return exportedArr;
    }

    static exportArraySpread(...commands: Command[]) {
        return this.exportArray(commands);
    }

}