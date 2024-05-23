# Description.
**Project Name:** Notely.
**Description:** This project is an API which enables the client to Create, Edit, Delete and Save notes in a database.

# Installation Instructions.

```shell
npm ts-jest config:init
```

# Usage

# Endpoint Documentation.

## a. Authentication.

**1.Register a user**

Request: 
```http
POST /api/auth/register
```


Response:

    status: 201 CREATED

    content-Type: application/json
```json
{
    success: true,
    message: "User Registered",
}

```

**2.Login a user**

Request: 
``` 
POST /api/auth/login
```


Response:

    status: 200 OK
    
    content-Type: application/json
```json
{
    success: true,
    message: "User Login Succeeded",
}

```

**3.Logout a user**

Request: 
``` 
POST /api/auth/logout
```
Response:
    
    status: 204 NO_CONTENT



## b. Users.
**1. Get User Info**

Request: 
```http
GET /api/users
```


Response:

    status: 200 CREATED

    content-Type: application/json
```json
{
    success: true,
    message: "User Registered",
}
```
**2. Update Username of a user**

Request: 
```http
PATCH /api/users
```
```json
{
    username: "Robertson",
}
```

Response:

    status: 204 NO_CONTENT

   
## c. Notes.
**1. Create a note.**
Request:
```http
POST api/notes/
```

**2. Get all notes.**
Request:
```http
GET api/notes/
```

**3. Get a note by Id.**
Request:
```http
GET api/notes/:noteId
```

**4. Search a note by title.**
Request:
```http
GET api/notes?title="good"
```

**5. Search a note by Category Id.**
Request:
```http
GET api/notes?categoryId="fgs324"
```

**6. Search a note by details.**
Request:
```http
GET api/notes?details="if your are"
```

**7. Update data of a note.**
Request:
```http
PATCH api/notes/:noteId
```
```json
newValue: "great"
```

**8. Delete a note.**
Request:
```http
DELETE api/notes/:noteId
```

## d. Categories.









# Authentication.

# Examples.

## Example 1
```Javascript
import axios from "axios"

const baseUrl = "http://192.168.1.66:5000/"

try {
    const response = await axios.get(baseUrl);
}catch(error) {
    console.error(error);
}

```


# Error Handling.

# Contributing.

# About.

# Features.

