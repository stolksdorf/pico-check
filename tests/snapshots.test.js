const test = require('../pico-check');
const Snapshots = require('../snapshots');
const fs = require('fs');


test('finds snapshots relative to this file', (t)=>{
	const snapshots = Snapshots('./snapshots');
	t.is(typeof snapshots, 'object');
});

test('reads in the snapshot file properly', (t)=>{
	const snapshots = Snapshots('./snapshots');
	t.is(snapshots.snap, fs.readFileSync('./snapshots/snap.txt', 'utf8'));
});

test('loads nested snapshots', (t)=>{
	const snapshots = Snapshots('./snapshots');
	t.is(snapshots.nested.shot, fs.readFileSync('./snapshots/nested/shot.js', 'utf8'));
});

test(`throws an error if can't find the snapshots`, (t)=>{
	t.throws(()=>{
		const snapshots = Snapshots('./snapshooooots');
	});
});


module.exports = test;