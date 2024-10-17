import path from "path";
import fs from "fs/promises";
import {GeneralChatWrapper, getLlama, LlamaChatSession} from "node-llama-cpp";
import { io } from "~~/server/plugins/socket.io"
import ChatHistoryModel from "~~/server/models/ChatHistory";
import ChatSessionModel from "~~/server/models/ChatSession";
import UsersModel from "~~/server/models/Users";
import { AuthSession } from "../../types/session.type";

export default defineEventHandler(async(event) => {

  const config = useRuntimeConfig()
  const rootPath = config.public.rootPath
  const body = await readBody<{ message: string }>(event)

  let answer: string 
  const question = body.message

  const authSession = await PageAuth.createSession(event)
  const redis = useRedis()

  if(!authSession.id) {
    throw createError(new LoginSessionInvailed()) 
  }
  const currentSession = await redis.getItem<AuthSession>(authSession.id)
  if(!currentSession) {
    throw createError(new LoginSessionInvailed())
  }

  answer = "New Title Test"
  const user = await UsersModel.findOne({
    email: currentSession.data.email,
  })
  if(!user) throw Error('User not found')
  const newSession = new ChatSessionModel({ 
    email: user._id,
    title: answer
  });
  await newSession.validate() 
  await newSession.save();

  user.chatSession.push(newSession._id)

  await user.validate()
  await user.save();

  return answer
})
