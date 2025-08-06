# Skills API Documentation

This document outlines the API endpoints for managing skills in the ConnectX platform.

## Base URL

All endpoints are prefixed with `/api/skills`.

## Authentication

All endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Get All Skills

Retrieve a paginated list of all skills, with optional filtering by category and search term.

- **URL**: `/`
- **Method**: `GET`
- **Query Parameters**:
  - `category` (optional): Filter skills by category
  - `search` (optional): Search skills by name
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Number of items per page (default: 20)
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Skills retrieved successfully",
    "data": {
      "items": [
        {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "JavaScript",
          "category": "Programming Languages",
          "createdAt": "2023-01-01T00:00:00.000Z",
          "updatedAt": "2023-01-01T00:00:00.000Z"
        },
        // More skills...
      ],
      "totalItems": 100,
      "currentPage": 1,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
  ```

### Get Skill by ID

Retrieve a specific skill by its ID.

- **URL**: `/:id`
- **Method**: `GET`
- **URL Parameters**:
  - `id`: Skill ID
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Skill retrieved successfully",
    "data": {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "JavaScript",
      "category": "Programming Languages",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```
- **Error Response**: `404 Not Found`
  ```json
  {
    "success": false,
    "message": "Skill not found"
  }
  ```

### Add Skill to User Profile

Add a skill to the authenticated user's profile.

- **URL**: `/user`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "skill_id": "60d21b4667d0d8992e610c85"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "message": "Skill added to your profile",
    "data": {
      "_id": "60d21b4667d0d8992e610c86",
      "user_id": "60d21b4667d0d8992e610c87",
      "skill_id": {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "JavaScript",
        "category": "Programming Languages"
      },
      "endorsements_count": 0,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Skill already added or invalid request
  - `404 Not Found`: Skill not found

### Remove Skill from User Profile

Remove a skill from the authenticated user's profile.

- **URL**: `/user/:id`
- **Method**: `DELETE`
- **URL Parameters**:
  - `id`: UserSkill ID (not the Skill ID)
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Skill removed from your profile"
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: Not authorized to remove this skill
  - `404 Not Found`: User skill not found

### Get User Skills

Retrieve a paginated list of skills for a specific user.

- **URL**: `/user/:userId`
- **Method**: `GET`
- **URL Parameters**:
  - `userId`: User ID
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Number of items per page (default: 10)
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "User skills retrieved successfully",
    "data": {
      "items": [
        {
          "_id": "60d21b4667d0d8992e610c86",
          "user_id": "60d21b4667d0d8992e610c87",
          "skill_id": {
            "_id": "60d21b4667d0d8992e610c85",
            "name": "JavaScript",
            "category": "Programming Languages"
          },
          "endorsements_count": 5,
          "createdAt": "2023-01-01T00:00:00.000Z",
          "updatedAt": "2023-01-01T00:00:00.000Z"
        },
        // More skills...
      ],
      "totalItems": 15,
      "currentPage": 1,
      "totalPages": 2,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
  ```
- **Error Response**: `404 Not Found`
  ```json
  {
    "success": false,
    "message": "User not found"
  }
  ```

### Endorse a User Skill

Endorse a skill for another user.

- **URL**: `/endorse/:userSkillId`
- **Method**: `POST`
- **URL Parameters**:
  - `userSkillId`: UserSkill ID
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "message": "Skill endorsed successfully",
    "data": {
      "endorsement": {
        "_id": "60d21b4667d0d8992e610c88",
        "user_skill_id": "60d21b4667d0d8992e610c86",
        "endorser_id": "60d21b4667d0d8992e610c89",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      },
      "endorsements_count": 6
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Cannot endorse your own skill or already endorsed
  - `404 Not Found`: User skill not found

### Get Skill Endorsements

Retrieve a paginated list of endorsements for a specific user skill.

- **URL**: `/endorsements/:userSkillId`
- **Method**: `GET`
- **URL Parameters**:
  - `userSkillId`: UserSkill ID
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Number of items per page (default: 10)
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Skill endorsements retrieved successfully",
    "data": {
      "items": [
        {
          "_id": "60d21b4667d0d8992e610c88",
          "user_skill_id": "60d21b4667d0d8992e610c86",
          "endorser_id": {
            "_id": "60d21b4667d0d8992e610c89",
            "name": "Jane Doe",
            "avatar_url": "https://example.com/avatar.jpg",
            "title": "Software Engineer"
          },
          "createdAt": "2023-01-01T00:00:00.000Z",
          "updatedAt": "2023-01-01T00:00:00.000Z"
        },
        // More endorsements...
      ],
      "totalItems": 6,
      "currentPage": 1,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
  ```
- **Error Response**: `404 Not Found`
  ```json
  {
    "success": false,
    "message": "User skill not found"
  }
  ```

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // Optional array of validation errors
}
```

## Status Codes

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request or validation error
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Not authorized to perform the action
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error