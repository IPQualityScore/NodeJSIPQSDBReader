export class Bitmask {
    public data: number;

    constructor(data: number){
        this.data = data;
    }

    public has(flag: number): boolean {
        return (this.data&flag) !== 0;
    }
}

export const IsProxy = 1;
export const IsVPN = 2;
export const IsTOR = 4;
export const IsCrawler = 8;
export const IsBot = 16;
export const RecentAbuse = 32;
export const IsBlacklisted = 64;
export const IsPrivate = 128;

export const IsMobile = 1;
export const HasOpenPorts = 2;
export const IsHostingProvider = 4;
export const ActiveVPN = 8;
export const ActiveTOR = 16;
export const PublicAccessPoint = 32;
export const ReservedOne = 64;
export const ReservedTwo = 128;

export const ReservedThree = 1;
export const ReservedFour = 2;
export const ReservedFive = 4;
export const ConnectionTypeOne = 8;
export const ConnectionTypeTwo = 16;
export const ConnectionTypeThree = 32;
export const AbuseVelocityOne = 64;
export const AbuseVelocityTwo = 128;

export const IPv4Map = 1;
export const IPv6Map = 2;
export const IsBlacklistFile = 4;
// 8 - 64 reserved
export const BinaryData = 128;

// 1 - 2 reserved
export const TreeData = 4;
export const StringData = 8;
export const SmallIntData = 16;
export const IntData = 32;
export const FloatData = 64;
// 128 reserved.