import { Router } from 'express';
import { 
  getAllScripts,
  getScriptById,
  createScript,
  deleteScript,
  addEditorToScript,
  getEditorsOfScript,
  removeEditorFromScript
} from '../controllers/ScriptController';
import { authenticate } from '../auth/middleware';

// Initialize router
const scriptRouter = Router();

// Define routes - all require authentication
scriptRouter.get('/', authenticate, getAllScripts);
scriptRouter.get('/:id', authenticate, getScriptById);
scriptRouter.post('/', authenticate, createScript);
scriptRouter.post('/:id/editors', authenticate, addEditorToScript);
scriptRouter.get('/:id/editors', authenticate, getEditorsOfScript);
scriptRouter.delete('/:id/editors/:editorId', authenticate, removeEditorFromScript);
scriptRouter.delete('/:id', authenticate, deleteScript);

// Export router
export default scriptRouter;