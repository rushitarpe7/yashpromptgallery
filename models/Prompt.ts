import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPrompt extends Document {
  title?: string;
  promptText: string;
  imageUrl: string;
  category?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PromptSchema = new Schema<IPrompt>(
  {
    title: {
      type: String,
      trim: true,
    },
    promptText: {
      type: String,
      required: [true, "Prompt text is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
    category: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
PromptSchema.index({ promptText: "text", title: "text", tags: "text" });

const Prompt: Model<IPrompt> =
  mongoose.models.Prompt || mongoose.model<IPrompt>("Prompt", PromptSchema);

export default Prompt;
