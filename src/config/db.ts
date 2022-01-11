import mongoose from 'mongoose'

export const connectMongo = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI)
  console.log(`$$ ~ Mongodb connected to${conn.connection.host}`)
}
