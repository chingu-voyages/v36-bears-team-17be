import mongoose, { Document } from 'mongoose'

export interface ILike extends Document {}

const LikeSchema = new mongoose.Schema<ILike>({})

export const Like = mongoose.model<ILike>('Like', LikeSchema)
