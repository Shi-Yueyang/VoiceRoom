import mongoose, { Schema, Document, Model } from 'mongoose';

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
export type IScriptBlockParams = IHeadingBlockParam | IDescriptionBlockParam | IDialogueBlockParam;

// Script block interface
export interface IScriptBlock {
  id: string;
  type: 'sceneHeading' | 'description' | 'dialogue';
  position: number;
  blockParams: IScriptBlockParams;
}

// Main script interface
export interface IScript {
  title: string;
  blocks: IScriptBlock[];
  lastModified: Date;
}

// Document interface for Mongoose
export interface ScriptDocument extends IScript, Document {}

// Schema for embedded script blocks
const scriptBlockSchema = new Schema<IScriptBlock>({
  id: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['sceneHeading', 'description', 'dialogue']
  },
  position: { type: Number, required: true, default: 0 },
  blockParams: { type: Schema.Types.Mixed, required: true }
});

// Main script schema
const scriptSchema = new Schema<ScriptDocument>({
  title: { type: String, required: true },
  blocks: { type: [scriptBlockSchema], default: [] },
  lastModified: { type: Date, default: Date.now }
});

// Export the model
const Script = mongoose.model<ScriptDocument, Model<ScriptDocument>>('Script', scriptSchema);

export default Script; 