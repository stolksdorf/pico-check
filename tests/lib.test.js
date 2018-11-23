const test = require('../pico-check.js');
const lib = require('../src/lib.js');

test.group('testcase', (test) => {
	test('basic', async (t) => {
		const tc = lib.createTestCase('sample', (t) => t.pass());
		const res = await tc.run();
		t.is(res, true);
	});
	test('failed', async (t) => {
		const tc = lib.createTestCase('sample', (t) => t.fail());
		const res = await tc.run();
		t.ok(res instanceof Error);
	});
	test('skipped', async (t) => {
		const tc = lib.createTestCase('sample', (t) => t.fail(), { skip : true });
		const res = await tc.run();
		t.is(res, false);
	});
	test('rejected', async (t) => {
		const tc = lib.createTestCase('sample', (t) => {
			return Promise.reject('bad news');
		});
		const res = await tc.run();
		t.ok(res instanceof Error);
	});
	test('error', async (t) => {
		const tc = lib.createTestCase('sample', (t) => {
			throw'error!';
		});
		const res = await tc.run();
		t.ok(res instanceof Error);
	});
});

test.group('async', (test) => {
	test('passed', (t) => {
		const tc = lib.createTestCase('sample', (t) => {
			return new Promise((resolve, reject) => {
				t.pass();
				setTimeout(resolve, 100);
			});
		});
		return tc.run().then((res) => t.ok(res));
	});
	test('custom timeout', (t) => {
		const tc = lib.createTestCase(
			'sample',
			(t) => {
				return new Promise((resolve, reject) => {
					t.pass();
					setTimeout(resolve, 40);
				});
			},
			{ timeout : 50 }
		);
		return tc.run().then((res) => t.ok(res));
	});
	test('failed', (t) => {
		const tc = lib.createTestCase('sample', (t) => {
			return new Promise((resolve, reject) => {
				setTimeout(reject, 100);
			});
		});
		return tc.run().then((res) => t.ok(res instanceof Error));
	});
	test('timeout', (t) => {
		const tc = lib.createTestCase('sample', (t) => {
			return new Promise((resolve, reject) => {
				t.pass();
				setTimeout(resolve, 10000);
			});
		});
		return tc.run().then((res) => t.ok(res instanceof Error));
	});

	test('async/await', async (t) => {
		const bar = Promise.resolve('bar');
		t.is(await bar, 'bar');
	});
});

test.group('group', (test) => {
	test('basic', (t) => {
		const group = lib.createGroup('New group');
		group.add(lib.createTestCase('sample', (t) => t.pass()));
		group.add(lib.createTestCase('sample', (t) => t.fail(), { skip : true }));
		return group.run().then((res) => t.is(res, [true, false]));
	});

	test('skipped', (t) => {
		const group = lib.createGroup('New group', { skip : true });
		group.add(lib.createTestCase('sample', (t) => t.pass()));
		group.add(lib.createTestCase('sample', (t) => t.fail(), { skip : true }));
		return group.run().then((res) => t.is(res, [false, false]));
	});

	test('nested', (t) => {
		const group = lib.createGroup('New group');
		const group2 = lib.createGroup('New group');
		group.add(lib.createTestCase('sample', (t) => t.pass()));
		group.add(group2);
		group.add(lib.createTestCase('sample', (t) => t.fail(), { skip : true }));

		group2.add(lib.createTestCase('sample', (t) => t.pass()));
		group2.add(lib.createTestCase('sample', (t) => t.pass()));
		return group.run().then((res) => t.is(res, [true, [true, true], false]));
	});
});

module.exports = test;
