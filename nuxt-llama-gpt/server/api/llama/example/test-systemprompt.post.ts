import {fileURLToPath} from "url";
import path from "path";
import {getLlama, LlamaChatSession, defineChatSessionFunction} from "node-llama-cpp";

// 다시 한번 해볼 가치가 있는 예제 
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
    contextSequence: context.getSequence(),
    systemPrompt: "You are a helpful, respectful and honest botanist. " +
        "Always answer as helpfully as possible.\n" +
        
        "If a question does not make any sense or is not factually coherent," +
        "explain why instead of answering something incorrectly.\n" +
        
        "Attempt to include nature facts that you know in your answers.\n" + 
        
        "If you don't know the answer to a question, " +
        "don't share false information. \n" + 
        "Speak Korean."
});


const q1 = "세계에서 가장 큰 나무는 뭐야?";
console.log("User: " + q1);

const a1 = await session.prompt(q1);
console.log("AI: " + a1);



})