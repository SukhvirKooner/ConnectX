# ConnectX Frontend

## Overview

This is the frontend application for ConnectX, a professional networking platform. It's built with React, TypeScript, and Shadcn UI components with Tailwind CSS for styling.

## Features

- **Modern UI**: Clean and responsive user interface built with Shadcn UI and Tailwind CSS
- **Authentication**: JWT-based authentication with access and refresh tokens
- **Profile Management**: Create and update professional profiles
- **Social Networking**: Connect with other professionals
- **Content Sharing**: Create, like, comment on, and share posts
- **Real-time Notifications**: Stay updated with activities
- **Messaging**: Communicate with connections
- **Job Listings**: Browse and apply for job opportunities
- **Search Functionality**: Find users, posts, and jobs

## Tech Stack

- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **React Router**: Client-side routing
- **React Query**: Data fetching and state management
- **Axios**: HTTP client
- **Shadcn UI**: Component library based on Radix UI
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Form handling
- **Zod**: Schema validation
- **Lucide React**: Icon library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## Project Structure

```
├── public/          # Static assets
├── src/             # Source code
│   ├── components/  # Reusable UI components
│   │   ├── auth/    # Authentication components
│   │   ├── layout/  # Layout components
│   │   └── ui/      # UI components from Shadcn
│   ├── context/     # React context providers
│   │   ├── AuthContext.tsx        # Authentication state
│   │   └── AuthModalContext.tsx   # Auth modal state
│   ├── hooks/       # Custom React hooks
│   │   ├── use-api.ts             # Generic API hooks
│   │   ├── use-auth-api.ts        # Auth API hooks
│   │   └── use-posts-api.ts       # Posts API hooks
│   ├── lib/         # Utility functions
│   ├── pages/       # Page components
│   │   ├── Index.tsx              # Home page
│   │   ├── NetworkPage.tsx        # Network page
│   │   ├── ProfilePage.tsx        # Profile page
│   │   └── ...                    # Other pages
│   └── services/    # API service modules
│       ├── api.ts                 # Axios instance
│       ├── auth.ts                # Token management
│       ├── authService.ts         # Auth API
│       ├── postService.ts         # Posts API
│       └── ...                    # Other services
```

## API Integration

The frontend connects to the backend API at `http://localhost:5001`. See [API_INTEGRATION.md](./API_INTEGRATION.md) for detailed documentation.

### Authentication Flow

1. User registers or logs in
2. Backend returns user data with access and refresh tokens
3. Tokens are stored in localStorage
4. Access token is automatically added to API requests
5. If a request returns 401 Unauthorized, the system attempts to refresh the token
6. If refresh fails, the user is logged out

## Component Library

The application uses Shadcn UI, a collection of reusable components built on top of Tailwind CSS and Radix UI primitives. These components are imported into the project rather than installed as a dependency, allowing for easy customization.

### Key Components

- **Dialog/Modal**: Used for the authentication modal and other popups
- **Toast**: Used for notifications
- **Form**: Used for all forms with React Hook Form integration
- **Avatar**: Used for user profile pictures
- **Button**: Used for all buttons with various styles
- **Card**: Used for posts, profile cards, and other content containers

## State Management

The application uses a combination of React Context and React Query for state management:

- **AuthContext**: Manages authentication state
- **AuthModalContext**: Manages the authentication modal state
- **React Query**: Manages server state (data fetching, caching, and updates)

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing component structure
- Use React Query for all API calls
- Use React Hook Form for all forms
- Use Zod for form validation

### Adding New Features

1. Create new components in the appropriate directory
2. Create new API services if needed
3. Create new hooks for data fetching
4. Add new routes in App.tsx if needed

### Troubleshooting

- If you encounter authentication issues, check the token management in the browser's localStorage
- If API calls fail, check the network tab in the browser's developer tools
- If components don't render as expected, check the React DevTools

## License

This project is licensed under the MIT License.