import mongoose, { Schema } from "mongoose";

// Defining Schema
const schema = new mongoose.Schema({
  email: { type: String, required: true, trim: true, unique: true},
  userName: { type: String, required: true, trim: true},
  password: { type: String, required: true, trim: true},
  chatSession: [{ type: Schema.Types.ObjectId, ref: "chatSession" }]
})

// Compiling Schema
const UsersModel = mongoose.model('users', schema)

export default UsersModel