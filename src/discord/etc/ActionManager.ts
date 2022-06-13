import { Interaction } from "discord.js";

/**
 * @Singleton
 *
 * Designated Instance Initialization (DII): UNKNOWN
 */
export class ActionManager {

    private static instance: ActionManager;

    private iterator: number = 0;
    private readonly cache: Map<number, ActionCallback> = new Map();

    private constructor() { }

    submitAction(callback: ActionCallback, timeout: number = 5000) {
        let index: number = this.iterator; this.iterator++;

        if(index > 5000 && !this.cache.has(1)) {
            this.iterator = 0; index = 0;
        }

        this.cache.set(index, callback);

        setTimeout(() => {
            this.timeoutAction(index);
        }, timeout);

        return index;
    }

    execute(index: number, action: Interaction) {
        if(this.cache.has(index)) {
            let callback: ActionCallback|undefined = this.cache.get(index);

            if(callback !== undefined) {
                callback(action)

                this.timeoutAction(index);
            }
        }
    }

    timeoutAction(index: number) {
        if(this.cache.has(index)) {
            this.cache.delete(index);
        }
    }

    static getInstance(): ActionManager {
        if(ActionManager.instance === undefined) {
            ActionManager.instance = new ActionManager();
        }

        return ActionManager.instance;
    }

}

interface ActionCallback {
    (action: Interaction): void;
}