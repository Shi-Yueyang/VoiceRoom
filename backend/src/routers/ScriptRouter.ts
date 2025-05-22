import { Router } from 'express';
import { 
  getAllScripts,
  getScriptById,
  createScript,
  deleteScript
} from '../controllers/ScriptController';

// Initialize router
const scriptRouter = Router();

// Define routes
scriptRouter.get('/', getAllScripts);
scriptRouter.get('/:id', getScriptById);
scriptRouter.post('/', createScript);
scriptRouter.delete('/:id', deleteScript);

// Export router
export default scriptRouter;