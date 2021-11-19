import { DBReader } from '../src/index';

test('ReadSample', async () => {
	console.time("Read record time");

	let db = DBReader.Open("__tests__/IPQualityScore-IP-Reputation-Database-IPv4.ipqs");
	
	await db.ready.then(async (success) => {
		expect(db.treeStart).toBe(275);
		expect(db.recordBytes).toBe(41);
		expect(db.totalBytes).toBe(7632);
		expect(db.columns.length).toBe(11);

		let record = db.fetch("8.8.0.0");
		await record.ready.then(() => {
			expect(record.isProxy).toBe(true);
			expect(record.country).toBe("US");
			expect(record.ISP).toBe("Level 3 Communications");
			console.timeEnd("Read record time");
		});
	});
});
