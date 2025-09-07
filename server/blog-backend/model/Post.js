import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);
// postSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

export default mongoose.model("Post", postSchema);
