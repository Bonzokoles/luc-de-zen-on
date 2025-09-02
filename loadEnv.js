// loadEnv.js - Environment variables loader for OpenAI integration
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Export OpenAI configuration
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

// Validate that required environment variables are present
if (!OPENAI_API_KEY && process.env.NODE_ENV !== 'development') {
  console.warn('OPENAI_API_KEY not found in environment variables');
}

export default {
  OPENAI_API_KEY
};
