import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Block parameter interfaces
export interface IHeadingBlockParam {
  intExt: string;
  location: string;
  time: string;
}

export interface IDescriptionBlockParam {
  text: string;
}

export interface IDialogueBlockParam {
  characterName: string;
  text: string;
}

// Union type for different block parameters
export type IScriptBlockParams =
  | IHeadingBlockParam
  | IDescriptionBlockParam
  | IDialogueBlockParam;

// Script block interface
export interface IScriptBlock {
  _id: Types.ObjectId;
  type: "sceneHeading" | "description" | "dialogue";
  position: number;
  blockParams: IScriptBlockParams;
  lockedBy?: Types.ObjectId; // User ID who is currently editing this block
  lockedAt?: Date; // When the block was locked
}

// Main script interface
export interface IScript {
  title: string;
  creator: Types.ObjectId; // Reference to User who created the script
  editors: Types.ObjectId[]; // Array of User references who can edit
  blocks: IScriptBlock[];
  lastModified: Date;
  createdAt: Date;
}

// Document interface for Mongoose
export interface ScriptDocument extends IScript, Document {
  // Instance methods
  addEditor(userId: Types.ObjectId): Promise<this>;
  removeEditor(userId: Types.ObjectId): Promise<this>;
  isCreator(userId: Types.ObjectId): boolean;
  isEditor(userId: Types.ObjectId): boolean;
  canEdit(userId: Types.ObjectId): boolean;
  lockBlock(blockId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean>;
  unlockBlock(blockId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean>;
  isBlockLocked(blockId: Types.ObjectId): boolean;
  isBlockLockedByUser(blockId: Types.ObjectId, userId: Types.ObjectId): boolean;
  unlockAllBlocksByUser(userId: Types.ObjectId): Promise<void>;
}

// Model interface for static methods
export interface ScriptModel extends Model<ScriptDocument> {
  findByCreator(userId: Types.ObjectId): Promise<ScriptDocument[]>;
  findByEditor(userId: Types.ObjectId): Promise<ScriptDocument[]>;
  findUserScripts(userId: Types.ObjectId): Promise<ScriptDocument[]>;
}

// Schema for embedded script blocks
const scriptBlockSchema = new Schema<IScriptBlock>({
  _id: { type: Schema.Types.ObjectId, required: true },
  type: {
    type: String,
    required: true,
    enum: ["sceneHeading", "description", "dialogue"],
  },
  position: { type: Number, required: true, default: 0 },
  blockParams: { type: Schema.Types.Mixed, required: true },
  lockedBy: { type: Schema.Types.ObjectId, ref: "User" },
  lockedAt: { type: Date },
});

// Main script schema
const scriptSchema = new Schema<ScriptDocument>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true, // Creator cannot be changed after creation
    },
    editors: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    blocks: { type: [scriptBlockSchema], default: [] },
    lastModified: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Instance method to add an editor
scriptSchema.methods.addEditor = async function (userId: Types.ObjectId) {
  if (!this.editors.includes(userId) && !this.creator.equals(userId)) {
    this.editors.push(userId);
    await this.save();
  }
  return this;
};

// Instance method to remove an editor
scriptSchema.methods.removeEditor = async function (userId: Types.ObjectId) {
  this.editors = this.editors.filter(
    (editorId: Types.ObjectId) => !editorId.equals(userId)
  );
  await this.save();
  return this;
};

// Instance method to check if user is the creator
scriptSchema.methods.isCreator = function (userId: Types.ObjectId): boolean {
  return this.creator.equals(userId);
};

// Instance method to check if user is an editor
scriptSchema.methods.isEditor = function (userId: Types.ObjectId): boolean {
  return this.editors.some((editorId: Types.ObjectId) =>
    editorId.equals(userId)
  );
};

// Instance method to check if user can edit (creator or editor)
scriptSchema.methods.canEdit = function (userId: Types.ObjectId): boolean {
  return this.isCreator(userId) || this.isEditor(userId);
};

// Instance method to lock a block
scriptSchema.methods.lockBlock = async function (
  blockId: Types.ObjectId,
  userId: Types.ObjectId
): Promise<boolean> {
  const block = this.blocks.find((b: IScriptBlock) => b._id.equals(blockId));

  if (block && !block.lockedBy) {
    block.lockedBy = userId;  
    block.lockedAt = new Date();
    await this.save();
    return true;
  }
  return false;
};

// Instance method to unlock a block
scriptSchema.methods.unlockBlock = async function (
  blockId: Types.ObjectId,
  userId: Types.ObjectId
): Promise<boolean> {
  const block = this.blocks.find((b: IScriptBlock) => b._id.equals(blockId));
  if (block && block.lockedBy?.equals(userId)) {
    block.lockedBy = undefined;
    block.lockedAt = undefined;
    await this.save();
    return true;
  }
  return false;
};

// Instance method to check if a block is locked
scriptSchema.methods.isBlockLocked = function (blockId: Types.ObjectId): boolean {
  const block = this.blocks.find((b: IScriptBlock) => b._id === blockId);
  return !!block?.lockedBy;
};

// Instance method to check if a block is locked by a specific user
scriptSchema.methods.isBlockLockedByUser = function (
  blockId: Types.ObjectId,
  userId: Types.ObjectId
): boolean {
  const block = this.blocks.find((b: IScriptBlock) => b._id === blockId);
  return block?.lockedBy?.equals(userId) || false;
};

// Instance method to unlock all blocks by a user
scriptSchema.methods.unlockAllBlocksByUser = async function (
  userId: Types.ObjectId
): Promise<void> {
  for (const block of this.blocks) {
    if (block.lockedBy?.equals(userId)) {
      block.lockedBy = undefined;
      block.lockedAt = undefined;
    }
  }
  await this.save();
};

// Update lastModified on save
scriptSchema.pre("save", function (next) {
  this.lastModified = new Date();
  next();
});

// Static methods for querying
scriptSchema.statics.findByCreator = function (userId: Types.ObjectId) {
  return this.find({ creator: userId })
    .populate("creator", "username email")
    .populate("editors", "username email");
};

scriptSchema.statics.findByEditor = function (userId: Types.ObjectId) {
  return this.find({ editors: userId })
    .populate("creator", "username email")
    .populate("editors", "username email");
};

scriptSchema.statics.findUserScripts = function (userId: Types.ObjectId) {
  return this.find({
    $or: [{ creator: userId }, { editors: userId }],
  })
    .populate("creator", "username email")
    .populate("editors", "username email");
};

// Indexes for better query performance
scriptSchema.index({ creator: 1 });
scriptSchema.index({ editors: 1 });
scriptSchema.index({ createdAt: -1 });
scriptSchema.index({ lastModified: -1 });

// Export the model
const Script = mongoose.model<ScriptDocument, ScriptModel>(
  "Script",
  scriptSchema
);

export default Script;
