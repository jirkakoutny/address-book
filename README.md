[firebase-url]: https://firebase.com
[rfc-http-url]: https://www.ietf.org/rfc/rfc2616.txt
[jwt-url]: http://jwt.io

# Backend Test Project - Addressbook

Your task is to implement a simple AddressBook backend API. Detailed specifications for the test project are provided below. We estimate that you will not need more than a single weekend at relaxed coding speed to implement it.

## Run

```npm install && npm start```

Rename ```config.json.example``` to ```config.json``` and fill in specific settings.

## Test

```npm install && npm test```

```npm install && npm test-watch```

## Deploy

App epects the following environment variables to be set.

FIREBASE_CLIENT_EMAIL,
FIREBASE_DB_URL,      
FIREBASE_PRIVATE_KEY, 
JWT_SECRET,
JWT_VALIDITY,
MONGODB_URI

## Demo

https://afternoon-sands-34791.herokuapp.com

## API 

POST /users

GET /users/ne

POST /user/login

DELETE /users/me/token

POST /contacts


