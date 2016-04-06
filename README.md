# launcher

This project was generated with the [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) version 3.5.0.

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node ^4.2.3, npm ^2.14.7
- [Bower](bower.io) (`npm install --global bower`)
- [Ruby](https://www.ruby-lang.org) and then `gem install sass`
- [Grunt](http://gruntjs.com/) (`npm install --global grunt-cli`)
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`

### Developing

1. Run `npm install` to install server dependencies.

2. Run `bower install` to install front-end dependencies.

3. Run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running

4. Run `grunt serve` to start the development server. It should automatically open the client in your browser when ready.

## Build & development

Run `grunt build` for building and `grunt serve` for preview.

## Testing

Running `npm test` will run the unit tests with karma.


### Pushing to Docker

We use Dokku (https://github.com/dokku/dokku) for deployment to Digital Ocean. Dokku is a platform similar to Heroku based on Docker. 

Following is an example to push the code to launcher:

1. Run `grunt --force` to create a new build.
 
2. The build creates a `dist` folder, which has all the production ready code minified and compressed.
 
3. Change folder `cd dist`
 
4. The first time you deploy, you need to add a git root in this folder, so `git init`
 
5. `git add .`
 
6. `git remote add staging dokku@staging.edorble.com:launcher` 
 
7. `git commit -m 'new build'`

8. `git push staging master`

And you are all set!

Questions? krishna@bitbakery.io

