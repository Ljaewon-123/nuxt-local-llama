import path from "path";
import fs from "fs/promises";
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
  const params = getRouterParams(event)

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

  // _id 유니크라서 email없어도 괜찮을거라는 판단.
  // lean을 사용하면 mongo docs가 아니고 lean을 사용하지않으면 setChatHistory에 안들어간다 문서에는 js객체를 문서로 만드는 법은 없는거같은데 
  const chatRestore = await ChatSessionModel.findOne({ _id: params.id })
                                            .populate('histories')
                                            .lean();

  const chatSession = await ChatSessionModel.findOne({ _id: params.id })

  const restoreHistory = chatRestore?.histories
  if(restoreHistory){
    const allMessages = restoreHistory.reduce((acc, item: any) => acc.concat(item.messages), [] as any[]);
    // [request error] [unhandled] [500] [object Array] could not be cloned.
    session.setChatHistory(allMessages);
  }


  try{
    const answer = await session.prompt(question, {
      onTextChunk(chunk: string) {
        io.to(currentSession.data.email).emit('chat', chunk) 
      }
    })
    // console.log(answer, '마지막')
  }
  catch{
    throw createError({
      status: 500,
      message: "LLama prompt error"
    })
  }

  // 모든 입력이 끝나고 화면을 가장 아래로 내려줌 
  io.to(currentSession.data.email).emit('goto', true)

  const chatHistory = session.getChatHistory();
  console.log(chatHistory, 'chat history 저장 요소 확인 ')

  const historyModel = new ChatHistoryModel({
    email: currentSession.data.email,
    messages: chatHistory.slice(-2),
    session: chatSession
  });

  try{
    await historyModel.validate()
    await historyModel.save()
  }
  catch(e){
    console.error('historyModel 저장실패', e)
    throw Error('Chat Save Fail')
  }
  
  chatSession?.histories.push(historyModel._id)
  
  try{
    await chatSession?.validate()
    await chatSession?.save()
  }
  catch(e){
    console.error('chatSession 저장실패', e)
    throw Error('Chat Save Fail')
  }

  console.log('success text')
  return { successCode: 1 }
})

// chat 히스토리는 그때그때 한것만 리턴함 
// 각 세션별로 
// restore 기능 필요 
// 각 채팅 재목별로 구분지을 기능 필요 

// 우선 server쪽에서도 세션만료시 login으로 보내는 기능 필요 -> 클라이언트에서 처리 