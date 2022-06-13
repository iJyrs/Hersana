import Color, { Color as CC } from "./Color";

export class Logger {

    static setTerminalTitle(title: string) {
        // Does not support "Color".
        process.stdout.write(String.fromCharCode(27) + "]0;" + title + String.fromCharCode(7));
    }

    private static _log(prefix: string, message: String, prefixColor?: CC, messageColor?: CC) {
        prefixColor === undefined ? prefixColor = Color.YELLOW : undefined;
        messageColor === undefined ? messageColor = Color.GRAY : undefined;

        console.log(Color.RESET+"["+Date.now()+"] "+prefixColor+"[APP / "+prefix+"] "+Color.RESET+messageColor+message+Color.RESET);
    }

    static info(message: string, messageColor?: CC) {
        Logger._log("INFO", message, Color.GOLD, messageColor);
    }

    static warning(message: string) {
        Logger._log("WARNING", message, Color.YELLOW);
    }

    static debug(fn: string, message: string) {
        Logger._log("DEBUG", "["+fn+"] "+message, Color.PURPLE, Color.PURPLE);
    }

    static error(message: string) {
        Logger._log("ERROR", message, Color.RED, Color.RED);
    }

}