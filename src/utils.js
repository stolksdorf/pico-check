const path = require('path');
const fs = require('fs');

module.exports = {

	clearConsole : ()=>console.log('\033[2J'),

	indent : (string, pad=1, prefix='') => {
		if(typeof pad == 'number') pad = ' '.repeat(pad);
		return string
			.split('\n')
			.map((line) => `${pad}${prefix}${line}`)
			.join('\n');
	},

	chalk : Object.entries({
		bright: 1,  grey : 90,  red:  31,
		green:  32, yellow:33, blue: 34,
		magenta:35, cyan:  36, white:37,
	}).reduce((acc, [name, id])=>{ return {...acc, [name]:(txt)=>`\x1b[${id}m${txt}\x1b[0m`}}, {}),

	summary : (results)=>{
		let passed=0, failed=0, skipped=0;
		const recur = (obj)=>{
			if(obj===true) return passed++;
			if(obj===false) return skipped++;
			if(obj instanceof Error) return failed++;
			if(typeof obj == 'object') return Object.values(obj).map(recur);
		}
		recur(results);
		return {passed, failed, skipped};
	},

	getStackTrace : (error)=>{
		return error.stack.split('\n').map((raw)=>{
			const [_, name, file, line, col] =
				/    at (.*?) \((.*?):(\d*):(\d*)\)/.exec(raw) || /    at ()(.*?):(\d*):(\d*)/.exec(raw) || [];
			return { name, file : file && path.relative(process.cwd(), file), line : Number(line), col  : Number(col), raw };
		})
		.filter(({file})=> file && !file.endsWith('engine.js'))
	},

	// Requires the target and watches all files associated with it
	// calls callback with the re-require'd target after file change.
	watchSource : (target, callback)=>{
		const res = require(target);
		const srcs = Object.keys(require.cache).filter(src=>src.indexOf('node_modules')==-1);
		let running = false

		const onChange = async (evt, file)=>{
			if(running) return;
			if(evt == 'change'){
				running = true;
				srcs.map((src)=>{ delete require.cache[src] });
				await callback(require(target));
				running = false;
			}
		}
		srcs.map((src)=>fs.watch(src, onChange));
		callback(res);
	}
}
