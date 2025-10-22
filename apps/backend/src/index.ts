import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose"; // ✅ add this line
import { connectDB } from "./config/db";
import repositoryRouter from "./routes/repository";
import diagramRouter from "./routes/diagram";
import noteRoutes from "./routes/noteRoutes";
import diagramRoutes from "./routes/diagramRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

// ✅ Enable CORS (allow frontend from any domain — or restrict to your Vercel domain later)
app.use(cors({ origin: "*" }));

// ✅ Increase body size limits (important for graph data)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ✅ Base health check
app.get("/", (_, res) => res.send("🚀 GitDiagram Backend API is running!"));
app.get("/api/health", (_, res) =>
  res.json({ status: "ok", message: "Server running" })
);

// ✅ Register routes
app.use("/api/repository", repositoryRouter);
app.use("/api/diagram", diagramRouter);
app.use("/api/notes", noteRoutes);
app.use("/api/diagram", diagramRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

// ✅ Start server after successful DB connection
const startServer = async () => {
  try {
    await connectDB();

    // 🧩 Print connected DB name to confirm which database is in use
    console.log("📦 Connected to database:", mongoose.connection.db?.databaseName || "Unknown DB");

    app.listen(PORT, () =>
      console.log(`✅ Server running on port ${PORT} (connected to MongoDB)`)
    );
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
