import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import "dotenv/config";

import authRoutes from "./routes/authRoutes";

import { authenticateJWT } from "./middlewares/authMiddleware";
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(compression());
app.use(cookieParser());

// Authentication routes
app.use("/api/auth", authRoutes);

// Routes

// Error Handling
app.use(errorHandler);

export default app;
