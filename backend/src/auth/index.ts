export { AuthController } from "./authController";
export { AuthService } from "./authService";
export { authenticate, optionalAuth, AuthRequest } from "./middleware";
export { default as authRouter } from "./authRouter";
export { validateEmail, validateUsername, validatePassword } from "./validation";

export type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from "./authService";
