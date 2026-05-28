import mongoose from "mongoose";

const User_Schema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	type: { type: String, required: true },
	password: { type: String, required: true },
	name: { type: String },
	code: { type: String },
	ttl: { type: Date, expires: 0 },
	attempts: { type: Number },
	verified: { type: Boolean },
});

const Session_Schema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	token: { type: String, required: true, unique: true },
	ttl: { type: Date, expires: 0, required: true },
});

const ChangeCreds_Schema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	newEmail: { type: String },
	type: { type: String },
	password: { type: String },
	code: { type: String },
	ttl: { type: Date, expires: 0 },
	attempts: { type: Number }
});

export const User_Model = mongoose.model("User", User_Schema);
export const ChangeCreds_Model = mongoose.model("ChangeCreds", ChangeCreds_Schema);
export const Session_Model = mongoose.model("Session", Session_Schema);
