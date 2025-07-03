<div class="documentation_overview">
	<h1 class="doc-title">IPQualityScore IP Address Reputation &amp; Proxy Detection Node JS / Type Script DB Reader</h1>
	<div class="spacing-10"></div>
	<h2 class="text-bold headerHR" style="font-size: 1.5em;">Flat File Version 1.0</h2>
	<div class="spacing-10"></div>
	<p>
        The IPQS NodeJS DB reader allows you to read our flat file databases and get started implimenting our proxy detection easily.
    </p>
    You can find the full <a href="https://www.ipqualityscore.com/documentation/ip-reputation-database/nodejs" target="_blank">NodeJS IPQualityScore flat file database documentation here</a> or view a description of what our <a href="https://www.ipqualityscore.com/proxy-detection-database" target="_blank">proxy detection database does here</a>.
    <h6 class="text-bold headerHR">Installation</h6>
	<div class="spacing-10"></div>
	<p>
        Installation can be achieved via npm or via direct inclusion of the libraries provided.
    </p>
    <div class="row">
		<div class="col-md-12 xsmcode">
			<pre class="highlight markdown"><code>
npm install node_js_ipqs_db_reader
			</code></pre>
        </div>
    </div>
    <h6 class="text-bold headerHR">Usage</h6>
	<div class="spacing-10"></div>
	<p>
        Using our flat file database system to lookup an IP address is simple:
    </p>
    <div class="row">
		<div class="col-md-12 lgcode">
            <pre class="highlight markdown"><code>
let db = DBReader.Open("IPQualityScore-IP-Reputation-Database-IPv4.ipqs");

db.ready.then(async (success) => {
    let record = db.fetch("8.8.0.0"); // IPQSRecord object.
    record.ready.then(() => {
        console.log(record.country);
    });
});
            </code></pre>
        </div>
    </div>
    <h6 class="text-bold headerHR">IPQSRecord Fields:</h6>
	<div class="spacing-10"></div>
	<p>
        Depending on which database file you receive some of these fields may be unavailable. If the field in question is unavailable in your database it will default to null.
    </p>
    <div class="row">
		<div class="col-md-12">
			<table class="table table-legend custom-tablelegend">
				<thead>
					<tr>
						<th style="width:10%">Field</th>
						<th style="width:10%">Type</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>record.isProxy</td>
						<td>bool</td>
						<td>Is this IP address suspected to be a proxy? (SOCKS, Elite, Anonymous, VPN, Tor, etc.)</td>
					</tr>
                    <tr>
						<td>record.isVPN</td>
						<td>bool</td>
						<td>Is this IP suspected of being a VPN connection? This can include data center ranges which can become active VPNs at any time. The "proxy" status will always be true when this value is true.</td>
					</tr>
                    <tr>
						<td>record.isTOR</td>
						<td>bool</td>
						<td>Is this IP suspected of being a TOR connection? This can include previously active TOR nodes and exits which can become active TOR exits at any time. The "proxy" status will always be true when this value is true.</td>
					</tr>
                    <tr>
						<td>record.isCrawler</td>
						<td>bool</td>
						<td>Is this IP associated with being a confirmed crawler from a mainstream search engine such as Googlebot, Bingbot, Yandex, etc. based on hostname or IP address verification.</td>
					</tr>
                    <tr>
						<td>record.isBot</td>
						<td>bool</td>
						<td>Indicates if bots or non-human traffic has recently used this IP address to engage in automated fraudulent behavior. Provides stronger confidence that the IP address is suspicious.</td>
					</tr>
                    <tr>
						<td>record.recentAbuse</td>
						<td>bool</td>
						<td>This value will indicate if there has been any recently verified abuse across our network for this IP address. Abuse could be a confirmed chargeback, compromised device, fake app install, or similar malicious behavior within the past few days.</td>
					</tr>
                    <tr>
						<td>record.isBlacklisted</td>
						<td>bool</td>
						<td>This value will indicate if the IP has been blacklisted by any 3rd party agency for spam, abuse or fraud.</td>
					</tr>
                    <tr>
						<td>record.isPrivate</td>
						<td>bool</td>
						<td>This value will indicate if the IP is a private, nonrouteable IP address.</td>
					</tr>
                    <tr>
						<td>record.isMobile</td>
						<td>bool</td>
						<td>This value will indicate if the IP is likely owned by a mobile carrier.</td>
					</tr>
                    <tr>
						<td>record.hasOpenPorts</td>
						<td>bool</td>
						<td>This value will indicate if the IP has recently had open (listening) ports.</td>
					</tr>
                    <tr>
						<td>record.isHostingProvider</td>
						<td>bool</td>
						<td>This value will indicate if the IP is likely owned by a hosting provider or is leased to a hosting company.</td>
					</tr>
                    <tr>
						<td>record.activeVPN</td>
						<td>bool</td>
						<td>Identifies active VPN connections used by popular VPN services and private VPN servers.</td>
					</tr>
                    <tr>
						<td>record.activeTOR</td>
						<td>bool</td>
						<td>Identifies active TOR exits on the TOR network.</td>
					</tr>
                    <tr>
						<td>record.publicAccessPoint</td>
						<td>bool</td>
						<td>Indicates if this IP is likely to be a public access point such as a coffee shop, college or library.</td>
					</tr>
                    <tr>
						<td>record.connectionType.raw</td>
						<td>int</td>
						<td>
                            <p>
                                A numerical representation for the suspected type of connection for this IP address. It is generally reccomended you call the ConnectionType() function listed below instead of using this value, but it is available as an option.
                            </p>
                            <div class="row">
                                <div class="col-md-8 col-md-offset-2">
                                    <table class="table table-legend custom-tablelegend">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th style="width:90%;">Enum Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>Residential IP</td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>Mobile IP</td>
                                            </tr>
                                            <tr>
                                                <td>3</td>
                                                <td>Corporate IP</td>
                                            </tr>
                                            <tr>
                                                <td>4</td>
                                                <td>Data Center IP</td>
                                            </tr>
                                            <tr>
                                                <td>5</td>
                                                <td>Educational IP</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </td>
					</tr>
                    <tr>
						<td>record.connectionType.toString()</td>
						<td>string</td>
						<td>
                            <p>
                                A string representation for the suspected type of connection for this IP address. (Residential, Mobile, Corporate, Data Center, Education or Unknown)
                            </p>
                        </td>
					</tr>
                    <tr>
						<td>record.abusevelocity.raw</td>
						<td>int</td>
						<td>
                            <p>
                                How frequently the IP address is engaging in abuse across the IPQS threat network. Can be used in combination with the Fraud Score to identify bad behavior. It is generally reccomended you call the AbuseVelocity() function listed below instead of using this value, but it is available as an option.
                            </p>
                            <div class="row">
                                <div class="col-md-8 col-md-offset-2">
                                    <table class="table table-legend custom-tablelegend">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th style="width:90%;">Enum Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>Low Recent Abuse IP</td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>Medium Recent Abuse IP</td>
                                            </tr>
                                            <tr>
                                                <td>3</td>
                                                <td>High Recent Abuse IP</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
						<td>record.abuseVelocity.toString()</td>
						<td>int</td>
						<td>
                            <p>
                                How frequently the IP address is engaging in abuse across the IPQS threat network. Values can be "high", "medium", "low", or "none".
                            </p>
                        </td>
                    </tr>
                    <tr>
						<td>record.country</td>
						<td>string</td>
						<td>
                            <p>
                                Two character country code of IP address or "N/A" if unknown.
                            </p>
                        </td>
                    </tr>
                    <tr>
						<td>record.city</td>
						<td>string</td>
						<td>
                            <p>
                                City of IP address if available or "N/A" if unknown.
                            </p>
                        </td>
                    </tr>
                    <tr>
						<td>record.ISP</td>
						<td>string</td>
						<td>
                            <p>
                                ISP if one is known. Otherwise "N/A".
                            </p>
                        </td>
                    </tr>
                    <tr>
						<td>record.organization</td>
						<td>string</td>
						<td>
                            <p>
                                Organization if one is known. Can be parent company or sub company of the listed ISP. Otherwise "N/A".
                            </p>
                        </td>
                    </tr>
                    <tr>
						<td>record.ASN</td>
						<td>int</td>
						<td>
                            <p>
                                Autonomous System Number if one is known. Zero if nonexistent.
                            </p>
                        </td>
                    </tr>
                    <tr>
						<td>record.timezone</td>
						<td>string</td>
						<td>
                            <p>
                                Timezone of IP address if available or "N/A" if unknown.
                            </p>
                        </td>
                    </tr>
                    <tr>
						<td>record.latitude</td>
						<td>float</td>
						<td>
                            <p>
                                Latitude of IP address if available or 0.00 if unknown.
                            </p>
                        </td>
                    </tr>
                    <tr>
						<td>record.longitude</td>
						<td>float</td>
						<td>
                            <p>
                                Longitude of IP address if available or 0.00 if unknown.
                            </p>
                        </td>
                    </tr>
                    <tr>
						<td>record.fraudScore.getFraudScore(level)</td>
						<td>int</td>
						<td>
                            <p>
                                Returns the fraud score for the "strictness level" specified and can be 0, 1 or 2. Some databases may contain 1 entry, others all 3. It is reccomended that you use the lowest strictness for Fraud Scoring. Increasing this value will expand the tests we perform. Levels 2+ have a higher risk of false-positives.
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <h6 class="text-bold headerHR">Usage Notes</h6>
	<div class="spacing-10"></div>
	<p>
        Each database only holds either IPv4 or IPv6 data. Therefore you may need two instances of the reader available depending on your use case.
    </p>
</div>