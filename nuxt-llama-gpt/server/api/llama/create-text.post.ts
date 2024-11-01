import path from "path";
import {GeneralChatWrapper, getLlama, LlamaChatSession} from "node-llama-cpp";
import { io } from "~~/server/plugins/socket.io"
import ChatHistoryModel from "~~/server/models/ChatHistory";
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
  });

  const currentSession = await PageAuth.getCurrentSession(event)

  const question = body.message
  console.log('question user: ', question)

  try{
    const answer = await session.prompt(question, {
      onTextChunk(chunk: string) {
        io.to(currentSession.data.email).emit('chat', chunk) 
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
  

  const user = await UsersModel.findOne({
    email: currentSession.data.email,
  })
  if(!user) throw Error('User not found')

  // 정확하게 방금 만든 세션만 가져와야함 최근 세션만 가져오기 
  // 이게 버그가 난다면 유저 컬렉션조회하고 거기 세션에서 .at(-1)
  const chatSession = await ChatSessionModel.findOne({ email: user._id }).sort({ updatedAt: -1 })

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

// chat 히스토리는 그때그때 한것만 리턴함 
// 각 세션별로 
// restore 기능 필요 
// 각 채팅 재목별로 구분지을 기능 필요 

// 우선 server쪽에서도 세션만료시 login으로 보내는 기능 필요 -> 클라이언트에서 처리 