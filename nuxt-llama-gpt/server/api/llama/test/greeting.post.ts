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
  });


  const question = body.message
  console.log('question user: ',question)

  try{
    const answer = await session.prompt(question, {
      onTextChunk(chunk: string) {
        io.emit('chat', chunk)
      }
    })
    console.log(answer, '마지막')
  }
  catch{
    throw createError({
      status: 500,
      message: "LLama prompt error"
    })
  }

  // 모든 입력이 끝나고 화면을 가장 아래로 내려줌 
  io.emit('goto', true)

  const chatHistory = session.getChatHistory();
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

  console.log(currentSession.data.email, 'im session')
  const chatSession = new ChatHistoryModel({
    email: currentSession.data.email,
    messages: chatHistory
  });

  await chatSession.validate()
  await chatSession.save()

  return { successCode: 1 }
})

// chat 히스토리는 그때그때 한것만 리턴함 
// 각 세션별로 
// restore 기능 필요 
// 각 채팅 재목별로 구분지을 기능 필요 

// 우선 server쪽에서도 세션만료시 login으로 보내는 기능 필요