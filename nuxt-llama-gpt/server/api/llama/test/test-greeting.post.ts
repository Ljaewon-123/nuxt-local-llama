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
  
  const authSession = await PageAuth.createSession(event)
  const redis = useRedis()

  if(!authSession.id) {
    throw createError(new LoginSessionInvailed()) // 결국 클라이언트에서 어느정도 처리해줘야함 
  }

  const currentSession = await redis.getItem<AuthSession>(authSession.id)

  if(!currentSession) {
    throw createError(new LoginSessionInvailed())
  }

  const user = await UsersModel.findOne({
    email: currentSession.data.email,
  })
  if(!user) throw Error('User not found')

  const chatSession = await ChatSessionModel
                        .findOne({ email: user._id })
                        .populate('histories');

  const historyModel = new ChatHistoryModel({
    email: currentSession.data.email,
    messages: chatHistory,
    session: chatSession
  });

  chatSession?.histories.push(historyModel._id)
  
  await chatSession?.validate()
  await chatSession?.save()

  await historyModel.validate()
  await historyModel.save()

  return { successCode: 1 }
})

