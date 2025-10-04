# HN Real Estate

A full-stack real estate application built with React, TypeScript, Node.js, Express, and MongoDB.

## Project Structure

```
HNrealstate/
├── frontend/          # React frontend application
├── backend/           # Node.js/Express API server
├── admin-panel/       # React admin dashboard
└── README.md
```

## Tech Stack

### Frontend & Admin Panel
- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Material-UI** (admin panel only)
- **Axios** for API calls

### Backend
- **Node.js** with **Express**
- **TypeScript**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HNrealstate
   ```

2. **Install dependencies for all applications**
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install

   # Admin Panel
   cd ../admin-panel
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB URI and other settings
   ```

4. **Start the applications**

   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm start
   ```

   **Admin Panel (Terminal 3):**
   ```bash
   cd admin-panel
   npm start
   ```

## Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests

### Frontend & Admin Panel
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create new property (auth required)
- `PUT /api/properties/:id` - Update property (auth required)
- `DELETE /api/properties/:id` - Delete property (auth required)

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Features

### Frontend (Public Website)
- Property listings with search and filters
- Property detail pages
- User authentication
- Contact forms
- Responsive design

### Admin Panel
- Dashboard with analytics
- Property management (CRUD operations)
- User management
- File upload for property images
- Role-based access control

### Backend API
- RESTful API design
- JWT authentication
- Input validation
- Error handling
- File upload support
- Database relationships

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
