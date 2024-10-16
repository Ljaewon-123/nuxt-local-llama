import mongoose, { Schema } from "mongoose";

// Defining Schema
const schema = new mongoose.Schema({
  email: { 
    type: String,
    required: true, 
    trim: true, 
    unique: true,
    validate: {
      validator: function(v: string) {
        return /^\S+@\S+\.\S+$/.test(v);
      },
      message: (props: { value: string }) => `${props.value}는 유효한 이메일 형식이 아닙니다!`
    },
  },
  userName: { type: String, required: true, trim: true},
  password: { type: String, required: true, trim: true},
  chatSession: [{ type: Schema.Types.ObjectId, ref: "chatSession" }]
})

// Compiling Schema
const UsersModel = mongoose.model('users', schema)

export default UsersModel