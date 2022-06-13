import { User } from "discord.js";
import { Hersana } from "../Hersana";
import { Logger } from "../utils/system/Logger";
import { SessionManager } from "./SessionManager";
import { Client as Asana } from "asana";

export class Session {

    readonly user: User;

    // @ts-ignore
    private _asana: string;

    private _modified: boolean = false;

    constructor(user: User, data?: any) {
        this.user = user;

        data?.asana !== undefined ? this._asana = data.asana : undefined;
    }

    getAsana(): Promise<Asana> {
        return new Promise((resolve, reject) => {
            if(this._asana !== undefined) {
                let asana: Asana = Asana.create().useAccessToken(this._asana);

                asana.users.me().then(() => {
                    resolve(asana);
                }).catch(() => {
                    reject();
                })
            }else reject();
        });
    }

    setAsanaToken(v: string): Promise<void> {
        return new Promise((resolve, reject) => {
            let asana: Asana = Asana.create().useAccessToken(v);

            asana.users.me().then(() => {
                this._asana = v;
                this._modified = true;

                resolve();
            }).catch(() => {
                reject();
            })
        });
    }

    save() {
        Logger.debug("Session.ts", "Session Save: "+this.user.id);

        let promise = Hersana.getInstance().keyv.set(this.user.id, {
            _asana: this._asana
        });

        promise.catch(() => Logger.warning("An error occurred while attempting to save \""+this.user.id+"\"'s data..."));
        return promise;
    }

    async close(): Promise<boolean> {
        if(this._modified) {
            Logger.debug("Session.ts", "Session data has been modified... Saving into database.")

            return (await this.save()) ? SessionManager.getInstance().close(this.user) : false;
        }

        return SessionManager.getInstance().close(this.user);
    }

}