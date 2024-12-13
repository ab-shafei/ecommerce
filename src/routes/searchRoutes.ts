import { Router } from "express";
import { getAllCategoriesAndProducts } from "../controllers/searchController";

const router = Router();

router.get("/", getAllCategoriesAndProducts);

export default router;
