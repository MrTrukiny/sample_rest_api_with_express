import { development } from './development.env.js';
import { production } from './production.env.js';

export const nodEnv = process.env.NODE_ENV || 'development';
export const port = process.env.PORT || 3001;

export default { development, production };
