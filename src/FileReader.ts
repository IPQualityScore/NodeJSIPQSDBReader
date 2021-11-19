import * as Binary from "./BinaryOption";
import IPQSRecord from "./IPQSRecord";
import Column from "./Column";

export default class FileReader {
    public fileHandler?: number;
    public fileError: NodeJS.ErrnoException|Error|null = null;

    public binaryData?: Binary.Bitmask;
    public blacklistFile: boolean = false;
    public valid: boolean = false;
    public IPv6: boolean = false;

    public treeEnd: number = 0;
    public treeStart: number = 0;
    public recordBytes: number = 0;
    public totalBytes: number = 0;
    
    public columns: Column[] = [];

    public static readonly TREE_PREFIX_BYTES = 5;
    private completesetup?: (value: boolean | PromiseLike<boolean>) => void;
    private failsetup?: (reason?: any) => void;
    public ready: Promise<boolean> = new Promise((resolve, reject) => {
        this.completesetup = resolve;
        this.failsetup = reject;
    });

    public setup(error: string|null = null){
        if(error !== null){
            this.fileError = new Error(error);
        }

        if(this.fileError !== null){
            if(this.failsetup !== undefined){
                this.failsetup(this.fileError);
            }
        }

        if(this.fileHandler !== undefined){
            if(this.completesetup !== undefined){
                this.completesetup(true);
            }
        }
    }

    public fetch(ip: string): IPQSRecord {
        let record = new IPQSRecord(this);

        if(this.IPv6 === true && ip.includes(".") === true){
            record.recordError = new Error("Attemtped to look up IPv4 using IPv6 database file. Aborting.");
        } else if(this.IPv6 === false && ip.includes(":") === true){
            record.recordError = new Error("Attemtped to look up IPv6 using IPv4 database file. Aborting.");
        }

        if(record.recordError === null){
            record.fetch(ip);
        }
        
        return record;
    }
}