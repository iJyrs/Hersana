import { Session } from "./Session";
import { User } from "discord.js";
import {Hersana} from "../Hersana";
import {Logger} from "../utils/system/Logger";

/**
 * @Singleton
 *
 * Designated Instance Initialization (DII): Hersana.ts
 */
export class SessionManager {

    private static instance: SessionManager;

    private readonly cache: Map<string, Session> = new Map();

    private constructor() { }

    async open(user: User): Promise<Session> {
        if(!this.cache.has(user.id)) {
            let session: Session;
            let data: any = await Hersana.getInstance().keyv.get(user.id);

            session = data !== undefined ? new Session(user, data) : new Session(user);

            this.cache.set(user.id, session);

            Logger.debug("SessionManager.ts", "Session Opened: "+user.id);
            return session;
        }

        return undefined;
    }

    search(id: string): Session {
        return this.cache.get(id);
    }

    close(user: User): boolean {
        if(this.cache.has(user.id)) {
            this.cache.delete(user.id);

            Logger.debug("SessionManager.ts", "Session Closed: "+user.id);
            return true;
        }

        return false;
    }

    static getInstance() {
        if(SessionManager.instance === undefined) {
            SessionManager.instance = new SessionManager();
        }

        return SessionManager.instance;
    }

}