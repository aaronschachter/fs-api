const path = require('path');
const fs = require('fs').promises;

const getDirectoryEntry = async (dirPath) => {
  const stats = await fs.stat(dirPath);
  const { mode, uid, size } = stats;

  return result = {
    isDirectory: stats.isDirectory(),
    name: dirPath.split('/').pop(),
    // Refs https://www.martin-brennan.com/nodejs-file-permissions-fstat/
    permissions: `0${(mode & parseInt('777', 8)).toString(8)}`,
    size,
    uid,
  };
}

const getDirectoryEntries = async (dirPath) => {
  const dir = await fs.opendir(dirPath);
  const entries = [];

  for await (const { name } of dir) {
    const parsed = await getDirectoryEntry(path.join(dirPath, '.', name));

    entries.push(parsed);
  }

  return entries;
};

const getFileSystemContents = async (rootDirectory, destination) => {
  const rootDirectoryEntries = await getDirectoryEntries(rootDirectory);

  if (!destination) {
    return rootDirectoryEntries;
  }

  // Remove trailing slash, if exists
  // @see https://bobbyhadz.com/blog/javascript-remove-trailing-slash-from-string#remove-a-trailing-slash-from-a-string
  const destPaths = destination.replace(/\/+$/, '').split('/');

  let currentDestPath = rootDirectory;
  let currentDestPathIndex = 0;
  let currentDestPathDirectoryEntries = rootDirectoryEntries;
  let currentDestPathDirectoryEntry;

  while (currentDestPathIndex < destPaths.length) {
    currentDestPathDirectoryEntry = currentDestPathDirectoryEntries.find(
      entry => entry.name === destPaths[currentDestPathIndex]
    );

    if (!currentDestPathDirectoryEntry) {
      throw new NotFoundError('Invalid path.');
    }

    currentDestPath = path.join(currentDestPath, '.', destPaths[currentDestPathIndex]);
    const isLastDestinationPath = currentDestPathIndex === destPaths.length - 1;

    if (isLastDestinationPath && !currentDestPathDirectoryEntry.isDirectory) {
      return {
        ...currentDestPathDirectoryEntry,
        contents: await fs.readFile(currentDestPath, { encoding: 'utf8' }),
      };
    }

    currentDestPathDirectoryEntries = await getDirectoryEntries(currentDestPath);

    if (isLastDestinationPath) {
      return currentDestPathDirectoryEntries;
    }

    // Bump index to continue while loop and check for the next path.
    currentDestPathIndex++;
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
  getFileSystemContents,
};
