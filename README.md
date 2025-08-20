# 💻 CodeCraft: An Interactive Programming Hub

### *Your all-in-one platform for coding practice, problem-solving, and skill development.*

-----

## 🧐 What is CodeCraft?

CodeCraft is a full-stack, interactive programming hub designed to help you hone your coding skills. It offers a seamless and responsive user experience for practicing coding problems, with an integrated system for automated code evaluation, secure user management, and a comprehensive problem library. Whether you're a beginner or an experienced developer, CodeCraft provides the tools you need to solve problems, get instant feedback, and learn from detailed solutions.

-----

## ✨ Features

  - **Interactive Code Editor:** A clean, intuitive editor for writing and testing your code.
  - **Automated Code Evaluation:** Submit your solutions and get immediate feedback on correctness and performance, powered by the **Judge0** API.
  - **Efficient Submission Queue:** A polling queue on the frontend handles multiple concurrent code submissions without slowing down the user interface.
  - **Secure User Authentication:** **JWT** and **bcrypt** ensure your user data is secure, while **Redis** provides high-speed session management for a smooth login experience.
  - **Comprehensive Problem Set:** A rich library of coding problems managed through a dedicated admin dashboard.
  - **Video Solutions:** Stuck on a problem? Access video solutions to guide you through the logic and implementation.

-----

## 🛠️ Tech Stack

**Frontend:**

  - **React:** For building a dynamic and responsive user interface.
  - **Tailwind CSS:** A utility-first CSS framework for rapid and consistent styling.
  - **Redux Toolkit:** For efficient and predictable state management.

**Backend:**

  - **Node.js/Express:** A robust and scalable backend API.
  - **MongoDB/Mongoose:** A flexible NoSQL database for storing user, problem, and submission data.
  - **JWT (JSON Web Tokens):** For secure, stateless user authentication.
  - **bcrypt:** A library for hashing passwords to ensure user data security.
  - **Redis:** An in-memory data store used for high-speed session handling.

**Core Services:**

  - **Judge0:** An open-source API for compiling and running code, providing automated test case evaluation.

-----

## 🚀 Getting Started

**Prerequisites**

  - Node.js (v18 or higher)
  - npm (v9 or higher)
  - MongoDB
  - Redis

**Installation**

1.  Clone the repository:

    ```bash
    git clone https://github.com/RomilDubey03/codecraft.git
    cd codecraft
    ```

2.  Install dependencies for both the frontend and backend:

    ```bash
    # Install backend dependencies
    cd backend
    npm install

    # Install frontend dependencies
    cd ../frontend
    npm install
    ```

3.  Set up your environment variables:
    Create a `.env` file in the `backend` directory and add the following:

    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    REDIS_HOST=localhost
    REDIS_PORT=6379
    JUDGE0_API_URL=your_judge0_api_endpoint
    ```

**Running the Application**

1.  Start the Redis and MongoDB services.

2.  Start the backend server:

    ```bash
    # From the backend directory
    npm start
    ```

3.  Start the frontend development server:

    ```bash
    # From the frontend directory
    npm start
    ```

The application should now be live at `http://localhost:3000`.

-----

## 🤝 Contributing

We welcome contributions\! If you have suggestions for new features, bug fixes, or new problems to add, please open an issue or submit a pull request.

-----

## 📄 License

This project is licensed under the MIT License.