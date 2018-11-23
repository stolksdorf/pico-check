const path = require('path');
const fs = require('fs');

const GetSnapshots = (dir) => {
	return fs.readdirSync(dir).reduce((result, file) => {
		const filepath = path.join(dir, file);
		const info = path.parse(filepath);
		result[info.name] = fs.statSync(filepath).isDirectory()
			? GetSnapshots(filepath)
			: fs.readFileSync(filepath, 'utf8');
		return result;
	}, {});
};

module.exports = (dir) => GetSnapshots(path.resolve(path.dirname(module.parent.filename), dir));

// module.exports = (dir)=>{
// 	const temp = GetSnapshots(path.resolve(path.dirname(module.parent.filename), dir))
// 	return temp;
// };
