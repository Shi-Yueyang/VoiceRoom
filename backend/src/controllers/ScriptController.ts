import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Script, { 
  IScriptBlock} from '../models/Script';
import { AuthService } from '../auth';
import { AuthRequest } from '../auth/middleware';

// Get all scripts (with optional pagination)
export const getAllScripts = async (req: AuthRequest, res: Response):Promise<any> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user._id;

    // Filter scripts where user is creator or editor
    const scripts = await Script.find({
      $or: [
        { creator: userId },
        { editors: userId }
      ]
    })
      .select('title lastModified creator editors')
      .populate('creator', 'username')
      .populate('editors', 'username')
      .sort({ lastModified: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Script.countDocuments({
      $or: [
        { creator: userId },
        { editors: userId }
      ]
    });

    return res.status(200).json({
      scripts,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching scripts:', error);
    return res.status(500).json({ error: 'Failed to fetch scripts' });
  }
};

// Get a single script by ID
export const getScriptById = async (req: AuthRequest, res: Response):Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user._id;
    
    const script = await Script.findOne({
      _id: req.params.id,
      $or: [
        { creator: userId },
        { editors: userId }
      ]
    });
    if (!script) {
      return res.status(404).json({ error: 'Script not found or access denied' });
    }
    
    return res.status(200).json(script);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch script' });
  }
};

// Create a new script
export const createScript = async (req: AuthRequest, res: Response):Promise<any> => {
  try {
    const { title, blocks = [] } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    // Ensure blocks have proper position values
    blocks.forEach((block: IScriptBlock, index: number) => {
      block.position = index;
      block._id = block._id || new mongoose.Types.ObjectId().toString();
    });
    
    const creator = req.user._id;
    const newScript = new Script({
      title,
      blocks,
      creator,
      lastModified: new Date()
    });
    const savedScript = await newScript.save();
    return res.status(201).json(savedScript);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create script' });
  }
};

// Update an existing script
export const updateScript = async (req: AuthRequest, res: Response):Promise<any> => {
  try {
    const { title, blocks } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user._id;
    
    // First check if user has permission to edit this script
    const script = await Script.findOne({
      _id: req.params.id,
      $or: [
        { creator: userId },
        { editors: userId }
      ]
    });
    
    if (!script) {
      return res.status(404).json({ error: 'Script not found or access denied' });
    }
    
    const updateData = {
      ...(title && { title }),
      ...(blocks && { blocks }),
      lastModified: new Date()
    };

    const updatedScript = await Script.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    return res.status(200).json(updatedScript);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update script' });
  }
};

// Delete a script
export const deleteScript = async (req: AuthRequest, res: Response):Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user._id;
    
    // First check if user has permission to delete this script (only creator can delete)
    const script = await Script.findOne({
      _id: req.params.id,
      creator: userId // Only creator can delete
    });
    
    if (!script) {
      return res.status(404).json({ error: 'Script not found or access denied. Only the creator can delete a script.' });
    }
    
    const deletedScript = await Script.findByIdAndDelete(req.params.id);
    
    return res.status(200).json({ message: 'Script deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete script' });
  }
};

// Add a new block to a script
export const addBlockToScript = async (req: AuthRequest, res: Response):Promise<any> => {
  try {
    const { type, blockParams, position } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user._id;
    
    // Check if user has permission to edit this script
    const script = await Script.findOne({
      _id: req.params.id,
      $or: [
        { creator: userId },
        { editors: userId }
      ]
    });
    
    if (!script) {
      return res.status(404).json({ error: 'Script not found or access denied' });
    }

    // Create new block
    const newBlock: IScriptBlock = {
      _id: new mongoose.Types.ObjectId(),
      type,
      position: position ?? script.blocks.length,
      blockParams
    };

    // If position is specified, update positions of existing blocks
    if (position !== undefined) {
      script.blocks.forEach(block => {
        if (block.position >= position) {
          block.position += 1;
        }
      });
    }

    script.blocks.push(newBlock);
    script.blocks.sort((a, b) => a.position - b.position);
    script.lastModified = new Date();
    
    await script.save();
    
    return res.status(201).json(script);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add block to script' });
  }
};

// Remove a block from a script
export const removeBlockFromScript = async (req: AuthRequest, res: Response):Promise<any> => {
  try {
    const { scriptId, blockId } = req.params;
    
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user._id;
    
    // Check if user has permission to edit this script
    const script = await Script.findOne({
      _id: scriptId,
      $or: [
        { creator: userId },
        { editors: userId }
      ]
    });
    
    if (!script) {
      return res.status(404).json({ error: 'Script not found or access denied' });
    }
    
    const blockIndex = script.blocks.findIndex(block => block._id.equals(blockId));
    if (blockIndex === -1) {
      return res.status(404).json({ error: 'Block not found in script' });
    }
    
    const removedBlock = script.blocks.splice(blockIndex, 1)[0];
    
    script.blocks.forEach(block => {
      if (block.position > removedBlock.position) {
        block.position -= 1;
      }
    });
    
    script.lastModified = new Date();
    await script.save();
    
    return res.status(200).json(script);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to remove block from script' });
  }
};

// Update a specific block in a script
export const updateBlockInScript = async (req: AuthRequest, res: Response) :Promise<any>=> {
  try {
    const { scriptId, blockId } = req.params;
    const { type, blockParams } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user._id;
    
    // Check if user has permission to edit this script
    const script = await Script.findOne({
      _id: scriptId,
      $or: [
        { creator: userId },
        { editors: userId }
      ]
    });
    
    if (!script) {
      return res.status(404).json({ error: 'Script not found or access denied' });
    }
    
    const blockIndex = script.blocks.findIndex(block => block._id.equals(blockId));
    if (blockIndex === -1) {
      return res.status(404).json({ error: 'Block not found in script' });
    }
    
    if (type) script.blocks[blockIndex].type = type;
    if (blockParams) script.blocks[blockIndex].blockParams = blockParams;
    
    script.lastModified = new Date();
    await script.save();
    
    return res.status(200).json(script);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update block in script' });
  }
};

// Reorder blocks in a script
export const reorderScriptBlocks = async (req: AuthRequest, res: Response) :Promise<any>=> {
  try {
    const { id } = req.params;
    const { blockOrder } = req.body;
    
    if (!Array.isArray(blockOrder)) {
      return res.status(400).json({ error: 'blockOrder must be an array of block IDs' });
    }
    
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user._id;
    
    // Check if user has permission to edit this script
    const script = await Script.findOne({
      _id: id,
      $or: [
        { creator: userId },
        { editors: userId }
      ]
    });
    
    if (!script) {
      return res.status(404).json({ error: 'Script not found or access denied' });
    }
    
    const newPositions = new Map();
    blockOrder.forEach((blockId, index) => {
      newPositions.set(blockId, index);
    });
    
    script.blocks.forEach(block => {
      if (newPositions.has(block._id)) {
        block.position = newPositions.get(block._id);
      }
    });
    
    script.blocks.sort((a, b) => a.position - b.position);
    script.lastModified = new Date();
    
    await script.save();
    
    return res.status(200).json(script);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to reorder script blocks' });
  }
};

// Add an editor to a script
export const addEditorToScript = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
    
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user._id;
    
    // Check if user has permission to add editors (only creator can add editors)
    const script = await Script.findOne({
      _id: id,
      creator: userId // Only creator can add editors
    });
    
    if (!script) {
      return res.status(404).json({ error: 'Script not found or access denied. Only the creator can add editors.' });
    }

    // Find the user to be added as editor
    const User = (await import('../models/User')).default;
    const editorUser = await User.findOne({ username: username.trim() });
    
    if (!editorUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is already an editor or creator
    if (script.creator.equals(editorUser._id)) {
      return res.status(400).json({ error: 'User is already the creator of this script' });
    }

    if (script.editors.some(editorId => editorId.equals(editorUser._id))) {
      return res.status(400).json({ error: 'User is already an editor of this script' });
    }

    // Add user to editors list
    script.editors.push(editorUser._id as any);
    script.lastModified = new Date();
    await script.save();

    // Populate the updated script with editor details
    const updatedScript = await Script.findById(id)
      .populate('creator', 'username')
      .populate('editors', 'username');

    return res.status(200).json({ 
      message: 'Editor added successfully',
      script: updatedScript 
    });
  } catch (error) {
    console.error('Error adding editor:', error);
    return res.status(500).json({ error: 'Failed to add editor' });
  }
};

// Remove an editor from a script
export const removeEditorFromScript = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id, editorId } = req.params;
    
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user._id;
    
    // Check if user has permission to remove editors (only creator can remove editors)
    const script = await Script.findOne({
      _id: id,
      creator: userId // Only creator can remove editors
    });
    
    if (!script) {
      return res.status(404).json({ error: 'Script not found or access denied. Only the creator can remove editors.' });
    }

    // Check if the editor exists in the editors list
    const editorIndex = script.editors.findIndex(editor => editor.equals(editorId));
    if (editorIndex === -1) {
      return res.status(404).json({ error: 'Editor not found in this script' });
    }

    // Remove editor from the list
    script.editors.splice(editorIndex, 1);
    script.lastModified = new Date();
    await script.save();

    // Populate the updated script with editor details
    const updatedScript = await Script.findById(id)
      .populate('creator', 'username')
      .populate('editors', 'username');

    return res.status(200).json({ 
      message: 'Editor removed successfully',
      script: updatedScript 
    });
  } catch (error) {
    console.error('Error removing editor:', error);
    return res.status(500).json({ error: 'Failed to remove editor' });
  }
};

export const getEditorsOfScript = async (req: AuthRequest, res: Response): Promise<any> => {
  try{
    const {id} = req.params;
    if (!req.user) {
      return res.status(401).json({error:"User not authenticated"});
    }
    const userId = req.user._id;
    const script = await Script.findOne({
      _id:id,
      $or:[
        {creator:userId},
        {editors:userId}
      ]
    })
    .populate('creator','username')
    .populate('editors','username');

    if(!script){
      return res.status(404).json({error:"Script not found or access denied"});
    }
    return res.status(200).json({
      editors:script.editors,
      creator:script.creator,
    });
  } catch(error){
    console.error('Error fetching editors.', error);
    return res.status(500).json({error:'Failed to fetch editors'});
  }
}