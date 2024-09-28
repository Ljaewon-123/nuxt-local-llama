import path from "path";
import fs from "fs/promises";
import {getLlama, LlamaChatSession, defineChatSessionFunction} from "node-llama-cpp";

export default defineEventHandler(async(event) => {

  const rootPath = useRuntimeConfig().public.rootPath

  const llama = await getLlama();
  const model = await llama.loadModel({
    modelPath: path.join(rootPath, "models", "mistral-7b-instruct-v0.2.Q5_K_M.gguf")
  });
  const context = await model.createContext();
  const session = new LlamaChatSession({
      contextSequence: context.getSequence()
  });
  
  
  const q1 = "Hi there, how are you?";
  console.log("User: " + q1);
  
  const a1 = await session.prompt(q1);
  console.log("AI: " + a1);
  
  const chatHistory = session.getChatHistory();
  await fs.writeFile("chatHistory.json", JSON.stringify(chatHistory), "utf8");

})