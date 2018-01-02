const cli = require('commander');
const package = require('../package.json');
const path = require('path');
const fs   = require('fs');
const utils = require('./utils.js');

const ensureArray = (key)=>{
	if(opts[key] && !Array.isArray(opts[key])) opts[key] = [opts[key]];
};
const applyToOpts = (obj)=>{
	Object.keys(opts).map((key)=>{
		if(typeof obj[key] !== 'undefined') opts[key] = obj[key];
	})
};

let opts = {
	tests    : ['**/*.test.js'],
	ignore   : ['node_modules/**'],
	reporter : false,
	verbose  : false,
	require  : false,
	watch    : false,
	source   : ['**/*.js'],
	timeout  : 500
};

const getPckg = (currPath = path.resolve(''))=>{
	const pckg = path.join(currPath, 'package.json');
	if(fs.existsSync(pckg)) return utils.requireRelative(pckg);
	const info = path.parse(currPath);
	if(info.root == info.dir) return {};
	return getPckg(info.dir);
};
const pckg = getPckg()
const packageOpts = pckg.picotest || pckg.picoTest || pckg['pico-test'] || {};

const cliOpts = cli
	.version(package.version)
	.command('pico-test [tests]')
	.usage('[options] <test files...>')
	.option('-v --verbose', 'use the verbose reporter')
	.option('-t --tap', 'use the TAP reporter')
	.option('-w --watch', 'enable watching')
	.option('-i --ignore [path]', 'paths to ignore')
	.option('--timeout [value]', 'default timeout for async tests', Number)
	.option('--reporter [path]', 'path to custom reporter')
	.option('--require [path]', 'path to extra modules to require before tests are ran')
	.option('--source [path]', 'paths to files to watch')
	.parse(process.argv)
if(cliOpts.args.length) cliOpts.tests = cliOpts.args;

applyToOpts(packageOpts);
applyToOpts(cliOpts);

ensureArray('tests')
ensureArray('watch')
ensureArray('ignore')
ensureArray('require')
ensureArray('source')

module.exports = opts;