import mongoose, { Document } from 'mongoose'

export interface IFollowing extends Document {}

const FollowingSchema = new mongoose.Schema<IFollowing>({})

export const Following = mongoose.model<IFollowing>('Following', FollowingSchema)
