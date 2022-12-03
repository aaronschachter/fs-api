This [Express](https://expressjs.com/) application provides a REST API to display file information in a given file system path.

### Installation

* Install Node.js and [Docker Compose](https://docs.docker.com/compose/install/)
* Clone this repository
* Run `npm install` 
* Copy the `.env.example` as `.env`
* In `.env.`, set the `ROOT_DIR` value to the desired file system path 

### Usage

After completing the installation steps, run `docker-compose up` to start the API server locally (running on http://localhost:3000).

* See [API documentation](/docs/).

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
$ npm test
```
