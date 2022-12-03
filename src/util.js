require('dotenv').config();

/**
 * @param {number} mode 
 * @returns {string}
 */
// @see https://www.martin-brennan.com/nodejs-file-permissions-fstat/
const getOctalFormat = (mode) => `0${(mode & parseInt('777', 8)).toString(8)}`;

/**
 * @param {string} destination 
 * @returns {Array}
 */
const getDestinationPaths = (destination) => {
  // Remove trailing slash, if exists
  // @see https://bobbyhadz.com/blog/javascript-remove-trailing-slash-from-string#remove-a-trailing-slash-from-a-string
  return destination.replace(/\/+$/, '').split('/');
}

/**
 * Fetches the ROOT_DIR environment variable.
 * 
 * @returns {string}
 */
const getRootDirPath= () => {
  const result = process.env.ROOT_DIR;

  if (result) {
    return result;
  }

  throw new Error('Could not find ROOT_DIR variable in .env');
}

module.exports = {
  getDestinationPaths,
  getOctalFormat,
  getRootDirPath,
};
