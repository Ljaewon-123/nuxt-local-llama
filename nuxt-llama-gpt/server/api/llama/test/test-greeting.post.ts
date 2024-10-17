import path from "path";
import {GeneralChatWrapper, getLlama, LlamaChatSession} from "node-llama-cpp";
import { io } from "~~/server/plugins/socket.io"
import ChatHistoryModel from "~~/server/models/ChatHistory";
import { AuthSession } from "../../types/session.type";
import ChatSessionModel from "~~/server/models/ChatSession";
import UsersModel from "~~/server/models/Users";
import fs from "fs/promises";

export default defineEventHandler(async(event) => {

  const config = useRuntimeConfig()
  const body = await readBody<{ message: string }>(event)

  io.emit('goto', true)

  const chatHistory = JSON.parse(await fs.readFile("chatHistory.json", "utf8"));
  console.log(chatHistory, 'chat history 저장 요소 확인 ')
  
  const currentSession = await PageAuth.getCurrentSession(event)

  const user = await UsersModel.findOne({
    email: currentSession.data.email,
  })
  if(!user) throw Error('User not found')

  // 정확하게 방금 만든 세션만 가져와야함 최근 세션만 가져오기 
  // 이게 버그가 난다면 유저 컬렉션조회하고 거기 세션에서 .at(-1)
  const chatSession = await ChatSessionModel.findOne({ email: user._id }).sort({ createdAt: -1 })

  const historyModel = new ChatHistoryModel({
    email: currentSession.data.email,
    messages: chatHistory,
    session: chatSession
  });
  
  await historyModel.validate()
  await historyModel.save()
  
  chatSession?.histories.push(historyModel._id)
  
  await chatSession?.validate()
  await chatSession?.save()
  
  return { successCode: 1 }
})

