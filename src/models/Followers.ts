import mongoose, { Document } from 'mongoose'

export interface IFollowers extends Document {}

const FollowersSchema = new mongoose.Schema<IFollowers>({})

export const Followers = mongoose.model<IFollowers>('Followers', FollowersSchema)
