# 📚 Student Task Management Web App

A full-stack CRUD web application where students can register, log in,
create tasks, and track them across three stages: **To Do → In Progress → Done**.

Built with **Node.js + Express** (backend), **React.js** (frontend),
**MongoDB** (tasks & users), and **MySQL** (login/session history).

---

## 🗂 Project Structure

```
task-manager/
│
├── backend/                         ← Node.js + Express API
│   ├── server.js                    ← Entry point — starts the server
│   ├── .env                         ← Your secrets (DB passwords, JWT key)
│   ├── package.json
│   │
│   ├── config/
│   │   ├── mongodb.js               ← Connects to MongoDB
│   │   └── mysql.js                 ← Connects to MySQL, creates table
│   │
│   ├── models/
│   │   ├── User.js                  ← MongoDB schema: name, email, password
│   │   └── Task.js                  ← MongoDB schema: title, status, dueDate
│   │
│   ├── controllers/
│   │   ├── authController.js        ← Register & Login logic + MySQL logging
│   │   └── taskController.js        ← CRUD operations for tasks
│   │
│   ├── routes/
│   │   ├── authRoutes.js            ← POST /api/auth/register & /login
│   │   └── taskRoutes.js            ← GET/POST/PUT/DELETE /api/tasks
│   │
│   └── middleware/
│       └── authMiddleware.js        ← JWT token verification
│
├── frontend/                        ← React.js app
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js                 ← React entry point
│       ├── App.js                   ← Root: Login / Register / Dashboard
│       │
│       ├── api/
│       │   └── api.js               ← All axios calls to backend
│       │
│       ├── context/
│       │   └── AuthContext.js       ← Global login state (React Context)
│       │
│       ├── pages/
│       │   ├── Login.js             ← Login form
│       │   ├── Register.js          ← Registration form
│       │   └── Dashboard.js         ← Main task board (3 columns)
│       │
│       └── components/
│           ├── TaskCard.js          ← Single task card with move/delete
│           └── AddTaskForm.js       ← Form to create a new task
│
└── mysql_setup.sql                  ← Run once to create MySQL database
```

---

## ⚙️ What You Need to Install First

Before running the project, install these on your computer:

| Tool | Download Link | Purpose |
|------|--------------|---------|
| **Node.js** (v18+) | https://nodejs.org | Runs the backend server |
| **MongoDB Community** | https://www.mongodb.com/try/download/community | NoSQL database for tasks/users |
| **MySQL Community** | https://dev.mysql.com/downloads/mysql | SQL database for login history |
| **VS Code** | https://code.visualstudio.com | Code editor |

---

## 🚀 How to Run — Step by Step

### Step 1 — Start MongoDB

**Windows:**
```
Open "Services" → Find MongoDB → Click Start
```
Or open Command Prompt and run:
```bash
mongod
```

**Mac:**
```bash
brew services start mongodb-community
```

You should see: `waiting for connections on port 27017`

---

### Step 2 — Set up MySQL database

Open MySQL command line:
```bash
mysql -u root -p
```
Enter your MySQL password, then run:
```sql
CREATE DATABASE taskmanager_sessions;
```
Then exit:
```sql
exit
```

Or run the SQL script directly:
```bash
mysql -u root -p < mysql_setup.sql
```

---

### Step 3 — Configure the backend `.env` file

Open `backend/.env` and fill in your details:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password_here
MYSQL_DATABASE=taskmanager_sessions
JWT_SECRET=any_long_random_string_here
JWT_EXPIRES_IN=7d
```

> ⚠️ **MYSQL_PASSWORD** — replace `yourpassword` with your actual MySQL password.
> If you have no password set, leave it empty: `MYSQL_PASSWORD=`

---

### Step 4 — Install backend dependencies

Open VS Code terminal (`Ctrl + Backtick`), then:

```bash
cd backend
npm install
```

This installs: express, mongoose, mysql2, bcryptjs, jsonwebtoken, cors, dotenv

---

### Step 5 — Start the backend server

```bash
npm start
```

You should see:
```
✅ Server running on http://localhost:5000
   MongoDB : connected
   MySQL   : connected
```

> Keep this terminal running. Open a NEW terminal for the next step.

---

### Step 6 — Install frontend dependencies

In a new terminal:

```bash
cd frontend
npm install
```

This installs: react, react-dom, axios, react-scripts

---

### Step 7 — Start the React frontend

```bash
npm start
```

A browser will open automatically at:
```
http://localhost:3000
```

---

## ✅ The App is Running!

You will see the **Login page**. Click **"Register here"** to create an account,
then log in to see your task board.

### What you can do:
- ➕ **Add a task** — give it a title, description, and due date
- 📋 **To Do** → 🔄 **In Progress** → ✅ **Done** — move tasks forward
- 🗑 **Delete** any task
- 🔐 **Logout** — your session is saved, tasks stay

---

## 🔌 API Endpoints (for reference)

All task routes require: `Authorization: Bearer <token>` in the header.

| Method | URL | What it does | Auth needed? |
|--------|-----|-------------|-------------|
| POST | `/api/auth/register` | Create account | ❌ No |
| POST | `/api/auth/login` | Login, get token | ❌ No |
| GET | `/api/tasks` | Get all my tasks | ✅ Yes |
| GET | `/api/tasks?status=todo` | Filter by status | ✅ Yes |
| POST | `/api/tasks` | Create a task | ✅ Yes |
| PUT | `/api/tasks/:id` | Update a task | ✅ Yes |
| DELETE | `/api/tasks/:id` | Delete a task | ✅ Yes |

---

## 🧠 How It Works — Key Concepts Explained

### Why MongoDB for tasks?
Tasks can have flexible fields — some have due dates, some don't.
MongoDB's flexible schema handles this easily without ALTER TABLE.

### Why MySQL for sessions?
Login history is structured — fixed columns (user_id, email, action, timestamp).
MySQL is perfect for this kind of relational, queryable log data.

### How JWT authentication works
```
1. User registers/logs in
2. Server creates a JWT token (signed with JWT_SECRET)
3. Frontend stores the token in localStorage
4. Every API request includes:  Authorization: Bearer <token>
5. Backend verifies the token before allowing access
6. Token expires after 7 days
```

### How SDLC phases were followed
```
Phase 1 - Planning:    Defined features (register, login, CRUD tasks, 3 statuses)
Phase 2 - Design:      Designed MongoDB schemas, REST API endpoints, React pages
Phase 3 - Development: Built backend first, then frontend, then connected them
Phase 4 - Testing:     Tested each API endpoint manually, then tested full flow
```

### How Agile was followed
- Broke the project into small tasks (auth first, then tasks CRUD, then UI)
- Each feature was built and tested independently before moving to the next
- Used Git commits after each working feature

---

## ❌ Common Errors and Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `MongoDB connection failed` | MongoDB not running | Run `mongod` in a terminal |
| `MySQL connection failed` | Wrong password in `.env` | Check `MYSQL_PASSWORD` in `backend/.env` |
| `npm not found` | Node.js not installed | Download from nodejs.org |
| `Port 5000 already in use` | Another app using port 5000 | Change `PORT=5001` in `.env` |
| `Port 3000 already in use` | Another React app running | Press Y when React asks to use port 3001 |
| `Token invalid or expired` | JWT expired or wrong | Log out and log in again |
| `CORS error` in browser | Backend not running | Make sure `npm start` in backend is running |
| `Cannot GET /api/tasks` | Wrong URL or server not started | Check backend terminal for errors |

---

## 🛠 Tech Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React.js | UI — Login, Register, Dashboard |
| Frontend State | React Context + useState | Global user/token management |
| HTTP Client | Axios | API calls from React to Node |
| Backend | Node.js + Express.js | REST API server |
| Auth | JWT + bcryptjs | Secure login tokens + password hashing |
| Database 1 | MongoDB + Mongoose | Stores users and tasks |
| Database 2 | MySQL + mysql2 | Stores login/session history |
| Dev Tool | nodemon | Auto-restarts server on file changes |

---

## 📁 Git Setup (optional but good practice)

```bash
# From the task-manager/ folder
git init
git add .
git commit -m "Initial commit - Student Task Manager"
```

The `.gitignore` already excludes `node_modules/` and `.env` files.
