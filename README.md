This [Express](https://expressjs.com/) application provides a REST API to display file information for a given file system path.

### Installation

* Install Node.js and [Docker Compose](https://docs.docker.com/compose/install/)
* Clone this repository
* Run `npm install` 
* Copy the `.env.example` as `.env`
* In `.env.`, set the `ROOT_DIR` value to the desired file system path 

### Usage

After completing the installation steps, run `docker-compose up` to start the API server locally (running on http://localhost:3000).

```
$ docker-compose up
```

#### Shell script

The app can be run from the command line as well:

```
$ npm run shell
```

#### Testing

To run unit tests:

```
npm test
```

## API Documentation

There is currently a single endpoint to retrieve information for files and directories within specified root directory, as well as its subdirectories:

```
GET /:path
```

This endpoint will return either:

* A single Directory Entry, if the path points to a file
* A list of Directory Entries, if the path points to a directory

If a `:path` is not specified (`GET /`), the Directory Entries in the root directory will be returned.

### Directory Entry

A Directory Entry contains the following fields:

| Field            | Type        | Description  |
| ---------------- | ----------- | ------------ |
| `isDirectory`    | boolean     | True if directory, false if file |
| `name`           | string      | The name of the file or directory (e.g. `node_modules`, `index.js`) |
| `permissions`    | string      | Octal representation of the file/directory (e.g. `0755`) |
| `size`            | number     | The file/directory size in bytes |
| `uid`            | number      | The file/directory owner's uid |


Lists of Directory Entries are sorted by the `name` field, ascending.

### Examples

The following example API requests were made when running the app with the `ROOT_DIR`  env variable set to a installed clone of this repository (`ROOT_DIR="/Users/aaronschachter/code/fs-api"`):

#### Root directory contents

```
GET /
```

If a path is not specified, the Directory Entries in the root directory are returned.

<details>
<summary>Response</summary>

```
[
  {
    isDirectory: false,
    name: '.env',
    permissions: '0644',
    size: 48,
    uid: 501
  },
  {
    isDirectory: false,
    name: '.env.example',
    permissions: '0644',
    size: 86,
    uid: 501
  },
  {
    "isDirectory": true,
    "name": ".git",
    "permissions": "0755",
    "size": 448,
    "uid": 501
  },
  {
    "isDirectory": false,
    "name": ".gitignore",
    "permissions": "0644",
    "size": 13,
    "uid": 501
  },
  {
    "isDirectory": false,
    "name": "README.md",
    "permissions": "0644",
    "size": 4790,
    "uid": 501
  },
  {
    "isDirectory": false,
    "name": "index.js",
    "permissions": "0644",
    "size": 300,
    "uid": 501
  },
  {
    "isDirectory": true,
    "name": "node_modules",
    "permissions": "0755",
    "size": 6752,
    "uid": 501
  },
  {
    "isDirectory": false,
    "name": "package-lock.json",
    "permissions": "0644",
    "size": 164198,
    "uid": 501
  },
  {
    "isDirectory": false,
    "name": "package.json",
    "permissions": "0644",
    "size": 381,
    "uid": 501
  },
  {
    "isDirectory": false,
    "name": "shell.js",
    "permissions": "0644",
    "size": 754,
    "uid": 501
  },
  {
    "isDirectory": true,
    "name": "src",
    "permissions": "0755",
    "size": 160,
    "uid": 501
  },
  {
    "isDirectory": true,
    "name": "test",
    "permissions": "0755",
    "size": 128,
    "uid": 501
  }
]
```
</details>

#### Subdirectory contents

```
GET /src/
```

If a subdirectory path is specified, its Directory Entries are returned.


<details>
<summary>Response</summary>

```
[
  {
    "isDirectory": false,
    "name": "controller.js",
    "permissions": "0644",
    "size": 2401,
    "uid": 501
  },
  {
    "isDirectory": false,
    "name": "routes.js",
    "permissions": "0644",
    "size": 436,
    "uid": 501
  },
  {
    "isDirectory": false,
    "name": "util.js",
    "permissions": "0644",
    "size": 656,
    "uid": 501
  }
]
```
</details>

#### File contents

```
GET /src/util.js
```

When a file path is specified, a single Directory Entry is returned.


<details>
<summary>Response</summary>

```
{
  isDirectory: false,
  name: 'util.js',
  permissions: '0644',
  size: 656,
  uid: 501,
  contents: '/**\n' +
    ' * @param {number} mode \n' +
    ' * @returns {string}\n' +
    ' */\n' +
    '// @see https://www.martin-brennan.com/nodejs-file-permissions-fstat/\n' +
    "const getOctalFormat = (mode) => `0${(mode & parseInt('777', 8)).toString(8)}`;\n" +
    '\n' +
    '/**\n' +
    ' * @param {string} destination \n' +
    ' * @returns {Array}\n' +
    ' */\n' +
    'const getDestinationPaths = (destination) => {\n' +
    '  // Remove trailing slash, if exists\n' +
    '  // @see https://bobbyhadz.com/blog/javascript-remove-trailing-slash-from-string#remove-a-trailing-slash-from-a-string\n' +
    "  return destination.replace(/\\/+$/, '').split('/');\n" +
    '}\n' +
    '\n' +
    'const getRootDirInput = () => process.argv[2];\n' +
    '\n' +
    'module.exports = {\n' +
    '  getDestinationPaths,\n' +
    '  getOctalFormat,\n' +
    '  getRootDirInput,\n' +
    '};\n'
}
```
</details>

## Roadmap

Future iterations of this API may include:

### Directory List query parameters

* Filter by `isDirectory` (`GET /src?isDirectory=true`)
* Sorting by other fields (`GET /src?sort=size,desc`).

### Additional endpoints

Build functionality to create, update, and delete Directory Entries.

#### Create Directory Entry

```
POST /:path
```

Create a new file or directory by specifying the desired location in the URL.


| Field       | Type    | Description                                          | Required                         |
|-------------|---------|------------------------------------------------------|----------------------------------|
| isDirectory | boolean | Whether this is a directory (true) or a file (false) | Yes                              |
| name        | string  | The name of the file/directory                       | Yes                              |
| permissions | string  | The octal representation of the file/directory       | Yes                              |
| uid         | number  | The file/directory owner                             | Yes                              |
| contents    | string  | The contents of the file, if not a directory         | Only when `isDirectory` is false |

The newly created Directory Entry would be returned in the API response.

*Example request:*

```
curl -d '{"uid":501,"name":"letItGo.txt","contents":"The snow glows white on the mountain tonight","isDirectory":false,"permissions":"0644"}' -H 'Content-Type: application/json' 
  http://localhost:3000/src/
```

*Example response:*
```
{
  "isDirectory": false,
  "name": "letItGo.txt",
  "permissions": "0644",
  "size": 6670,
  "uid": 501,
  "contents": "The snow glows white on the mountain tonight"
}
```

#### Update Directory Entry

```
PUT /:path
```

Updates a file or directory that exists in the path.

| Field       | Type    | Description                                          | Required                         |
|-------------|---------|------------------------------------------------------|----------------------------------|
| name        | string  | The name of the file/directory                       | Yes                              |
| permissions | string  | The octal representation of the file/directory       | Yes                              |
| uid         | number  | The file/directory owner                             | Yes                              |
| contents    | string  | The contents of the file, if not a directory         | Only when `isDirectory` is false |

**Note:** The `isDirectory` field is not editable.

#### Delete Directory Entry

```
DELETE /:path
```

This endpoint will delete the file or directory that exists at the given path (e.g. `DELETE /test/util.test.js`).

If deleting a directory, we may want to return a 422 if the directory is not empty, or allow passing a query parameter to recursively delete all files within the directory (e.g. `DELETE /test?recursive=true`).


### Permission checks

Inspect a Directory Entry's `permissions` field value to determine whether it can be accessed (or modified/deleted, if the additional endpoints are added).
