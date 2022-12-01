const test = require('ava');
const mock = require('mock-require');
const { faker } = require('@faker-js/faker');

let controller = require('../src/controller');

const MOCK_MODE = 16877;
const MOCK_PERMISSION = '0755';

/**
 * @param {boolean} isDirectory 
 * @returns {Object}
 */
function generateFsDirent(isDirectory = false) {
  return {
    isDirectory: () => { return isDirectory },
    name: isDirectory ? faker.word.noun() : faker.system.commonFileName(),
  };
};

/**
 * 
 * @param {boolean} isDirectory 
 * @returns {Object}
 */
function generateFsStats(isDirectory = false) {
  return {
    isDirectory: () => { return isDirectory },
    mode: MOCK_MODE,
    size: faker.datatype.number({ min: 4000 }),
    uid: faker.datatype.number({ min: 1 }),
  };
}

/**
 * @param {Array} fsOpendirResponse
 * @param {string} fsReadFileResponse
 * @param {Object} fsStatResponse
 * @returns {Object}
 */
function mockFs({
  fsOpendirResponse,
  fsReadFileResponse,
  fsStatResponse,
}) {
  return {
    promises: {
      opendir: async function () {
        return fsOpendirResponse || [generateFsDirent(true), generateFsDirent(false)];
      },
      readFile: async function ()  {
        return fsReadFileResponse || faker.lorem.paragraphs(2);
      },
      stat: async function () {
        return fsStatResponse || generateFsStats(false);
      },
    },
  };
}

function testDirectoryEntry(t, result, expected) {
  t.is(result.name, expected.name);
  t.is(result.contents, expected.contents);
  t.is(result.isDirectory, expected.isDirectory);
  t.is(result.permissions, MOCK_PERMISSION);
  t.is(result.size, expected.size);
  t.is(result.uid, expected.uid);
}

test('getFileSystemContents on root directory', async (t) => {
  const isDirectory = false;
  const fsStatResponse = generateFsStats(isDirectory);
  const fsOpendirResponse = [
    generateFsDirent(isDirectory),
    generateFsDirent(isDirectory),
  ];

  mock('fs', mockFs({ fsOpendirResponse, fsStatResponse }));

  controller = mock.reRequire('../src/controller');
  
  const rootDir = faker.system.directoryPath();

  const results = await controller.getFileSystemContents(rootDir, null);

  t.is(results.length, 2);

  for (let i = 0; i < 2; i++) {
    testDirectoryEntry(t, results[i], {
      name: fsOpendirResponse[i].name,
      isDirectory,
      size: fsStatResponse.size,
      uid: fsStatResponse.uid,
    });
  }
});

test('getFileSystemContents with file destination', async (t) => {
  const isDirectory = false;
  const fsStatResponse = generateFsStats(isDirectory);
  const fsReadFileResponse = faker.lorem.paragraph();
  const fsOpendirResponse = [
    generateFsDirent(isDirectory),
    generateFsDirent(isDirectory),
  ];

  mock('fs', mockFs({
    fsOpendirResponse,
    fsReadFileResponse,
    fsStatResponse,
  }));

  controller = mock.reRequire('../src/controller');

  const { name } = fsOpendirResponse[0];

  const result = await controller.getFileSystemContents(
    faker.system.directoryPath(),
    name,
  );

  testDirectoryEntry(t, result, {
    contents: fsReadFileResponse,
    isDirectory,
    name,
    size: fsStatResponse.size,
    uid: fsStatResponse.uid,
  });
});

test('getFileSystemContents with dir destination', async (t) => {
  const isDirectory = true;
  const fsStatResponse = generateFsStats(isDirectory);
  const fsReadFileResponse = faker.lorem.paragraph();
  const fsOpendirResponse = [
    generateFsDirent(isDirectory),
    generateFsDirent(false),
  ];

  mock('fs', mockFs({
    fsOpendirResponse,
    fsReadFileResponse,
    fsStatResponse,
  }));

  controller = mock.reRequire('../src/controller');

  const results = await controller.getFileSystemContents(
    faker.system.directoryPath(),
    fsOpendirResponse[0].name,
  );

  results.forEach((result, i) => {
    testDirectoryEntry(t, result, {
      contents: undefined,
      isDirectory,
      name: fsOpendirResponse[i].name,
      size: fsStatResponse.size,
      uid: fsStatResponse.uid,
    });
  });
});

test('getFileSystemContents when destination not found', async (t) => {
  const isDirectory = true;
  const fsStatResponse = generateFsStats(isDirectory);
  const fsReadFileResponse = faker.lorem.paragraph();
  const fsOpendirResponse = [
    generateFsDirent(isDirectory),
    generateFsDirent(false),
  ];

  mock('fs', mockFs({
    fsOpendirResponse,
    fsReadFileResponse,
    fsStatResponse,
  }));

  controller = mock.reRequire('../src/controller');

  await t.throwsAsync(
    controller.getFileSystemContents(
      faker.system.directoryPath(),
      // This filename doesn't exist in our mock opendir response. 
      faker.system.fileName(),
    )
  );
});
