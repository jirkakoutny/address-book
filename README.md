[firebase-url]: https://firebase.com
[rfc-http-url]: https://www.ietf.org/rfc/rfc2616.txt
[jwt-url]: http://jwt.io
[mongoDB-url]: https://www.mongodb.com

# Backend Test Project - Addressbook

## Prerequsities

  * [Firebase][firebase-url] app created.
  * [MongoDB][mongoDB-url] server running.
  * NodeJS v8 

## Run

Clone the repon, rename ```config.json.example``` to ```config.json```, fill in specific settings and run:

```npm install && npm start```

### Settings that are needed

  * ```PORT``` Port where to run Express on development environment
  * ```MONGODB_URI``` MongoDB URI for development environment
  * ```JWT_SECRET``` Secret for JWT
  * ```JWT_VALIDITY``` Token Expiration (exp claim) for JWT
  * ```FIREBASE_DB_URL``` Firebase DB URL for an environment
  * ```FIREBASE_PRIVATE_KEY``` Firebase private key for test environment
  * ```FIREBASE_CLIENT_EMAIL``` Firebase client email for test environment

## Test

Clone the repon, rename ```config.json.example``` to ```config.json```, fill in specific settings and run:

```npm install && npm test```

For restarting the tests during development using ```nodemon``` use:

```npm install && npm run test-watch```

## Deploy

The same environment variables as before are expected to be set. 

## API 

  * ```POST /users``` Register new user
  * ```POST /user/login``` Sign in a user
  * ```GET /users/me``` Logged user info
  * ```DELETE /users/me/token``` Logout user
  * ```POST /contacts``` Create new contact

## Demo

https://afternoon-sands-34791.herokuapp.com
