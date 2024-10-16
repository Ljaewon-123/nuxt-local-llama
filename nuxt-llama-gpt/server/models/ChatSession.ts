import mongoose, { Schema } from "mongoose";

// we needs 1. 고유인덱스(ObjectId?) 2. title 3. chatHistory: [] 4.유저정보 
const schema = new mongoose.Schema({
  email: { type: Schema.Types.ObjectId, ref: 'users' },
  histories:[{
    type: Schema.Types.ObjectId, ref: "chatHistory"
  }]
})


const ChatSessionModel = mongoose.model('chatSession', schema)

export default ChatSessionModel