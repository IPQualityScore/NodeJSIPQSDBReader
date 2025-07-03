import FileReader from "./FileReader";
import * as Binary from "./BinaryOption";
import AbuseVelocity from "./AbuseVelocity";
import ConnectionType from "./ConnectionType";
import FraudScore from "./FraudScore";
import Column from "./Column";

export default class IPQSRecord {
  public isProxy: boolean = false;
  public isVPN: boolean = false;
  public isTOR: boolean = false;
  public isCrawler: boolean = false;
  public isBot: boolean = false;
  public recentAbuse: boolean = false;
  public isBlacklisted: boolean = false;
  public isPrivate: boolean = false;
  public isMobile: boolean = false;
  public hasOpenPorts: boolean = false;
  public isHostingProvider: boolean = false;
  public activeVPN: boolean = false;
  public activeTOR: boolean = false;
  public publicAccessPoint: boolean = false;

  public connectionType: ConnectionType | null = null;
  public abuseVelocity: AbuseVelocity | null = null;

  public country: string | null = null;
  public city: string | null = null;
  public region: string | null = null;
  public ISP: string | null = null;
  public organization: string | null = null;
  public ASN: number | null = null;
  public timezone: string | null = null;
  public latitude: number | null = null;
  public longitude: number | null = null;

  public fraudScore: FraudScore | null = null;

  public columns: Column[] = [];

  public static readonly TREE_BYTES = 8;
  public valid: boolean = false;
  public file: FileReader;

  constructor(file: FileReader) {
    this.file = file;
  }

  private position: number = 0;
  private literal: string = "";
  private file_position: number = 0;
  private previous: { [key: number]: number } = {};

  public async fetch(ip: string) {
    this.position = 0;
    this.previous = {};
    this.file_position = this.file.treeStart + FileReader.TREE_PREFIX_BYTES;
    this.literal = this.convertIPToLitteral(this.file.IPv6, ip);
    return await this.populateRecord(0);
  }

  private async populateRecord(iterations: number): Promise<any> {
    if (iterations > 256) {
      throw new Error(
        "Invalid or nonexistent IP address specified for lookup. (EID: 15)"
      );
    }

    if (this.file.fileHandler === undefined) {
      throw new Error("Invalid or nonexistant file pointer. EID 7");
    }

    this.previous[this.position] = this.file_position;
    if (this.literal.length <= this.position) {
      throw new Error(
        "Invalid or nonexistent IP address specified for lookup. (EID: 8)"
      );
    }

    try {
      let read = Buffer.alloc(IPQSRecord.TREE_BYTES);
      await this.file.fileHandler.read(
        read,
        0, // offset in the buffer to start reading
        IPQSRecord.TREE_BYTES, // number of bytes to read
        this.file_position // position in the file to start reading from
      );

      if (this.literal[this.position] === "0") {
        this.file_position = read.readUInt32LE(0);
      } else {
        this.file_position = read.readUInt32LE(4);
      }

      if (this.file.blacklistFile === false) {
        if (this.file_position === 0) {
          for (let i = 0; i <= this.position; i++) {
            if (this.literal[this.position - i] === "1") {
              let bf = this.literal.split("");
              bf[this.position - i] = "0";

              for (let n = this.position - i + 1; n < bf.length; n++) {
                bf[n] = "1";
              }

              this.literal = bf.join("");
              this.position = this.position - i;
              this.file_position = this.previous[this.position];
              break;
            }
          }

          return this.populateRecord(iterations + 1);
        }
      }

      if (this.file_position < this.file.treeEnd) {
        if (this.file_position === 0) {
          throw new Error(
            "Invalid or nonexistent IP address specified for lookup. (EID: 12)"
          );
        }

        this.position++;
        return this.populateRecord(iterations + 1);
      }

      if (this.file.fileHandler === undefined) {
        throw new Error("Invalid or nonexistant file pointer. EID 7");
      }

      let raw = Buffer.alloc(this.file.recordBytes);
      const { bytesRead } = await this.file.fileHandler.read(
        raw,
        0, // offset in the buffer to start reading
        this.file.recordBytes, // number of bytes to read
        this.file_position // position in the file to start reading from
      );

      if (bytesRead === 0) {
        throw new Error("Invalid or nonexistant file pointer. EID 7");
      }

      return await this.parseRecord(raw);
    } catch (err: any) {
      throw err;
    }
  }

  private async parseRecord(raw: Buffer) {
    let current_byte = 0;
    if (this.file.binaryData === undefined) {
      throw new Error("Invalid or nonexistant file. EID 11");
    }

    if (this.file.binaryData.has(Binary.BinaryData)) {
      this.processFirstByte(new Binary.Bitmask(raw[0]));
      this.processSecondByte(new Binary.Bitmask(raw[1]));

      let third = new Binary.Bitmask(raw[2]);
      this.connectionType = new ConnectionType(third);
      this.abuseVelocity = new AbuseVelocity(third);

      current_byte = 3;
    } else {
      let first = new Binary.Bitmask(raw[0]);
      this.connectionType = new ConnectionType(first);
      this.abuseVelocity = new AbuseVelocity(first);

      current_byte = 1;
    }

    this.fraudScore = new FraudScore();

    for (let i = 0; i < this.file.columns.length; i++) {
      let c = this.file.columns[i];

      if (c === undefined) {
        throw new Error(
          "Invalid or nonexistent IP address specified for lookup. (EID: 12)"
        );
      }

      let value: string = "";
      switch (c.name) {
        case "ASN":
          this.ASN = raw.readUInt32LE(current_byte);
          value = this.ASN?.toString();

          current_byte += 4;
          break;
        case "Latitude":
          this.latitude = raw.readFloatLE(current_byte);
          value = this.latitude.toString();

          current_byte += 4;
          break;
        case "Longitude":
          this.longitude = raw.readFloatLE(current_byte);
          value = this.longitude.toString();

          current_byte += 4;
          break;
        case "ZeroFraudScore":
          this.fraudScore.setFraudScore(0, raw.readUInt8(current_byte));
          value = this.fraudScore.getFraudScore(0).toString();

          current_byte++;
          break;
        case "OneFraudScore":
          this.fraudScore.setFraudScore(1, raw.readUInt8(current_byte));
          value = this.fraudScore.getFraudScore(1).toString();

          current_byte++;
          break;
        default:
          if (c.type.has(Binary.StringData)) {
            const pos = raw.readUInt32LE(current_byte);

            if (!this.file.fileHandler) {
              throw new Error("Invalid or nonexistent file pointer. EID 13");
            }

            try {
              const sb = Buffer.alloc(1);
              const { bytesRead: bytesRead1 } =
                await this.file.fileHandler.read(sb, 0, 1, pos);

              if (bytesRead1 !== 1) {
                throw new Error("Failed to read string size byte. EID 13a");
              }

              const size = sb.readUInt8(0);

              if (size === 0) {
                throw new Error("Invalid or nonexistent file pointer. EID 14");
              }

              const vb = Buffer.alloc(size);
              const { bytesRead: bytesRead2 } =
                await this.file.fileHandler.read(vb, 0, size, pos + 1);

              if (bytesRead2 !== size) {
                throw new Error("Failed to read string value. EID 13b");
              }

              value = vb.toString();
              current_byte += 4;
            } catch (err: any) {
              throw new Error(`File read error: ${err.message}`);
            }
          }
          break;
      }

      this.columns.push(new Column(c.name, c.type, value));
      switch (c.name) {
        case "Country":
          this.country = value;
          break;
        case "City":
          this.city = value;
          break;
        case "Region":
          this.region = value;
          break;
        case "ISP":
          this.ISP = value;
          break;
        case "Organization":
          this.organization = value;
          break;
        case "Timezone":
          this.timezone = value;

          break;
      }
    }

    this.valid = true;

    this.position = 0;
    this.literal = "";
    this.previous = {};
    this.file_position = 0;

    return;
  }

  private processFirstByte(b: Binary.Bitmask) {
    if (b.has(Binary.IsProxy)) {
      this.isProxy = true;
    }

    if (b.has(Binary.IsVPN)) {
      this.isVPN = true;
    }

    if (b.has(Binary.IsTOR)) {
      this.isTOR = true;
    }

    if (b.has(Binary.IsCrawler)) {
      this.isCrawler = true;
    }

    if (b.has(Binary.IsBot)) {
      this.isBot = true;
    }

    if (b.has(Binary.RecentAbuse)) {
      this.recentAbuse = true;
    }

    if (b.has(Binary.IsBlacklisted)) {
      this.isBlacklisted = true;
    }

    if (b.has(Binary.IsPrivate)) {
      this.isPrivate = true;
    }
  }

  private processSecondByte(b: Binary.Bitmask) {
    if (b.has(Binary.IsMobile)) {
      this.isMobile = true;
    }

    if (b.has(Binary.HasOpenPorts)) {
      this.hasOpenPorts = true;
    }

    if (b.has(Binary.IsHostingProvider)) {
      this.isHostingProvider = true;
    }

    if (b.has(Binary.ActiveVPN)) {
      this.activeVPN = true;
    }

    if (b.has(Binary.ActiveTOR)) {
      this.activeTOR = true;
    }

    if (b.has(Binary.PublicAccessPoint)) {
      this.publicAccessPoint = true;
    }
  }

  private convertIPToLitteral(ipv6: boolean, ip: string): string {
    let result: string = "";

    if (ipv6) {
      let parts = this.expandIPv6(ip).split(":");
      for (let i = 0; i < parts.length; i++) {
        result = result + parseInt(parts[i], 16).toString(2).padStart(16, "0");
      }
    } else {
      let parts = ip.split(".");
      for (let i = 0; i < parts.length; i++) {
        result = result + parseInt(parts[i]).toString(2).padStart(8, "0");
      }
    }

    return result;
  }

  private expandIPv6(ip: string) {
    if (ip.indexOf("::") === -1) {
      return ip;
    }

    let length = 8;
    let result = "";

    let sides = ip.split("::");
    var groupsPresent = 0;
    for (var i = 0; i < sides.length; i++) {
      groupsPresent += sides[i].split(":").length;
    }

    let fullAddress = sides[0] + ":";
    for (var i = 0; i < length - groupsPresent; i++) {
      fullAddress += "0000:";
    }

    fullAddress += sides[1];

    let groups = fullAddress.split(":");
    for (var i = 0; i < length; i++) {
      while (groups[i].length < 4) {
        groups[i] = "0" + groups[i];
      }

      result += i != length - 1 ? groups[i] + ":" : groups[i];
    }

    return result;
  }
}
