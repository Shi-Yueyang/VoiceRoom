import { Router } from "express";
import { AuthController } from "./authController";
import { authenticate } from "./middleware";

const authRouter = Router();

// Public routes
authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.post("/validate", AuthController.validateToken);

// Protected routes
authRouter.get("/profile", authenticate, AuthController.getProfile);
authRouter.put("/password", authenticate, AuthController.updatePassword);

export default authRouter;
