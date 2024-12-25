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
import searchRoutes from "./routes/searchRoutes";
import couponRoutes from "./routes/couponRoutes";
import addressRoutes from "./routes/addressRoutes";
import layoutRoutes from "./routes/layoutRoutes";
import orderRoutes from "./routes/orderRoutes";
import paymentRoutes from "./routes/paymentRoutes";

import path from "path";
import { notFound } from "./controllers/notFoundController";

const app = express();

// Middleware
app.use("/api/v1/images", express.static(path.join(__dirname, "../uploads")));
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
app.use("/api/v1/auth", authRoutes);

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/carts", cartRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/layouts", layoutRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);

// Error Handling
app.use(errorHandler);

app.all("*", notFound);

export default app;
