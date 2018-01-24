const test = require('../pico-check.js');
const utils = require('../src/utils.js');

test('padEnd/padStart', (t)=>{
	t.is('hello'.padEnd(7), 'hello  ');
	t.is('hello'.padStart(7), '  hello');
});

test('flatMap', (t)=>{
	t.is(utils.flatMap([1, 2, 3, 4], (i)=>i), [1, 2, 3, 4]);
	t.is(utils.flatMap([1, [2], [3, 4]], (i)=>i), [1, 2, 3, 4]);
});

test('isObjectLike', (t)=>{
	t.ok(utils.isObjectLike({ a: 6 }));
	t.ok(utils.isObjectLike([false]));
	t.ok(utils.isObjectLike(5, 'test', { a: 6 }));
	t.no(utils.isObjectLike(5));
	t.no(utils.isObjectLike(5, 'hello', true));
	t.no(utils.isObjectLike());
});

test('indent', (t)=>{
	t.is(utils.indent('hello', 4), '    hello');
	t.is(utils.indent('hello', '  '), '  hello');
	t.is(utils.indent('a\nb', 1), ' a\n b');
});

test.group('sequence', (test)=>{
	test('non-promise based', (t)=>{
		return utils.sequence([1, 2, 3, 4], (i)=>i)
			.then((res)=>t.is(res, [1, 2, 3, 4]));
	});
	test('promise based', (t)=>{
		return utils.sequence([1, 2, 3, 4], (i)=>Promise.resolve(i))
			.then((res)=>t.is(res, [1, 2, 3, 4]));
	});
});

test('getSummary', (t)=>{
	const summary = utils.getSummary([
		true, true,
		[
			true,
			false,
			new Error(),
			[false]
		],
		false,
		true,
		new Error()
	]);

	t.is(summary.passed, 4);
	t.is(summary.failed, 2);
	t.is(summary.skipped, 3);
	t.is(summary.passing, false);
	t.is(summary.errors.length, 2);

	t.ok(utils.getSummary([true, [true]]).passing);
});

module.exports = test;