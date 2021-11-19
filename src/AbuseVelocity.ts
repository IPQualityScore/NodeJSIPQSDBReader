import * as Binary from './BinaryOption';

export default class AbuseVelocity {
    public raw: number = 0;
    
    constructor(b: Binary.Bitmask){
        if(b.has(Binary.AbuseVelocityTwo)){
            if(b.has(Binary.AbuseVelocityOne)){
                this.raw = 3;
                return;
            }
    
            this.raw = 1;
            return;
        }
    
        if(b.has(Binary.AbuseVelocityOne)){
            this.raw = 2;
        }
    }
}