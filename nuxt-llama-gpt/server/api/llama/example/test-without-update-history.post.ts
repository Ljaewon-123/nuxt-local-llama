import path from "path";
import fs from "fs/promises";
import {getLlama, LlamaChatSession, defineChatSessionFunction} from "node-llama-cpp";

// ai가 이전 상호작용을 기억하지 못함 ( 전부를 기억 못하는건가? )
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
  
  // Save the initial chat history
  const initialChatHistory = session.getChatHistory();

  const q1 = "Hi there, how are you?";
  console.log("User: " + q1);

  const a1 = await session.prompt(q1);
  console.log("AI: " + a1);

  // Reset the chat history
  session.setChatHistory(initialChatHistory);

  const q2 = "Summarize what you said";
  console.log("User: " + q2);

  // This response will not be aware of the previous interaction
  const a2 = await session.prompt(q2);
  console.log("AI: " + a2);
})