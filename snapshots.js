const path = require('path');
const fs   = require('fs');

const GetSnapshots = (dir)=>{
	console.log(dir);
	return fs.readdirSync(dir).reduce((result, file)=>{
		const filepath = path.join(dir, file);
		const info = path.parse(filepath);
		result[info.name] = fs.statSync(filepath).isDirectory()
			? GetSnapshots(filepath)
			: fs.readFileSync(filepath, 'utf8');
		console.log(result);
		return result;
	}, {});
};

module.exports = (dir)=>{
	console.log('parent', module.parent.filename);
	return GetSnapshots(path.resolve(path.dirname(module.parent.filename), dir))
};