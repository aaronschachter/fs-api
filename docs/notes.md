I spent about 8-12 hours in total on this project, which were scattered across a few days/nights since receiving the assignment.

Some things I learned in the process:

* Details of Node's [`fs` module](https://nodejs.org/api/fs.html), learning about fs.promises methods and relevant [`fs.Dir`](https://nodejs.org/api/fs.html#class-fsdir), [`fs.Dirent`](https://nodejs.org/api/fs.html#class-fsdirent), and [`fs.Stats`](https://nodejs.org/api/fs.html#class-fsstats) classes.

    * The `isDirectory` method in both the `fs.Dirent` and `fs.Stats` helped guide my approach for determining what kind of objects should be returned in the API responses.

* How to Dockerize a Node application, which I've never done before. It took a bit of digging around in tutorials to realize I didn't need to use a Dockerfile, but could keep things pretty simple by using a docker-compose.yml and Docker Hub. I also learned a little bit about Docker volumes, when it was time to figure out how the Dockerized app would access a directory on my local machine.

* I never knew that a [`for await ... of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of) loop existed in Javascript. I'm familiar with using Promises.all, but liked how clean the `for await... of` loop looked when I came across it when looking up different ways to handle async calls within a for loop.

What's not working yet:

* Writing a unit test for requesting a file path that is a few levels deep (e.g. GET /Documents/songs/foo/bar/01.mp3). A way to handle this could be using `sinon` instead of `mock-require`, and making use of the [withArgs](https://sinonjs.org/releases/latest/stubs/#stubwithargsarg1-arg2-) feature to mock different responses for each call to `fs.promises.opendir` in the controller.

* Express house-keeping (enabling CORS, HTTPS) -- I put more effort into writing unit tests and thourough documentation, so skipped on these minor details, as this app isn't going to into production any time too soon (that I know of).

