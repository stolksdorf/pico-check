const test = require('../pico-check.js');

const _ = (t) => {};

test('basic', (t) => {
	const pc = require('../pico-check.js');

	pc.only('A', _);
	pc('B', _);
	pc.only('C', _);

	return pc.run().then((res) => t.is(res, [true, false, true]));
});

test('group', (t) => {
	const pc = require('../pico-check.js');

	pc.group('A', (test) => {
		test.only('Aa', _);
		test('Ab', _);
	});

	return pc.run().then((res) => t.is(res, [[true, false]]));
});

test('multigroup', (t) => {
	const pc = require('../pico-check.js');

	pc.only().group('A', (test) => {
		test('Aa', _);
		test('Ab', _);
	});
	pc.group('B', (test) => {
		test('Ba', (t) => {
			t.fail();
		});
	});

	return pc.run().then((res) => t.is(res, [[true, true], [false]]));
});

test('nested groups', (t) => {
	const pc = require('../pico-check.js');

	pc.group('A', (test) => {
		test.only('Aa', _);
		test('Ab', _);
		test.only().group('C', (test) => {
			test('Ca', _);
			test('Cb', _);
		});
		test.only().group('D', (test) => {
			test('Da', _);
			test.only('Db', _);
		});
	});
	pc.group('B', (test) => {
		test('Ba', _);
	});

	return pc.run().then((res) => {
		t.is(res, [[true, false, [true, true], [false, true]], [false]]);
	});
});

module.exports = test;
