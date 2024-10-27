import mongoose, { Schema } from "mongoose";
import ChatHistoryModel from "./ChatHistory";
import UsersModel from "./Users";

// we needs 1. 고유인덱스(ObjectId?) 2. title 3. chatHistory: [] 4.유저정보 
const schema = new mongoose.Schema({
  email: { type: Schema.Types.ObjectId, ref: 'users', require: true, trim: true },
  title: { type: String, trim: true, require: true, default: 'New Chat' },
  histories:[{
    type: Schema.Types.ObjectId, ref: "chatHistory", trim: true
  }]
}, { timestamps: true })

// Pre-middleware to handle related deletions
schema.pre("findOneAndDelete", async function (next) {
  const sessionId = this.getQuery()._id;

  // 1. chatHistory에서 관련 문서 삭제
  await ChatHistoryModel.deleteMany({ session: sessionId });

  // 2. users에서 관련 세션 ID 제거
  await UsersModel.updateMany(
    { chatSession: sessionId },
    { $pull: { chatSession: sessionId } }
  );

  next();
});


const ChatSessionModel = mongoose.model('chatSession', schema)

export default ChatSessionModel