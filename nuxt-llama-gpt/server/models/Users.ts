import mongoose from "mongoose";

// Defining Schema
const schema = new mongoose.Schema({
  email: { type: String, required: true, trim: true, unique: true},
  userName: { type: String, required: true, trim: true},
  password: { type: String, required: true, trim: true},
})

// Compiling Schema
const UsersModel = mongoose.model('users', schema)

export default UsersModel