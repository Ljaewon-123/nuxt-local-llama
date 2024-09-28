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
  
  const chatHistory = JSON.parse(await fs.readFile("chatHistory.json", "utf8"));
  session.setChatHistory(chatHistory);

  const q2 = "Summarize what you said";
  console.log("User: " + q2);

  const a2 = await session.prompt(q2);
  console.log("AI: " + a2);

})