# TodoList MERN Application

A full-stack Todo List application built with the MERN stack. This project supports user authentication via Google OAuth and a guest mode that uses localStorage to manage todos. Users can add, edit, delete, search, and toggle the completion status of todos.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
  - [Server Setup](#server-setup)
  - [Client Setup](#client-setup)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**:
  - Google OAuth 2.0 for logged-in users.
  - Guest mode that uses localStorage for todos if not logged in.
- **Todo Management**:
  - Add, edit, delete, and toggle todo completion.
  - Search todos with debounced filtering.
- **Responsive UI** built with React.
- **API Endpoints** provided by an Express backend.
- **MongoDB Integration** for persistent storage when authenticated.

## Project Structure

```
/repo-root
  ├── client/         # React client app
  │    ├── public/
  │    ├── src/
  │    │    ├── components/
  │    │    │    └── Todos.jsx
  │    │    ├── utils/
  │    │    │    ├── api.js
  │    │    │    └── useTodos.js
  │    │    └── App.js
  │    └── package.json
  ├── server/         # Express backend
  │    ├── models/
  │    │    ├── Todo.js
  │    │    └── User.js
  │    ├── utils/
  │    │    └── passportConfig.js
  │    ├── .env
  │    ├── server.js
  │    └── package.json
  └── README.md
```

## Setup and Installation

### Server Setup

1. **Navigate to the `server` folder:**

   ```bash
   cd crud-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   - Create a `.env` file in the `server` folder.
   - Copy values from `.env.example` (if provided) and update with your credentials:

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/todolist
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   SESSION_SECRET=your_session_secret
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server:**

   ```bash
   npm start
   ```

   The server should now be running on `http://localhost:5000`.

### Client Setup

1. **Navigate to the `client` folder:**

   ```bash
   cd crud-frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   - Create a `.env` file in the `client` folder.
   - Example:

   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Start the client:**

   ```bash
   npm start
   ```

   Your React app should now be running on `http://localhost:3000`.

## Usage

- **Authentication:**
  - Click the "Login with Google" button to sign in.
  - Once logged in, your todos will be stored in the database.
  - If you are not logged in, todos are saved in localStorage.
- **Managing Todos:**
  - Use the form to add new todos.
  - Use the "Edit" and "Delete" buttons to modify or remove todos.
  - Use the search box to filter todos with a debounce delay.
  - Toggle a todo's completion status by clicking the checkbox.

## Environment Variables

Ensure you do not commit your actual `.env` files. Add `.env` to your `.gitignore` in both the `server` and `client` folders.

For example, in your root `.gitignore`:

```
/crud-backend/.env
/crud-frontend/.env
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests. Please follow the standard coding conventions and include appropriate tests for any new functionality.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
