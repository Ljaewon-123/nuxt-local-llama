import mongoose from "mongoose";

interface Chat {
  email: string;
  messages: {
    type: string;
    text?: string;
    response?: string[];
  }[];
}

// 필요한거 유저 1. 설정된 채팅래퍼 2. 유저 질문 3. ai 답변 4. 유저 고유값 ( email )
const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return /^\S+@\S+\.\S+$/.test(v);
      },
      message: (props: { value: string }) => `${props.value}는 유효한 이메일 형식이 아닙니다!`
    },
  },
  messages: [
    {
      type: {
        type: String,
        required: true,
        enum: ['system', 'user', 'model'],
      },
      text: {
        type: String,
      },
      response: {
        type: [String],
      },
    },
  ],
}, { timestamps: true });

// Compiling Schema
const ChatHistoryModel = mongoose.model('chatHistory', schema)

export default ChatHistoryModel