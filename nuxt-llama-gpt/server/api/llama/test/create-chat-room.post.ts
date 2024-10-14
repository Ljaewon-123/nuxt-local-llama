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
    `You are an AI that generates concise titles for your questions. 
    If you ask a user a question, please make sure to write a title of up to 20 characters. 
    You can only say one title.`
  });
  // temperature  # systemPrompt만으로는 안될거 같다. 다른 옵션도 추가해봐야겠음 

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
