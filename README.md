# ConnectX - Professional Networking Platform

## Overview

ConnectX is a modern professional networking platform designed to connect professionals, share content, and discover job opportunities. The platform features a responsive UI, real-time notifications, and comprehensive social networking capabilities.

## Features

- **User Authentication**: Secure JWT-based authentication system
- **Profile Management**: Create and customize professional profiles
- **Social Networking**: Connect with other professionals
- **Content Sharing**: Create, like, comment on, and share posts
- **Job Listings**: Browse and apply for job opportunities
- **Real-time Notifications**: Stay updated with activities
- **Messaging**: Communicate with connections
- **Search Functionality**: Find users, posts, and jobs
  
## Demo Credentials
Use the following credentials to test the platform:

- Email: sukhvir@gmail.com
- Password: karan@1234



## Tech Stack

### Frontend
- React with TypeScript
- React Router for navigation
- React Query for data fetching and state management
- Shadcn UI components
- Tailwind CSS for styling
- Axios for API requests
- Zod for schema validation

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Express Validator for request validation

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd backend2

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

### Frontend Setup

```bash
# Navigate to frontend directory
cd Front-End

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will be available at `http://localhost:5173` and the backend API at `http://localhost:5001`.

## API Documentation

The API is organized into the following endpoints:

### Authentication
- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Logout: `POST /api/auth/logout`
- Get Current User: `GET /api/auth/me`

### Users
- Get User Profile: `GET /api/users/:id`
- Update User Profile: `PUT /api/users/:id`
- Complete Profile: `POST /api/users/complete-profile`
- Upload Avatar: `POST /api/users/upload-avatar`
- Search Users: `GET /api/users/search`

### Posts
- Get Posts: `GET /api/posts`
- Create Post: `POST /api/posts`
- Get Post by ID: `GET /api/posts/:id`
- Update Post: `PUT /api/posts/:id`
- Delete Post: `DELETE /api/posts/:id`
- Toggle Like on Post: `POST /api/posts/:id/like`
- Get Post Likes: `GET /api/posts/:id/likes`
- Add Comment to Post: `POST /api/posts/:id/comments`
- Get Post Comments: `GET /api/posts/:id/comments`
- Share Post: `POST /api/posts/:id/share`

### Skills
- Get All Skills: `GET /api/skills`
- Get Skill by ID: `GET /api/skills/:id`
- Add Skill to User Profile: `POST /api/skills/user`
- Remove Skill from User Profile: `DELETE /api/skills/user/:id`
- Get User Skills: `GET /api/skills/user/:userId`

## Project Structure

```
├── Front-End/           # Frontend React application
│   ├── public/          # Static assets
│   ├── src/             # Source code
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React context providers
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions
│   │   ├── pages/       # Page components
│   │   └── services/    # API service modules
│   └── README.md        # Frontend documentation
│
└── backend2/           # Backend Express application
    ├── src/            # Source code
    │   ├── config/     # Configuration files
    │   ├── controllers/# Route controllers
    │   ├── middlewares/# Express middlewares
    │   ├── models/     # Mongoose models
    │   ├── routes/     # API routes
    │   ├── services/   # Business logic
    │   ├── utils/      # Utility functions
    │   └── validations/# Request validation schemas
    ├── uploads/        # Uploaded files
    └── README.md       # Backend documentation
```
