const pathRelative = require('path').relative
const cwd = process.cwd();
const chalk = require('chalk');
const concordance = require('concordance');
const concordanceTheme = require('./concordance.theme.js');

const StackUtils = require('stack-utils');
const stack = new StackUtils({cwd: process.cwd(), internals: StackUtils.nodeInternals()});


const assert = require('assert');

//pathRelative(cwd, module.parent.filename);

const Utils = {
	getFilename : ()=>{
		try {
			var err = new Error();
			var callerfile;
			var currentfile;

			Error.prepareStackTrace = function (err, stack) { return stack; };

			//return err.stack[1].getFileName();

			return pathRelative(cwd, err.stack[2].getFileName());

		} catch (err) {}
		return undefined;
	},

	getCodeSnippet : (filename, line, col, around=3)=>{


	},

	cleanStackTrace : (error)=>{
		//split on newline
		//map over a regex, parse into callsite objects, include a raw string
		//filter on common node paths and what not
		//return
		return stack.clean(error)

		// https://github.com/tapjs/stack-utils/blob/master/index.js

	},

	getCodeDiff : (expected, actual)=>{
		try{
			assert.equal(4,5)
		}catch(err){
			console.log(err.actual);
			console.log(err.expected);
		}

		console.log();

		//console.log(concordance);
		//return concordance.describe(expected);
		return concordance.diff(expected, actual, {
			theme:concordanceTheme
		});

	}

};




//console.log(Utils.getFilename());

module.exports = Utils;