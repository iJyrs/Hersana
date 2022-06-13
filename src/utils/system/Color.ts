type ColorString =
    | "ESCAPE"
    | "RESET"

    | "BLACK"
    | "DARK_BLUE"
    | "DARK_GREEN"
    | "DARK_AQUA"
    | "GOLD"
    | "GRAY"
    | "DARK_GRAY"
    | "BLUE"
    | "GREEN"
    | "AQUA"
    | "RED"
    | "PURPLE"
    | "YELLOW"
    | "WHITE"

    | "BOLD"
    | "STRIKETHROUGH"
    | "UNDERLINE"
    | "ITALIC";

export class Color {

    static readonly CONSTANTS: Record<ColorString, Color> = {
        ESCAPE: new Color(),
        RESET: new Color("0m"),

        BLACK: new Color("30m"),
        DARK_BLUE: new Color("34m"),
        DARK_GREEN: new Color("32m"),
        DARK_AQUA: new Color("36m"),
        GOLD: new Color("33m"),
        GRAY: new Color("37m"),
        DARK_GRAY: new Color("30;1m"),
        BLUE: new Color("34;1m"),
        GREEN: new Color("32;1m"),
        AQUA: new Color("36;1m"),
        RED: new Color("31m"),
        PURPLE: new Color("35m"),
        YELLOW: new Color("33;1m"),
        WHITE: new Color("37;1m"),

        BOLD: new Color("1m"),
        STRIKETHROUGH: new Color("9m"),
        UNDERLINE: new Color("4m"),
        ITALIC: new Color("3m")
    }

    private readonly _escCode: string;

    protected constructor(escCode?: string) {
        escCode !== undefined ? this._escCode = "\u001b["+escCode : this._escCode = "\u001b";
    }

    toString() {
        return this._escCode;
    }

}

export default Color.CONSTANTS;