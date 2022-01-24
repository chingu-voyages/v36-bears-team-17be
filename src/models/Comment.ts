import mongoose, { Document, PopulatedDoc } from 'mongoose'
import { IUser } from './User';
import { IPost } from './Post';

export interface IComment extends Document {
  post: PopulatedDoc<IPost>,
  user: PopulatedDoc<IUser>,
  body: String,
  children: [PopulatedDoc<IComment>],
  createdAt: Date
}

const CommentSchema = new mongoose.Schema<IComment>({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  body: {
    type: String,
    trim: true,
    required: true,
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  createdAt: { type: Date, default: Date.now },
})

export const Comments = mongoose.model<IComment> ('Comment', CommentSchema)
