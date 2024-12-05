import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import "dotenv/config";

import authRoutes from "./routes/authRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";
import path from "path";

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, "../uploads")));
app.use(express.json());
app.use(
  cors({
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(compression());
app.use(cookieParser());
app.use(morgan("combined"));

// Authentication routes
app.use("/api/auth", authRoutes);

// Routes
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);

// Error Handling
app.use(errorHandler);

export default app;
