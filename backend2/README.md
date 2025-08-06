# ConnectX Backend

## Overview

This is the backend API for ConnectX, a professional networking platform. It's built with Node.js, Express, and MongoDB, providing a robust and scalable API for the frontend application.

## Features

- **Authentication**: Secure JWT-based authentication with access and refresh tokens
- **User Management**: User profiles, avatars, and connections
- **Content**: Posts, comments, likes, and shares
- **File Uploads**: Support for avatar and post image uploads
- **Search**: Search functionality for users, posts, and jobs
- **Notifications**: Real-time notifications for user activities
- **Job Listings**: Job posting and application system

## Tech Stack

- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt**: Password hashing
- **Multer**: File upload handling
- **Express Validator**: Request validation
- **Helmet**: Security middleware
- **Morgan**: HTTP request logger
- **Jest**: Testing framework

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create .env file with the following variables
# PORT=5001
# MONGODB_URL=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# JWT_REFRESH_SECRET=your_jwt_refresh_secret

# Start the development server
npm run dev
```

The API will be available at `http://localhost:5001`.

### Seeding Data

```bash
# Seed skills data
npm run seed:skills
```

## Project Structure

```
├── src/                # Source code
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   │   ├── authController.js    # Authentication
│   │   ├── userController.js    # User management
│   │   ├── postController.js    # Posts
│   │   └── ...                  # Other controllers
│   ├── middlewares/    # Express middlewares
│   │   ├── authMiddleware.js    # Authentication
│   │   ├── errorMiddleware.js   # Error handling
│   │   └── ...                  # Other middlewares
│   ├── models/         # Mongoose models
│   │   ├── User.js              # User model
│   │   ├── Post.js              # Post model
│   │   └── ...                  # Other models
│   ├── routes/         # API routes
│   │   ├── authRoutes.js        # Authentication
│   │   ├── userRoutes.js        # User management
│   │   ├── postRoutes.js        # Posts
│   │   └── ...                  # Other routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   ├── validations/    # Request validation schemas
│   └── app.js          # Express app setup
├── uploads/            # Uploaded files
│   ├── avatars/        # User avatars
│   └── posts/          # Post images
├── server.js           # Server entry point
└── jest.config.js      # Jest configuration
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout a user
- `GET /api/auth/me` - Get current user

### Users

- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/complete-profile` - Complete user profile
- `POST /api/users/upload-avatar` - Upload user avatar
- `GET /api/users/search` - Search users

### Posts

- `GET /api/posts` - Get posts (with pagination)
- `POST /api/posts` - Create a post
- `GET /api/posts/:id` - Get post by ID
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post
- `POST /api/posts/:id/like` - Toggle like on a post
- `GET /api/posts/:id/likes` - Get post likes
- `POST /api/posts/:id/comments` - Add comment to a post
- `GET /api/posts/:id/comments` - Get post comments
- `POST /api/posts/:id/share` - Share a post

### Connections

- `POST /api/connections/request` - Send connection request
- `PUT /api/connections/accept/:id` - Accept connection request
- `PUT /api/connections/reject/:id` - Reject connection request
- `DELETE /api/connections/:id` - Remove connection
- `GET /api/connections` - Get user connections

### Skills

- `GET /api/skills` - Get all skills
- `GET /api/skills/:id` - Get skill by ID
- `POST /api/skills/user` - Add skill to user profile
- `DELETE /api/skills/user/:id` - Remove skill from user profile
- `GET /api/skills/user/:userId` - Get user skills

### Jobs

- `GET /api/jobs` - Get jobs (with pagination)
- `POST /api/jobs` - Create a job
- `GET /api/jobs/:id` - Get job by ID
- `PUT /api/jobs/:id` - Update a job
- `DELETE /api/jobs/:id` - Delete a job
- `POST /api/jobs/:id/apply` - Apply for a job

### Notifications

- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read

## Error Handling

The API uses a centralized error handling middleware that returns consistent error responses:

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## Authentication Flow

1. User registers or logs in
2. Server validates credentials and returns access and refresh tokens
3. Client includes access token in Authorization header for protected routes
4. When access token expires, client uses refresh token to get a new access token
5. If refresh token is invalid or expired, user must log in again

## File Uploads

The API uses Multer for handling file uploads:

- Avatars are stored in `uploads/avatars`
- Post images are stored in `uploads/posts`
- Resumes are stored in `uploads/resumes`

## Pagination

Many endpoints support pagination with the following query parameters:

- `page` - Page number (default: 1)
- `limit` - Number of items per page (default: 10)

Response includes pagination metadata:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

## Testing

The API includes unit and integration tests using Jest:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Development Guidelines

### Code Style

- Use async/await for asynchronous code
- Follow the controller-service pattern
- Validate all request inputs
- Use try/catch blocks for error handling
- Document all functions and endpoints

### Adding New Features

1. Create a new model in `src/models`
2. Create validation schemas in `src/validations`
3. Create a controller in `src/controllers`
4. Create routes in `src/routes`
5. Register routes in `src/app.js`

## Deployment

### Heroku

```bash
# Login to Heroku
heroku login

# Create a new Heroku app
heroku create

# Set environment variables
heroku config:set MONGODB_URL=your_mongodb_url
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set JWT_REFRESH_SECRET=your_jwt_refresh_secret

# Deploy to Heroku
git push heroku main
```

### Docker

```bash
# Build Docker image
docker build -t connectx-backend .

# Run Docker container
docker run -p 5001:5001 --env-file .env connectx-backend
```

## License

This project is licensed under the MIT License.