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

module.exports = {
  getDestinationPaths,
  getOctalFormat,
};
