import * as Binary from './BinaryOption';

export default class ConnectionType {
    public raw: number = 0;
    
    constructor(b: Binary.Bitmask){
        if(b.has(Binary.ConnectionTypeThree)){
            if(b.has(Binary.ConnectionTypeTwo)){
                this.raw = 3;
                return;
            }

            if(b.has(Binary.ConnectionTypeOne)){
                this.raw = 5;
                return;
            }

            this.raw = 1;
            return;
        }

        if(b.has(Binary.ConnectionTypeTwo)){
            this.raw = 2;
            return;
        }

        if(b.has(Binary.ConnectionTypeOne)){
            this.raw = 4;
            return;
        }
    }
}