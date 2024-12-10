import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import "dotenv/config";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";

import path from "path";
import { notFound } from "./controllers/notFoundController";

const app = express();

// Middleware
app.use("/api/images", express.static(path.join(__dirname, "../uploads")));
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
app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);

// Error Handling
app.use(errorHandler);

app.all("*", notFound);

export default app;
