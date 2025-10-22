import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import repositoryRouter from "./routes/repository";
import diagramRouter from "./routes/diagram";
import { connectDB } from "./config/db";
import noteRoutes from "./routes/noteRoutes";
import diagramRoutes from "./routes/diagramRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

// ✅ Enable CORS
app.use(cors());

// ✅ Increase JSON + URL-encoded body size limit (to fix 413)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ✅ Base route
app.get("/", (_, res) => res.send("🚀 GitDiagram Backend API is running!"));

// ✅ API routes
app.use("/api/repository", repositoryRouter);
app.use("/api/diagram", diagramRouter);
app.use("/api/notes", noteRoutes);
app.use("/api/diagram", diagramRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

// ✅ Start server only after successful DB connection
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
