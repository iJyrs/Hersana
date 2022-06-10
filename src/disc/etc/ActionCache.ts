import { Interaction } from "discord.js";

interface ActionCallback {
    (interaction: Interaction): void;
}

export class ActionCache {

    private iterator = 0;
    private actionCache: Map<number, ActionCallback> = new Map();

    submit(callback: ActionCallback, timeout: number = 5000): number {
        let iN: number = this.iterator+=1;

        this.actionCache.set(iN, callback);

        setTimeout(() => {
            this.remove(iN);
        }, timeout)

        return iN;
    }

    async execute(index: number, interaction: Interaction) {
        if(this.actionCache.has(index)) {
            let callback: ActionCallback|undefined = await this.actionCache.get(index);

            if(callback !== undefined) {
                await callback(interaction);

                this.remove(index)
            }
        }
    }

    remove(index: number) {
        if(this.actionCache.has(index)) {
            this.actionCache.delete(index);
        }
    }

}