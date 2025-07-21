/**
 * Utility functions for the frontend
 */

/**
 * Generate a unique string ID that resembles MongoDB ObjectId format
 * This is used for temporary IDs on the frontend before they get replaced by server-generated IDs
 */
export const generateTempId = (): string => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  const randomBytes = Array.from({ length: 16 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  
  return timestamp + randomBytes.substring(0, 16);
};
