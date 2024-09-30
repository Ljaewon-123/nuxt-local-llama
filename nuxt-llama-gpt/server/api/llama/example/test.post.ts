import {fileURLToPath} from "url";
import path from "path";
import {GeneralChatWrapper, getLlama, LlamaChatSession} from "node-llama-cpp";

export default defineEventHandler(async(event) => {
  // const __dirname = path.dirname(fileURLToPath(import.meta.url)); # 일단 여기저기서 불릴거라 
  const config = useRuntimeConfig()
  const rootPath = config.public.rootPath
  const llamaName = config.llamaName

  const llama = await getLlama();
  const model = await llama.loadModel({
    modelPath: path.join(rootPath, "models", llamaName + ".gguf")
  });
  const context = await model.createContext();
  const session = new LlamaChatSession({
    contextSequence: context.getSequence(),
    chatWrapper: new GeneralChatWrapper()
  });


  const q1 = "Hi there, how are you?";
  console.log("User: " + q1);

  const a1 = await session.prompt(q1);
  console.log("AI: " + a1);


  const q2 = "Summarize what you said";
  console.log("User: " + q2);

  const a2 = await session.prompt(q2);
  console.log("AI: " + a2);

  return 'Done'
})