import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
	{
		uid: {
			type: String,
			required: [true, 'Uid is a required field'],
			unique: true,
		},
    email: {
      type: String,
    },
		username: {
			type: String,
		},
    password: { // (Hashed password)
      type: String,
    },
		speedGameBest: {
			type: Number,
			default: 0,
		},
		memoryGameBest: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
)

const User = mongoose.model('User', UserSchema)

export default User
