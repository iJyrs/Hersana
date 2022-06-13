import { SlashCommandBuilder } from "@discordjs/builders";
import { ActionManager } from "../etc/ActionManager";
import { Interaction } from "discord.js";
import { Session } from "../../session/Session";

export abstract class Command {

    name: string;
    description: string;
    options: CommandOptions;

    private _cachedExport?: SlashCommandBuilder;

    protected constructor(name: string, description: string, options?: CommandOptions) {
        this.name = name;
        this.description = description;
        this.options = options;
    }

    abstract execute(action: Interaction, session?: Session): CommandExecutionResponse|void;

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

type CommandOptions = {
    sessionRequired?: boolean
    asanaRequired?: boolean
}

export type CommandExecutionResponse = {
    deferSessionClose?: boolean
}