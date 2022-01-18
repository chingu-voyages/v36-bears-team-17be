import mongoose, { Document, PopulatedDoc } from 'mongoose'
import { IUser } from './User'
import { IComments } from './Comment'
import { ILike } from './Like'

export interface IPost extends Document {
  title: string
  description: string
  tags: string[]
  imageURL?: string
  createdAt: Date
  user: PopulatedDoc<IUser>
  comments?: PopulatedDoc<IComments>
  likes?: PopulatedDoc<ILike>
}

const PostSchema = new mongoose.Schema<IPost>({
  title: {
    type: String,
    required: [true, 'Please enter a caption'],
  },
  description: {
    type: String,
    required: [true, 'Please enter a description'],
  },
  tags: { type: [String] },
  imageURL: {
    type: String,
    required: [false, 'Please enter the image URL'],
  },
  createdAt: { type: Date, default: Date.now },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      required: false,
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Like',
      required: false,
    },
  ],
})

export const Post = mongoose.model<IPost>('Post', PostSchema)
