export default class Utility {
    public static uVarInt(bytes: number[]){
        let x = 0;
        let s = 0;
        for(let i = 0; i < bytes.length; i++){
            let b = bytes[i];
            if(b < 0x80) {
                return x | b<<s;
            }

            x |= b&0x7f << s;
            s += 7;
        }

        return 0;
    }
}