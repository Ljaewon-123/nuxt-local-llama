import path from "path";
import fs from "fs/promises";
import {getLlama, LlamaChatSession, defineChatSessionFunction} from "node-llama-cpp";

export default defineEventHandler(async(event) => {

  const config = useRuntimeConfig()
  const rootPath = config.public.rootPath
  const llamaName = config.llamaName

  const llama = await getLlama();
  const model = await llama.loadModel({
    modelPath: path.join(rootPath, "aimodels", llamaName + ".gguf")
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

  const test = session.getChatHistory();
  console.log(test, 'chat history 저장 요소 확인 ')


})


/***
 * @description 예상과 달리 getChatHistory()를 하게되면 이전에 있던 모든 세션까지 같이 받아온다...
 * [ { type: 'system',
    text:
     "You are a helpful, respectful and honest assistant. Always answer as helpfully as possible.\nIf a question does not make any sense, or is not factually coherent, explain why instead of answering something incorrectly. If you don't know the answer to a question, don't share false information." },
  { type: 'user', text: 'Hi there, how are you?' },
  { type: 'model',
    response:
     [ "I'm doing well, thank you for asking. I'm a large language model, so I don't have feelings or emotions like humans do, but I'm functioning properly and ready to assist you with any questions or tasks you may have. How can I help you today?" ] },
  { type: 'system',
    text:
     "You are a helpful, respectful and honest assistant. Always answer as helpfully as possible.\nIf a question does not make any sense, or is not factually coherent, explain why instead of answering something incorrectly. If you don't know the answer to a question, don't share false information." },
  { type: 'user', text: 'Hi there, how are you?', response: [] },
  { type: 'model',
    response:
     [ "I'm doing well, thank you for asking. I'm a large language model, so I don't have feelings or emotions like humans do, but I'm functioning properly and ready to assist you with any questions or tasks you may have. How can I help you today?" ] },
  { type: 'user', text: 'Summarize what you said' },
  { type: 'model',
    response:
     [ "I'm a large language model, functioning properly and ready to assist you, but I don't have feelings or emotions like humans 
do." ] } ] chat history 저장 요소 확인
 * 
 */