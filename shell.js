
const readline = require('readline');
  
const controller = require('./src/controller');
const util = require('./src/util');

const rl = readline.createInterface(process.stdin, process.stdout);
const rootDir = util.getRootDirPath();

console.log('Setting root directory to', rootDir);

function promptForPath() {
  rl.question('\nEnter a relative path (or empty string to view root directory):\n', async (destination) => {
    console.log('\n');
    console.log(`Request: GET /${destination}`);

    try {
      console.log('Response:');
      console.log(await controller.getFileSystemContents(rootDir, destination.trim()));

    } catch (error) {
      console.log('An error occurred:', error.message);
    }

    promptForPath();
  });
}

promptForPath();
