import * as YAML from "yaml";
import * as fs from "fs";
import * as path from "path"
const JSON_FORMAT = require("json-format");

type ConfigStructure =
    | "YML"
    | "YAML"
    | "JSON";

export default class Config {

    public static ABS_DIR_PATH: string;

    public object: any = Object.create(null);

    private readonly abs_path: string;
    private readonly structure: ConfigStructure;

    constructor(abs_path: string, structure: ConfigStructure = "JSON", async: boolean = false, callback?: Function) {
        this.abs_path = path.join(Config.ABS_DIR_PATH, abs_path);
        this.structure = structure;

        let err = this.reload(async, callback);
        if(err)throw err;
    }

    public reload(async: boolean = false, callback?: Function) {
        const init_obj_props = (data: any) => {
            let props = Object.getOwnPropertyNames(data);

            for(let i = 0; i < props.length; i++) {
                Object.defineProperty(this.object, props[i], {
                    value: data[props[i]],
                    enumerable: true,
                    writable: false
                });
            }

            async ? callback !== undefined ? callback() : undefined : undefined;
        }

        if(!async) {
            let data: any;

            try {
                data = fs.readFileSync(this.abs_path, "utf-8");
            }catch (err: any) {
                return "FILE_NOT_FOUND";
            }

            try {
                init_obj_props(this.structure === "JSON" ? JSON.parse(data) : YAML.parse(data))
            }catch (err) {
                return "INVALID_DATA_STRUCTURE";
            }
        }else {
            fs.readFile(this.abs_path, "utf-8", (err: any, data: any) => {
                if (!err) {
                    try {
                        init_obj_props(JSON.parse(data));
                    } catch (dupe_err: any) {
                        callback !== undefined ? callback("INVALID_DATA_STRUCTURE") : undefined;
                    }
                } else callback !== undefined ? callback("FILE_NOT_FOUND") : undefined;
            })
        }
    }

    set(key: string, value: any) {
        this.object = Object.create(this.object)[key] = value;

        this.save();
    }

    /**
     * @deprecated
     * TODO: Fix This Function
     *
     * @param key
     * @param value
     */
    setNested(key: string, value: any) {
        let c_obj = Object.create(this.object);
        let keyArr = key.split(".");

        let proj_nest = Object.create(null)
        for(let i = 0; i < keyArr.length - 1; i++) {
            if(proj_nest === undefined)return false;

            proj_nest = i === 0 ? c_obj[keyArr[i]] : proj_nest[keyArr[i]];
        }

        proj_nest[keyArr[keyArr.length - 1]] = value;

        this.save();
    }

    get(key: string) {
        return Object.create(this.object)[key]
    }

    getNested(key: string): any|boolean {
        let c_obj = Object.create(this.object);
        let keyArr = key.split(".");

        let value = Object.create(null);
        for(let i = 0; i < keyArr.length; i++) {
            if(value === undefined)return false;

            value = i === 0 ? c_obj[keyArr[i]] : value[keyArr[i]];
        }

        return value === undefined ? false : value;
    }

    save(async: boolean = false, callback?: Function) {
        let str = this.structure === "JSON" ? JSON_FORMAT(this.object, {type: "space", size: 2}) : YAML.stringify(this.object);

        if(!async) {
            try {
                fs.writeFileSync(this.abs_path, str);
            }catch (err: any) {
                return false;
            }
        }else {
            fs.writeFile(this.abs_path, str, (err: any) => {
                err !== undefined ? callback !== undefined ? callback(false) : undefined : callback !== undefined ? callback(true) : undefined;
            })
        }

        return true;
    }

}