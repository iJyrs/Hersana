const moment = require("moment");
import Color from "./Color";

export default class Logger {

    static setTerminalTitle(title: string) {
        // Does not support "Color".
        process.stdout.write(String.fromCharCode(27) + "]0;" + title + String.fromCharCode(7));
    }

    private static log(prefix: string, message: String, prefixColor?: Color, messageColor?: Color) {
        // [MMDD-hhmm-ss] [PREFIX] MESSAGE

        prefixColor === undefined ? prefixColor = Color.CONSTANTS.YELLOW : undefined;
        messageColor === undefined ? messageColor = Color.CONSTANTS.GRAY : undefined;

        let dateFormatted: string = moment().format("MMDD-hhmm-ss");

        console.log(Color.CONSTANTS.RESET+"["+dateFormatted+"] "+prefixColor+"[APP / "+prefix+"] "+Color.CONSTANTS.RESET+messageColor+message+Color.CONSTANTS.RESET);
    }

    public static info(message: string, messageColor?: Color) {
        Logger.log("INFO", message, Color.CONSTANTS.GOLD, messageColor);
    }

    public static warning(message: string) {
        Logger.log("WARNING", message, Color.CONSTANTS.YELLOW);
    }

    public static error(message: string) {
        Logger.log("ERROR", message, Color.CONSTANTS.RED, Color.CONSTANTS.DARK_RED);
    }

    /**
     * @deprecated
     *
     * Deprecated for console cleanliness.
     */
    public static discord(message: string) {
        Logger.log("DISCORD", message, Color.CONSTANTS.GOLD);
    }

    /**
     * @deprecated
     *
     * Deprecated for console cleanliness.
     */
    public static asana(message: string, messageColor?: Color) {
        Logger.log("ASANA", message, Color.CONSTANTS.GOLD, messageColor);
    }

}