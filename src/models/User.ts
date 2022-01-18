import mongoose, { Document } from 'mongoose'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export interface IUser extends Document {
  displayName: string
  username: string
  email: string
  password: string
  socials: Map<string, string>
  image: string
  passwordResetToken: string
  passwordResetExpire: Date
  createdAt: Date
  matchPassword: (password: string) => boolean
}

const UserSchema = new mongoose.Schema<IUser>({
  displayName: { type: String, required: true },
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
    match: [
      /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
      `Your username must be 8-20 characters long. a-z A-z 0-9 and _ are allowed in your username. No _ or . at the beginning or at the end. Combination of __ or _. or ._ or .. are not allowed.`,
    ],
    minLength: 8,
  },
  email: {
    type: String,
    required: [true, 'Please add an email address'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minLength: 6,
    select: false,
  },
  socials: {
    type: Map,
    of: String,
  },
  image: {
    type: String,
    required: false,
  },
  passwordResetToken: String,
  passwordResetExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  })
}

// Match user entered password to hashed password in the database
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Generate and hash password token
UserSchema.methods.getPasswordResetToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex')

  // Hash the token and set it to reset password token Field
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  // Set Token Expire time
  this.passwordResetExpire = Date.now() + 10 * 60 * 10000
  return resetToken
}

export const User = mongoose.model<IUser>('User', UserSchema)
