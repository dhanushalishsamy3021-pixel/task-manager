# Task Manager - MERN Stack

## Features
- User Registration and Login
- JWT Authentication
- Create, Update, Delete Tasks
- Toggle Task Status (Pending/Completed)
- Search and Filter Tasks
- Pagination
- Responsive UI

## Tech Stack
- MongoDB, Express.js, React.js, Node.js

## Setup Instructions

### Backend
cd backend
npm install
# Add .env file with MONGO_URI and JWT_SECRET
npm run dev

### Frontend
cd frontend
npm install
npm start

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| PATCH | /api/tasks/:id/toggle | Toggle status |
