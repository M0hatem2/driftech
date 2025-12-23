const fs = require('fs');
const packageJson = require('../package.json');

const version = packageJson.version;

// read environment.prod.ts
const prodPath = './src/environments/environment.prod.ts';
let prodContent = fs.readFileSync(prodPath, 'utf8');

// replace version
prodContent = prodContent.replace(/version: '.*'/, `version: '${version}'`);

fs.writeFileSync(prodPath, prodContent);

console.log('Environment version updated:', version);