import mongoose, { Document, PopulatedDoc } from "mongoose";
import { IUser } from "./User";
import { IPost } from "./Post";

export interface ILike extends Document {
  user: PopulatedDoc<IUser>;
  post: PopulatedDoc<IPost>;
  date: Date;
}

const LikeSchema = new mongoose.Schema<ILike>({
  date: { type: Date, default: Date.now },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
});
LikeSchema.index({ post: 1, user: 1 }, { unique: true });

export const Like = mongoose.model<ILike>("Like", LikeSchema);
