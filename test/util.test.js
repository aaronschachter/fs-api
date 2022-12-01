const test = require('ava');

const util = require('../src/util');

test('getDestinationPaths without trailing slash', (t) => {
  const constPathParts = ['shows', 'breaking-bad', 'episodes', '52'];
  const destination = constPathParts.join('/');
  const result = util.getDestinationPaths(destination);

  constPathParts.forEach((path, i) => {
    t.is(path, result[i]);
  })
});

test('getDestinationPaths with trailing slash', (t) => {
  const constPathParts = ['shows', 'lost', 'episodes', '20'];
  const destination = `${constPathParts.join('/')}/`;
  const result = util.getDestinationPaths(destination);

  constPathParts.forEach((path, i) => {
    t.is(path, result[i]);
  })
});

test('getOctalFormat', (t) => {
  t.is(util.getOctalFormat(16877), '0755');
  t.is(util.getOctalFormat(33188), '0644');
});
