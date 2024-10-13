import path from "path";
import {GeneralChatWrapper, getLlama, LlamaChatSession} from "node-llama-cpp";
import { io } from "~~/server/plugins/socket.io"
import ChatHistoryModel from "~~/server/models/ChatHistory";
import { AuthSession } from "../../types/session.type";

export default defineEventHandler(async(event) => {

  const config = useRuntimeConfig()
  const rootPath = config.public.rootPath
  const llamaName = config.llamaName
  const body = await readBody<{ message: string }>(event)
  const llama = await getLlama();
  const model = await llama.loadModel({
    modelPath: path.join(rootPath, "models", llamaName + ".gguf")
  });
  const context = await model.createContext();

  const session = new LlamaChatSession({
    contextSequence: context.getSequence(),
    systemPrompt: 
    "You are an AI that generates titles. When a user asks a question, \n" + 
    "create a concise title that summarizes the question in less than 20 characters. \n" +
    "Ensure the title is clear, relevant, and short."
  });

  let answer: string
  const question = body.message

  try{
    answer = await session.prompt(question)
    
    const chatHistory = session.getChatHistory();
    console.log(chatHistory, '요약 프롬프트 확인 ')
  }
  catch{
    throw createError({
      status: 500,
      message: "LLama prompt error"
    })
  }

  return answer
})
