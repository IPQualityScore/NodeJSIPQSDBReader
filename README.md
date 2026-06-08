# IPQualityScore IP Address Reputation & Proxy Detection Node JS / TypeScript DB Reader

## Flat File Version 2.0

The IPQS NodeJS DB reader allows you to read our flat file databases and get started implementing our proxy detection easily.

You can find the full [NodeJS IPQualityScore flat file database documentation here](https://www.ipqualityscore.com/documentation/ip-reputation-database/nodejs) or view a description of what our [proxy detection database does here](https://www.ipqualityscore.com/proxy-detection-database).

### Installation

Installation can be achieved via npm or via direct inclusion of the libraries provided.

```bash
npm install node_js_ipqs_db_reader
```

### Usage

Using our flat file database system to lookup an IP address is simple:

#### Quick Start Example

```javascript
const { DBReader } = require("./lib/index");

let db = await DBReader.Open("IPQualityScore-IP-Reputation-Database-IPv4.ipqs");
const record = await db.Fetch("8.8.0.0");
console.log(record.country);
```

#### Detailed Example

```javascript
const { DBReader } = require("./lib/index");
const dbFile = `${__dirname}/IPQualityScore-IP-Reputation-Database-IPv4.ipqs`;

async function main(ip) {
  console.log(ip);
  const db = await DBReader.Open(dbFile);
  const record = await db.Fetch(ip);

  // ── Basic reputation flags ──
  console.log(
    `  Fraud Score (lenient):  ${record.fraudScore.getFraudScore(0)}`,
  );
  console.log(
    `  Fraud Score (standard): ${record.fraudScore.getFraudScore(1)}`,
  );

  console.log(`  isProxy:       ${record.isProxy}`);
  console.log(`  isVPN:         ${record.isVPN}`);
  console.log(`  isTOR:         ${record.isTOR}`);
  console.log(`  isCrawler:     ${record.isCrawler}`);
  console.log(`  isBot:         ${record.isBot}`);
  console.log(`  recentAbuse:   ${record.recentAbuse}`);
  console.log(`  isBlacklisted: ${record.isBlacklisted}`);
  console.log(`  isPrivate:     ${record.isPrivate}`);
  console.log(`  isMobile:      ${record.isMobile}`);
  console.log(`  hasOpenPorts:  ${record.hasOpenPorts}`);
  console.log(`  isHosting:     ${record.isHostingProvider}`);
  console.log();

  // ── Connection type ──
  if (record.connectionType) {
    console.log(`  Connection Type: ${record.connectionType.toString()}`);
  }

  // ── Abuse velocity ──
  if (record.abuseVelocity) {
    console.log(`  Abuse Velocity:  ${record.abuseVelocity.toString()}`);
  }

  // ── Geolocation / ISP info ──
  console.log();
  console.log(`  Country:    ${record.country || "N/A"}`);
  console.log(`  City:       ${record.city || "N/A"}`);
  console.log(`  Region:     ${record.region || "N/A"}`);
  console.log(`  ISP:        ${record.ISP || "N/A"}`);
  console.log(`  Organization: ${record.organization || "N/A"}`);
  console.log(`  ASN:        ${record.ASN || "N/A"}`);
  console.log(`  Timezone:   ${record.timezone || "N/A"}`);
  console.log(`  Location:   ${record.latitude}, ${record.longitude}`);

  // ── Additional flags (if available) ──
  if (record.frequentAbuser !== undefined)
    console.log(`  frequentAbuser:    ${record.frequentAbuser}`);
  if (record.trustedApplication !== undefined)
    console.log(`  trustedApplication: ${record.trustedApplication}`);
  if (record.sharedIP !== undefined)
    console.log(`  sharedIP:          ${record.sharedIP}`);
  if (record.securityScanner !== undefined)
    console.log(`  securityScanner:   ${record.securityScanner}`);
  if (record.dynamicIP !== undefined)
    console.log(`  dynamicIP:         ${record.dynamicIP}`);
}

main("8.8.0.0").catch((err) => {
  console.error(err);
  process.exit(1);
});
```

### IPQSRecord Fields

Depending on which database file you receive some of these fields may be unavailable. If the field in question is unavailable in your database it will default to null.

| Field                                    | Type     | Description                                                                                                                                                                                                                                                                                                           |
| ---------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `record.isProxy`                         | `bool`   | Is this IP address suspected to be a proxy? (SOCKS, Elite, Anonymous, VPN, Tor, etc.)                                                                                                                                                                                                                                 |
| `record.isVPN`                           | `bool`   | Is this IP suspected of being a VPN connection? This can include data center ranges which can become active VPNs at any time. The "proxy" status will always be true when this value is true.                                                                                                                         |
| `record.isTOR`                           | `bool`   | Is this IP suspected of being a TOR connection? This can include previously active TOR nodes and exits which can become active TOR exits at any time. The "proxy" status will always be true when this value is true.                                                                                                 |
| `record.isCrawler`                       | `bool`   | Is this IP associated with being a confirmed crawler from a mainstream search engine such as Googlebot, Bingbot, Yandex, etc. based on hostname or IP address verification.                                                                                                                                           |
| `record.isBot`                           | `bool`   | Indicates if bots or non-human traffic has recently used this IP address to engage in automated fraudulent behavior. Provides stronger confidence that the IP address is suspicious.                                                                                                                                  |
| `record.recentAbuse`                     | `bool`   | This value will indicate if there has been any recently verified abuse across our network for this IP address. Abuse could be a confirmed chargeback, compromised device, fake app install, or similar malicious behavior within the past few days.                                                                   |
| `record.isBlacklisted`                   | `bool`   | This value will indicate if the IP has been blacklisted by any 3rd party agency for spam, abuse or fraud.                                                                                                                                                                                                             |
| `record.isPrivate`                       | `bool`   | This value will indicate if the IP is a private, nonrouteable IP address.                                                                                                                                                                                                                                             |
| `record.isMobile`                        | `bool`   | This value will indicate if the IP is likely owned by a mobile carrier.                                                                                                                                                                                                                                               |
| `record.hasOpenPorts`                    | `bool`   | This value will indicate if the IP has recently had open (listening) ports.                                                                                                                                                                                                                                           |
| `record.isHostingProvider`               | `bool`   | This value will indicate if the IP is likely owned by a hosting provider or is leased to a hosting company.                                                                                                                                                                                                           |
| `record.activeVPN`                       | `bool`   | Identifies active VPN connections used by popular VPN services and private VPN servers.                                                                                                                                                                                                                               |
| `record.activeTOR`                       | `bool`   | Identifies active TOR exits on the TOR network.                                                                                                                                                                                                                                                                       |
| `record.publicAccessPoint`               | `bool`   | Indicates if this IP is likely to be a public access point such as a coffee shop, college or library.                                                                                                                                                                                                                 |
| `record.connectionType.raw`              | `int`    | A numerical representation for the suspected type of connection for this IP address. It is generally recommended you call the `ConnectionType()` function listed below instead of using this value, but it is available as an option.                                                                                 |
| `record.connectionType.toString()`       | `string` | A string representation for the suspected type of connection for this IP address. (Residential, Mobile, Corporate, Data Center, Education or Unknown)                                                                                                                                                                 |
| `record.abusevelocity.raw`               | `int`    | How frequently the IP address is engaging in abuse across the IPQS threat network. Can be used in combination with the Fraud Score to identify bad behavior. It is generally recommended you call the `AbuseVelocity()` function listed below instead of using this value, but it is available as an option.          |
| `record.abuseVelocity.toString()`        | `int`    | How frequently the IP address is engaging in abuse across the IPQS threat network. Values can be "high", "medium", "low", or "none".                                                                                                                                                                                  |
| `record.country`                         | `string` | Two character country code of IP address or "N/A" if unknown.                                                                                                                                                                                                                                                         |
| `record.city`                            | `string` | City of IP address if available or "N/A" if unknown.                                                                                                                                                                                                                                                                  |
| `record.ISP`                             | `string` | ISP if one is known. Otherwise "N/A".                                                                                                                                                                                                                                                                                 |
| `record.organization`                    | `string` | Organization if one is known. Can be parent company or sub company of the listed ISP. Otherwise "N/A".                                                                                                                                                                                                                |
| `record.ASN`                             | `int`    | Autonomous System Number if one is known. Zero if nonexistent.                                                                                                                                                                                                                                                        |
| `record.timezone`                        | `string` | Timezone of IP address if available or "N/A" if unknown.                                                                                                                                                                                                                                                              |
| `record.latitude`                        | `float`  | Latitude of IP address if available or 0.00 if unknown.                                                                                                                                                                                                                                                               |
| `record.longitude`                       | `float`  | Longitude of IP address if available or 0.00 if unknown.                                                                                                                                                                                                                                                              |
| `record.fraudScore.getFraudScore(level)` | `int`    | Returns the fraud score for the "strictness level" specified and can be 0, 1 or 2. Some databases may contain 1 entry, others all 3. It is recommended that you use the lowest strictness for Fraud Scoring. Increasing this value will expand the tests we perform. Levels 2+ have a higher risk of false-positives. |

#### Connection Types

| #   | Enum Description |
| --- | ---------------- |
| 1   | Residential IP   |
| 2   | Mobile IP        |
| 3   | Corporate IP     |
| 4   | Data Center IP   |
| 5   | Educational IP   |

#### Abuse Velocity Levels

| #   | Enum Description       |
| --- | ---------------------- |
| 1   | Low Recent Abuse IP    |
| 2   | Medium Recent Abuse IP |
| 3   | High Recent Abuse IP   |

### Usage Notes

Each database only holds either IPv4 or IPv6 data. Therefore you may need two instances of the reader available depending on your use case.
