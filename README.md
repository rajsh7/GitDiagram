# 🧩 GitDiagram — Visualize Your Git Repositories

**GitDiagram** is a full-stack web application that automatically visualizes Git repositories as interactive node-based diagrams.  
It allows users to log in securely, load repositories, explore commit relationships, and save diagrams — all powered by **Next.js**, **Express**, and **MongoDB**.

---

## 🚀 Tech Stack

### 🖥️ Frontend
- [Next.js 16 (App Router)](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Flow](https://reactflow.dev/) for interactive diagrams
- Tailwind CSS for modern UI
- Axios for API requests

### ⚙️ Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- TypeScript
- RESTful APIs

### ☁️ Deployment
- **Frontend:** [Vercel](https://vercel.com)
- **Backend:** [Render](https://render.com)
- **Database:** MongoDB Atlas

---

## 🌐 Live Demo

- **Frontend (Vercel):** [https://gitdiagram.vercel.app](https://gitdiagram.vercel.app)
- **Backend API (Render):** [https://gitdiagram-pk6l.onrender.com](https://gitdiagram-pk6l.onrender.com)

---

## 🛠️ Project Setup (Local Development)

### 1. Clone the repository

```bash
git clone https://github.com/rajsh7/GitDiagram.git
cd GitDiagram
2. Setup environment variables
Create .env files for both backend and frontend.

🧩 Backend (apps/backend/.env)
env
Copy code
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_generated_jwt_secret
💡 To generate a strong JWT secret, run this in your terminal:

bash
Copy code
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
🖥️ Frontend (apps/frontend/.env.local)
env
Copy code
NEXT_PUBLIC_API_BASE=https://gitdiagram-pk6l.onrender.com/api
3. Install dependencies
From the project root:

bash
Copy code
npm install
Or install individually:

bash
Copy code
cd apps/backend && npm install
cd ../frontend && npm install
4. Run the development servers
Backend:

bash
Copy code
cd apps/backend
npm run dev
Frontend:

bash
Copy code
cd apps/frontend
npm run dev
Then open your browser to http://localhost:3000

🔐 Authentication
GitDiagram uses JWT-based authentication.

Register → /auth/register

Login → /auth/login

Access protected routes using Authorization: Bearer <token>

Tokens are stored securely in browser localStorage.

🧠 Core Features
✅ Register & Login with JWT
✅ Load GitHub repositories
✅ Auto-generate diagrams for commits/branches
✅ Add, edit, and save notes
✅ Save user diagrams in MongoDB
✅ Load previously saved diagrams
✅ Deployed full-stack on Render (API) + Vercel (Frontend)

🧩 API Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login user and get JWT
GET	/api/repository/:name	Get Git repository structure
POST	/api/diagram	Save diagram
GET	/api/diagram/:repo	Load diagram
POST	/api/notes/:repo	Save notes
GET	/api/notes/:repo	Get notes

🧱 Folder Structure
lua
Copy code
GitDiagram/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── models/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   └── config/
│   │   └── index.ts
│   └── frontend/
│       ├── app/
│       ├── components/
│       ├── lib/
│       └── styles/
└── package.json
📸 Screenshots (Optional)
Add screenshots or demo GIFs here once available.

👨‍💻 Author
Raj
Full-Stack Developer
🔗 GitHub: @rajsh7

🪪 License
This project is licensed under the MIT License.

💬 Feedback
If you have suggestions or ideas, feel free to open an issue or submit a pull request!