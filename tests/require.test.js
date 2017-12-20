
let temp =0;

delete require.cache[require.resolve('./require.test.js')];

module.exports = {
	add  : ()=>temp++,
	show : ()=>temp
};