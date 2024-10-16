import path from "path";
import {GeneralChatWrapper, getLlama, LlamaChatSession} from "node-llama-cpp";
import { io } from "~~/server/plugins/socket.io"
import ChatHistoryModel from "~~/server/models/ChatHistory";
import { AuthSession } from "../types/session.type";
import ChatSessionModel from "~~/server/models/ChatSession";
import UsersModel from "~~/server/models/Users";

export default defineEventHandler(async(event) => {

  const config = useRuntimeConfig()
  const rootPath = config.public.rootPath
  const llamaName = config.llamaName
  const body = await readBody<{ message: string }>(event)
  const llama = await getLlama();
  const model = await llama.loadModel({
    modelPath: path.join(rootPath, "aimodels", llamaName + ".gguf")
  });
  const context = await model.createContext();

  const session = new LlamaChatSession({
    contextSequence: context.getSequence(),
    systemPrompt: 
    `You are an AI that only generates **short and concise titles**. 
    You **must** create a title with a **maximum of 30 characters**, no matter how complex the question is.
    You cannot provide a long explanation or code snippets.
    Only provide a **single short title sentence**. If you generate anything more than a title, you are failing.
    Examples:
    - Question: 'Can you write me a JavaScript Promise example?' → Title: 'Promise Example'
    - Question: 'Write a function in Python' → Title: 'Python Function'
    - Question: 'How do I use Promises in JavaScript?' → Title: 'JavaScript Promises'
    - Question: 'What colors are in a rainbow?' → Title: 'Rainbow Colors'"
    - Question: 'Make some code ~' → Title: 'Create some code'"
    - Question: 'Why is the sky blue?' → Title: 'Sky Color Reason'
    - Question: 'How does a rainbow form?' → Title: 'Rainbow Formation'
    - Question: '하늘이 파란색인 이유' → Title: '하늘이 파란 이유'
    - Question: '무지개는 어떻게 생기나?' → Title: '무지개 생성 원리'
    `,
  });
  // 번역 문제인건가....???? 

  let answer: string 
  const question = body.message

  try{
    answer = await session.prompt(question, {
      temperature: 0.7, // 텍스트의 임의성을 제어 클수록 무작위성 
      topK: 50, // 가장 가능성이 높은 K개의 다음 토큰만 고려하도록 모델을 제한
      topP: 0.9, // 더 자연스러운 문장 생성
      seed: 2462 // 생성된 텍스트의 임의성을 제어, 창의적 점수같은데 제목 생성기엔 적합할듯
    })
    
    const chatHistory = session.getChatHistory();
    console.log(chatHistory, '요약 프롬프트 확인 ')
  }
  catch{
    throw createError({
      status: 500,
      message: "LLama prompt error"
    })
  }

  const authSession = await PageAuth.createSession(event)
  const redis = useRedis()

  if(!authSession.id) {
    throw createError(new LoginSessionInvailed()) 
  }
  const currentSession = await redis.getItem<AuthSession>(authSession.id)
  if(!currentSession) {
    throw createError(new LoginSessionInvailed())
  }

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

  return answer
})
