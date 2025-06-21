export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUsername = (username: string): { valid: boolean; error?: string } => {
  if (!username) {
    return { valid: false, error: "Username is required" };
  }
  
  if (username.length < 3) {
    return { valid: false, error: "Username must be at least 3 characters long" };
  }
  
  if (username.length > 30) {
    return { valid: false, error: "Username must be no more than 30 characters long" };
  }
  
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return { valid: false, error: "Username can only contain letters, numbers, underscores, and hyphens" };
  }
  
  return { valid: true };
};

export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (!password) {
    return { valid: false, error: "Password is required" };
  }
  
  if (password.length < 6) {
    return { valid: false, error: "Password must be at least 6 characters long" };
  }
  
  if (password.length > 100) {
    return { valid: false, error: "Password must be no more than 100 characters long" };
  }
  
  return { valid: true };
};
