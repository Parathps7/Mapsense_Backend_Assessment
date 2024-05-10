Here's the documentation for the Assessment given by Parath Safaya for Mapsense Backend Assessment.
---

# Location-based Service API

This API provides endpoints for handling location-based services, including collecting GPS coordinates, calculating distances between coordinates, finding the closest recorded location, and managing user authentication.

## env variables
- **CONNECTION_STRING** = `<CONNECTION STRING>`
- **ACCESS_TOKEN_SECRET** = `<ACCESS KEY>`
- **PORT** = `<PORT NUMBER>`
- **EMAIL_USER** = `<EMAIL FROM WHICH RESET PASSWORD TOKEN WILL BE SENT> `
- **EMAIL_PASSWORD**= `<PASSWORD OF EMAIL>`

## API Endpoints

### Get Random Coordinates
- **Endpoint**: `/api/coordinates`
- **Method**: `GET`
- **Description**: Get Random Coordinates.
- **Response**: Returns a Random Coordinate.

### Collect GPS Coordinates 
Stores GPS coordinates given by the logged in user

- **Endpoint**: `/api/location/add`
- **Method**: `POST`
- **Description**: Collect GPS coordinates by providing latitude and longitude.
- **Authorization**: Bearer token required.
- **Request Body**:
  ```json
  {
    "latitude": 37.7749,
    "longitude": -122.4194
  }
  ```
- **Response**: Returns the created location details.

### View GPS Coordinates 
Views GPS coordinates given by the logged in user

- **Endpoint**: `/api/location/view`
- **Method**: `GET`
- **Description**: Shows GPS coordinates by providing latitude and longitude.
- **Authorization**: Bearer token required.
- **Response**: Returns the location details.

### Delete GPS Coordinates 
Deletes GPS coordinates given by the logged in user

- **Endpoint**: `/api/location/delete/{id}`
- **Method**: `DELTE`
- **Description**: Deletes GPS coordinates by providing latitude and longitude.
- **Authorization**: Bearer token required.
- **Response**: Deletes the location with given id passed in params.

### Calculate Distance

- **Endpoint**: `/api/distance`
- **Method**: `POST`
- **Description**: Calculate the Haversine distance between two sets of coordinates.
- **Authorization**: Bearer token required.
- **Request Body**:
  ```json
  {
    "coordinate1": {
      "latitude": 37.7749,
      "longitude": -122.4194
    },
    "coordinate2": {
      "latitude": 37.7749,
      "longitude": -122.4194
    }
  }
  ```
- **Response**: Returns the calculated Haversine distance in meters.

### Find Closest Location
Finds the closest coordinates along with Haversine distance from user coordinates
- **Endpoint**: `/api/closest`
- **Method**: `POST`
- **Description**: Find the closest recorded location to a given point.
- **Authorization**: Bearer token required.
- **Request Body**:
  ```json
  {
    "latitude": 37.7749,
    "longitude": -122.4194
  }
  ```
- **Response**: Returns the closest recorded location details.

## How to Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

2. Start the test:
   ```bash
   npm test
   ```

4. Open Swagger UI:
   ```
   http://localhost:3000/api-docs
   ```

## Extra Features

- **JWT Authentication**: User authentication is implemented using JWT tokens. Endpoints requiring authorization expect a Bearer token in the request header.
- **User Endpoints**: User endpoints for authentication, such as login, registration, forget-password, reset-password are available.
---

