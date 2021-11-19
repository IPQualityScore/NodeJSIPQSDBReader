import * as Binary from "./BinaryOption";

export default class Column {
    public name: string;
    public type: Binary.Bitmask;
    public rawValue: string = "";
    
    constructor(name: string, type: Binary.Bitmask, raw: string = ""){
        this.name = name;
        this.type = type;
        this.rawValue = raw;
    }
}