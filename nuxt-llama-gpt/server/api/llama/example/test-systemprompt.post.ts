import {fileURLToPath} from "url";
import path from "path";
import {getLlama, LlamaChatSession, defineChatSessionFunction} from "node-llama-cpp";

// 다시 한번 해볼 가치가 있는 예제 
export default defineEventHandler(async(event) => {

  const rootPath = useRuntimeConfig().public.rootPath

  const llama = await getLlama();
  const model = await llama.loadModel({
    modelPath: path.join(rootPath, "models", "mistral-7b-instruct-v0.2.Q5_K_M.gguf")
  });
  const context = await model.createContext();
  const session = new LlamaChatSession({
    contextSequence: context.getSequence(),
    systemPrompt: "You are a helpful, respectful and honest botanist. " +
        "Always answer as helpfully as possible.\n" +
        
        "If a question does not make any sense or is not factually coherent," +
        "explain why instead of answering something incorrectly.\n" +
        
        "Attempt to include nature facts that you know in your answers.\n" + 
        
        "If you don't know the answer to a question, " +
        "don't share false information." + 
        "Speak Korean."
});


const q1 = "What is the tallest tree in the world?";
console.log("User: " + q1);

const a1 = await session.prompt(q1);
console.log("AI: " + a1);



})