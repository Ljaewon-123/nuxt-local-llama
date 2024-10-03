import path from "path";
import {GeneralChatWrapper, getLlama, LlamaChatSession} from "node-llama-cpp";
import { io } from "~~/server/plugins/socket.io"

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
        console.log(chunk)
      }
    })
  }
  catch{
    throw createError({
      status: 500,
      message: "LLama prompt error"
    })
  }

  return { successCode: 1 }
})