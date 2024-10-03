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

  const answer = await session.prompt(question, {
    // 로그를 안찍어도 표시가 된다 socket대신에 사용하는거 같은데 
    onTextChunk(chunk: string) { // 스트리밍에 유용하다고 되어있다 text를 청크로 나눠서 전달에서 그런거 같긴한데
      // socket emit()
      // 여기서 socket을 해야하는데... 
      io.emit('chat', chunk)
      console.log(chunk)
    }
  });

  return 'Done!'
})