# 🚀 Web Blog - NoSQL Project

## 🌟 Overview

Welcome to the **Web Blog - NoSQL Project**! This is a **modern full-stack blog platform** that combines the best web technologies to deliver **real-time interactivity, seamless content management, and responsive design**. Built with **Next.js, Express.js, MongoDB**, and **Socket.io**, this project showcases the power of **modern JavaScript/TypeScript development**.

## 🛠 Tech Stack

### 🎨 Frontend

- **Next.js 14** - React framework with **server-side rendering (SSR)** and **static generation**
- **TypeScript** - Ensuring **type safety** and better development experience
- **Tailwind CSS** - Utility-first styling for **fast and scalable UI**
- **React-Quill** - **Rich text editor** for blog posts
- **Framer Motion** - Adding **smooth animations** and interactivity
- **Socket.io Client** - Enabling **real-time communication**
- **JWT** - Secure **user authentication**

### 🏗️ Backend

- **Express.js** - Lightweight and efficient **Node.js framework**
- **MongoDB** - A **NoSQL database** for scalable content storage
- **Mongoose** - Simplifying **MongoDB data modeling**
- **Socket.io** - **Real-time bidirectional communication**
- **JWT** - Secure **authentication & authorization**
- **Multer** - Handling **file uploads** efficiently

## ✨ Features

1. ✅ **User Authentication** - Secure **login and registration** system
2. ✅ **Blog Post Management** - **CRUD operations** for blog posts
3. ✅ **Real-time Comments** - Engage with **live discussions**
4. ✅ **Categories & Tags** - Organize posts for **better discoverability**
5. ✅ **Favorites & Likes** - Allow users to **save and appreciate posts**
6. ✅ **Rich Text Editing** - Format posts using a **powerful editor**
7. ✅ **Responsive Design** - Fully **mobile-friendly** UI
8. ✅ **File Uploads** - Add **images for blog posts and profiles**

## 🚀 Getting Started

### 🔧 Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher)
- **MongoDB** (local or cloud instance)

### 📥 Installation

1️⃣ **Clone the repository**

```sh
git clone <repository-url>
```

2️⃣ **Backend Setup**

```sh
cd backend
npm install
```

Create a `.env` file in the backend directory with:

```sh
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

3️⃣ **Frontend Setup**

```sh
cd frontend
npm install
```

### ▶️ Running the Application

1️⃣ **Start the Backend**

```sh
cd backend
npm start
```

2️⃣ **Start the Frontend**

```sh
cd frontend
npm run dev
```

3️⃣ **Access the Application**

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

## 📂 Project Structure

```
📦 Web Blog
 ┣ 📂 frontend   # Next.js Application
 ┃ ┣ 📂 components   # Reusable UI components
 ┃ ┣ 📂 pages   # Page-based routing
 ┃ ┣ 📂 styles   # Tailwind & global styles
 ┃ ┗ 📜 package.json   # Frontend dependencies
 ┣ 📂 backend   # Express.js API
 ┃ ┣ 📂 models   # Mongoose schemas
 ┃ ┣ 📂 routes   # API endpoints
 ┃ ┣ 📂 controllers   # Business logic
 ┃ ┗ 📜 package.json   # Backend dependencies
 ┗ 📜 README.md   # Project documentation
```

## 🤝 Contributing

💡 Want to improve this project? Follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request** 🚀

## 📜 License

This project is licensed under the **ISC License**. Feel free to use and improve it! 💡
