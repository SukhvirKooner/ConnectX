# API Integration Documentation

## Overview

This document outlines how the frontend connects to the backend API at `http://localhost:5001`. The integration includes authentication, user profiles, posts, and skills management.

## API Base URL

The API is configured to connect to `http://localhost:5001`. This can be modified in the `src/services/api.ts` file if needed.

## Authentication

The application uses JWT (JSON Web Token) authentication with access and refresh tokens.

### Token Management

- Access tokens are used for API requests and stored in localStorage
- Refresh tokens are used to obtain new access tokens when they expire
- Token management is handled in `src/services/auth.ts`

### Authentication Flow

1. User registers or logs in
2. Backend returns user data with access and refresh tokens
3. Tokens are stored in localStorage
4. Access token is automatically added to API requests
5. If a request returns 401 Unauthorized, the system attempts to refresh the token
6. If refresh fails, the user is logged out

## API Services

The API integration is organized into service modules:

- `api.ts` - Core axios instance with interceptors for authentication
- `auth.ts` - Token management utilities
- `authService.ts` - Authentication API endpoints
- `userService.ts` - User profile API endpoints
- `postService.ts` - Posts API endpoints
- `skillService.ts` - Skills API endpoints

## React Query Integration

The application uses React Query for data fetching, caching, and state management. Custom hooks are provided for all API operations:

- `use-api.ts` - Generic API query and mutation hooks
- `use-auth-api.ts` - Authentication-related hooks
- `use-posts-api.ts` - Post-related hooks
- `use-skills-api.ts` - Skill-related hooks

## Available Endpoints

### Authentication

- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Refresh Token: `POST /api/auth/refresh`
- Logout: `POST /api/auth/logout`
- Get Current User: `GET /api/auth/me`

### Users

- Get User Profile: `GET /api/users/:id`
- Update User Profile: `PUT /api/users/:id`
- Complete Profile: `POST /api/users/complete-profile`
- Upload Avatar: `POST /api/users/upload-avatar`
- Search Users: `GET /api/users/search`

### Skills

- Get All Skills: `GET /api/skills`
- Get Skill by ID: `GET /api/skills/:id`
- Add Skill to User Profile: `POST /api/skills/user`
- Remove Skill from User Profile: `DELETE /api/skills/user/:id`
- Get User Skills: `GET /api/skills/user/:userId`

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

## Error Handling

API errors are handled consistently throughout the application:

1. Errors are logged to the console
2. User-friendly error messages are displayed using toast notifications
3. Components handle loading and error states appropriately

## Usage Examples

### Authentication

```tsx
import { useLogin } from '@/hooks';

function LoginForm() {
  const { mutate: login, isLoading } = useLogin();
  
  const handleSubmit = (data) => {
    login(data);
  };
  
  return (
    // Login form
  );
}
```

### Fetching Data

```tsx
import { usePosts } from '@/hooks';

function PostsList() {
  const { data, isLoading, error } = usePosts({ limit: 10 });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;
  
  return (
    <div>
      {data.map(post => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  );
}
```

### Mutations

```tsx
import { useCreatePost } from '@/hooks';

function CreatePostForm() {
  const { mutate: createPost, isLoading } = useCreatePost();
  
  const handleSubmit = (data) => {
    createPost(data);
  };
  
  return (
    // Post creation form
  );
}
```