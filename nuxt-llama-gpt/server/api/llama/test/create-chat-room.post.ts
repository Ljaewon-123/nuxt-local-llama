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
    `,
  });
  // temperature  # systemPrompt만으로는 안될거 같다. 다른 옵션도 추가해봐야겠음 

  let answer: string
  const question = body.message

  try{
    answer = await session.prompt(question, {
      temperature: 0.8, // 텍스트의 임의성을 제어 클수록 무작위성 
      topK: 40, // 가장 가능성이 높은 K개의 다음 토큰만 고려하도록 모델을 제한
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

  return answer
})
