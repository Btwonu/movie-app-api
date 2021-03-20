# Tasks

- API

  - Auth
    - register
    - login
      - create POST JSON request containing username && password
      - send request from FE to API @ /login
      - on BE find user in DB
      - sign JWT
      - send response to FE
      - save JWT in local storage

- Third-party API - [The Movie DB](https://www.themoviedb.org/)

  - GET movies
    - get familiar with API
  - GET genres
    - build genres UI

- Database

  - Models

    - User

      - **handle** _string_ _required_ _unique_ _USER UID_
      - **username** _string_ _required_ _unique_
      - **age** _number_
      - **createdCollections** _array_ [ref: _Collection_]
      - **followedCollections** _array_ [ref: _Collection_]
      - **friends** _array_ [ref: _User_]
      - **likedMovies**
      - **avatar**

    - Collection

      - **name** _string_ _required_ _minLength_
      - **description** _string_ _required_ _minLength_
      - **movies** _array_ [string: _movieId_]
      - **creator** [ref: _User_]

    - Movie

      `depends on third-party`

      - **title** _string_
      - **year** _string_ _regex_
      - **genre** _string_
      - **rating** _number_
      - **summary** _string_ _minLength_
      - **trailerUrl** _string_ _regex_

# MVP

- Have the option to switch between couple of different routes to show different movie lists
- Should have a search function for the lists of movies
- Should be able to like movies
- Should be able to register/login
- Should have a profile and store liked movies
- _Should be able to filter movies_

- Should be able to list users
- Should be able to add a user as friend
- Should be able to see friend's liked movies
- Should be able to suggest a movie to a friend

## Pages

### Movies

- Popular
- Top Rated
- Upcoming

### Auth

- Register
- Login

### User

- Users

# Firebase

- Hosting
  - host React's build folder
  - rewrite /api route to Functions
- Functions
  - provide the API
  - Express
  - fetch data from third-party APIs
- Config
  - import sdk config in functions
- Firestore
  - store data
- Auth
