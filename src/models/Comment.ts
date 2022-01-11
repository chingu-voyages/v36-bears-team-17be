import mongoose, { Document } from 'mongoose'

export interface IComments extends Document {}

const CommentsSchema = new mongoose.Schema<IComments>({})

export const Comments = mongoose.model<IComments> ('Comments', CommentsSchema)
