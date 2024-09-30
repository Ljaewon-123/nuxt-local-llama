import path from "path";
import fs from "fs/promises";
import {getLlama, LlamaChatSession, defineChatSessionFunction} from "node-llama-cpp";

export default defineEventHandler(async(event) => {

  const config = useRuntimeConfig()
  const rootPath = config.public.rootPath
  const llamaName = config.llamaName

  const llama = await getLlama();
  const model = await llama.loadModel({
    modelPath: path.join(rootPath, "models", llamaName + ".gguf")
  });
  const context = await model.createContext();
  const session = new LlamaChatSession({
    contextSequence: context.getSequence()
  });
  
  const chatHistory = JSON.parse(await fs.readFile("chatHistory.json", "utf8"));
  session.setChatHistory(chatHistory);

  const q2 = "Summarize what you said";
  console.log("User: " + q2);

  const a2 = await session.prompt(q2);
  console.log("AI: " + a2);

})