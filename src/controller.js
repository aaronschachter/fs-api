const path = require('path');
const lodash = require('lodash');
const fs = require('fs').promises;

const util = require('./util');

/**
 * @param {string} dirPath 
 * @returns {Promise}
 */
const getDirectoryEntry = async (dirPath) => {
  const stats = await fs.stat(dirPath);
  const { mode, uid, size } = stats;

  return result = {
    isDirectory: stats.isDirectory(),
    name: dirPath.split('/').pop(),
    permissions: util.getOctalFormat(mode),
    size,
    uid,
  };
}

/**
 * @param {string} dirPath 
 * @returns {Promise}
 */
const getDirectoryEntries = async (dirPath) => {
  const dir = await fs.opendir(dirPath);
  const entries = [];

  for await (const { name } of dir) {
    const parsed = await getDirectoryEntry(path.join(dirPath, '.', name));

    entries.push(parsed);
  }

  return lodash.sortBy(entries, 'name');
};

/**
 * @param {string} rootDirectory 
 * @param {string} destination 
 * @returns {Promise}
 */
const getFileSystemContents = async (rootDirectory, destination) => {
  const rootDirectoryEntries = await getDirectoryEntries(rootDirectory);

  if (!destination) {
    return rootDirectoryEntries;
  }

  const destPaths = util.getDestinationPaths(destination);

  let currentNodePath = rootDirectory;
  let currentNodeIndex = 0;
  let currentNodeDirectoryEntries = rootDirectoryEntries;

  while (currentNodeIndex < destPaths.length) {
    const currentNode = currentNodeDirectoryEntries.find(
      entry => entry.name === destPaths[currentNodeIndex]
    );

    if (!currentNode) {
      throw new NotFoundError('Invalid path.');
    }

    currentNodePath = path.join(currentNodePath, '.', destPaths[currentNodeIndex]);
    const isLastDestinationPath = currentNodeIndex === destPaths.length - 1;

    if (isLastDestinationPath && !currentNode.isDirectory) {
      return {
        ...currentNode,
        contents: await fs.readFile(currentNodePath, { encoding: 'utf8' }),
      };
    }

    currentNodeDirectoryEntries = await getDirectoryEntries(currentNodePath);

    if (isLastDestinationPath) {
      return currentNodeDirectoryEntries;
    }

    // Bump index to continue while loop and move down to the next path.
    currentNodeIndex++;
  }

  throw new Error('Something went wrong.');
};

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = 404;
  }
}

module.exports = {
  getFileSystemContents
};
