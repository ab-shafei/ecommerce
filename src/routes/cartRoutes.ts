import { Router } from "express";
import { getUserCart } from "../controllers/cartController";
import { authenticateJWT, authorizeRoles } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authenticateJWT, authorizeRoles("CUSTOMER"), getUserCart);
// router.post("/", authenticateJWT, authorizeRoles("CUSTOMER"), createCart);
// router.put("/:id", authenticateJWT, authorizeRoles("CUSTOMER"), updateCart);
// router.delete("/:id", authenticateJWT, authorizeRoles("CUSTOMER"), deleteCart);

export default router;
