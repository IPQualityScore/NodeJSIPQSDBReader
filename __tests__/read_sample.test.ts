import { DBReader } from '../src/index';

// jest.setTimeout(999999);

test('100 IPv4 Addresses test', async () => {
  console.time('Read record time');
  let db = await DBReader.Open(
    '__tests__/IPQualityScore-IP-Reputation-Database-IPv4.ipqs'
  );

  for (let index = 0; index < 100; index++) {
    let record = await db.Fetch('8.8.0.0');
    expect(record.isProxy).toBe(true);
    expect(record.country).toBe('US');
    expect(record.ISP).toBe('Level 3 Communications');
  }
  console.timeEnd('Read record time');
});

test('Single IPv4 Address test', async () => {
  console.time('Read record time');

  let db = await DBReader.Open(
    '__tests__/IPQualityScore-IP-Reputation-Database-IPv4.ipqs'
  );

  let record = await db.Fetch('8.8.0.0');
  expect(record.isProxy).toBe(true);
  expect(record.country).toBe('US');
  expect(record.ISP).toBe('Level 3 Communications');
});

test('Single IPv6 Address test', async () => {
  console.time('Read record time');

  let db = await DBReader.Open(
    '__tests__/IPQualityScore-IP-Reputation-Database-IPv6.ipqs'
  );

  let record = await db.Fetch('2001:4860:4860::8844');

  expect(record.isProxy).toBe(true);
  expect(record.country).toBe('US');
  expect(record.ISP).toBe('Google');
});
