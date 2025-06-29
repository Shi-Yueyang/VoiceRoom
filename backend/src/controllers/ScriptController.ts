import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Script, { 
  ScriptDocument, 
  IScriptBlock, 
  IScriptBlockParams 
} from '../models/Script';

// Get all scripts (with optional pagination)
export const getAllScripts = async (req: Request, res: Response):Promise<any> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const scripts = await Script.find()
      .select('title lastModified')
      .sort({ lastModified: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Script.countDocuments();

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
export const getScriptById = async (req: Request, res: Response):Promise<any> => {
  try {
    const script = await Script.findById(req.params.id);
    if (!script) {
      return res.status(404).json({ error: 'Script not found' });
    }
    return res.status(200).json(script);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch script' });
  }
};

// Create a new script
export const createScript = async (req: Request, res: Response):Promise<any> => {
  try {
    const { title, blocks = [] } = req.body;
    
    // Ensure blocks have proper position values
    blocks.forEach((block: IScriptBlock, index: number) => {
      block.position = index;
      block._id = block._id || new mongoose.Types.ObjectId().toString();
    });

    const newScript = new Script({
      title,
      blocks,
      lastModified: new Date()
    });

    const savedScript = await newScript.save();
    return res.status(201).json(savedScript);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create script' });
  }
};

// Update an existing script
export const updateScript = async (req: Request, res: Response):Promise<any> => {
  try {
    const { title, blocks } = req.body;
    
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
    
    if (!updatedScript) {
      return res.status(404).json({ error: 'Script not found' });
    }
    
    return res.status(200).json(updatedScript);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update script' });
  }
};

// Delete a script
export const deleteScript = async (req: Request, res: Response):Promise<any> => {
  try {
    const deletedScript = await Script.findByIdAndDelete(req.params.id);
    
    if (!deletedScript) {
      return res.status(404).json({ error: 'Script not found' });
    }
    
    return res.status(200).json({ message: 'Script deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete script' });
  }
};

// Add a new block to a script
export const addBlockToScript = async (req: Request, res: Response):Promise<any> => {
  try {
    const { type, blockParams, position } = req.body;
    
    const script = await Script.findById(req.params.id);
    if (!script) {
      return res.status(404).json({ error: 'Script not found' });
    }

    // Create new block
    const newBlock: IScriptBlock = {
      _id: new mongoose.Types.ObjectId().toString(),
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
export const removeBlockFromScript = async (req: Request, res: Response):Promise<any> => {
  try {
    const { scriptId, blockId } = req.params;
    
    const script = await Script.findById(scriptId);
    if (!script) {
      return res.status(404).json({ error: 'Script not found' });
    }
    
    const blockIndex = script.blocks.findIndex(block => block._id === blockId);
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
export const updateBlockInScript = async (req: Request, res: Response) :Promise<any>=> {
  try {
    const { scriptId, blockId } = req.params;
    const { type, blockParams } = req.body;
    
    const script = await Script.findById(scriptId);
    if (!script) {
      return res.status(404).json({ error: 'Script not found' });
    }
    
    const blockIndex = script.blocks.findIndex(block => block._id === blockId);
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
export const reorderScriptBlocks = async (req: Request, res: Response) :Promise<any>=> {
  try {
    const { id } = req.params;
    const { blockOrder } = req.body;
    
    if (!Array.isArray(blockOrder)) {
      return res.status(400).json({ error: 'blockOrder must be an array of block IDs' });
    }
    
    const script = await Script.findById(id);
    if (!script) {
      return res.status(404).json({ error: 'Script not found' });
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