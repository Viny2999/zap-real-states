# OLX Challenge
![Heroku](https://github.com/Viny2999/eng-zap-challenge-nodejs/actions/workflows/main.yml/badge.svg)

API Develop with NodeJS and Typescript to solve Option B of OLX Challenge [described here.](https://olxbr.github.io/cultura/challenges/engineering.html)

## Instructions to Run Locally
There are two ways to run the application:
* Using Docker Compose:
  ```
  docker-compose up
  ``` 
* Using NPM:
  ```
  npm install
  npm start
  ``` 
## Tests
To start mocha unit tests run:
```
npm run test
``` 
To coverage report:
```
npm run test-coverage
``` 

## Deploy
It was a CI implemented using [Github Actions](https://docs.github.com/pt/actions).
The CI Pipeline is trigged when the main receives a new pull request or commit.
