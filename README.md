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

## Brief Explanation
There are 2 main routes in the application:
* `/health` - Contains some API data and hyperlinks to other routes:
  ```json
  {
    "apiName": "eng-zap-challenge",
    "uptime": "00:10",
    "creator": "Vinicius Menezes",
    "endpoints": {
      "realState": {
        "vivaReal": "http://localhost:3000/realState/vivaReal",
        "zap": "http://localhost:3000/realState/zap"
      }
    },
  }
  ```
* `/realState/zap` or `/realState/vivareal?limit=10&page=1` - Real State Lists with optional parameters (`limit` and `page`).
  ```json
  {
    "pageNumber": 1,
    "pageSize": 1,
    "pageCount": 5019,
    "totalCount": 5019,
    "listing": [
    ...
    ]
  }
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
