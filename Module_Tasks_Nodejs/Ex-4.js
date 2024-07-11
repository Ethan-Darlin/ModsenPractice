const path = require('path');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Please provide path parts as arguments.');
  process.exit(1);
}

const combinedPath = path.join(...args);

const normalizedPath = path.normalize(combinedPath);

//ex node Ex-4.js /usr/local bin ../etc config 
console.log('Normalized Path:', normalizedPath);