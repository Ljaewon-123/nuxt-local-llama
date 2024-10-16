import path from "path";
import {GeneralChatWrapper, getLlama, LlamaChatSession} from "node-llama-cpp";

// prompt 사전로드 조건만 합당하면 ( 최대길이 등 ) 훨씬 반응을 빨리한다.
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
  });


  const prompt = "Hi there, how are you?";

  // preload 직후는 차이는 효과가 없기때문에 예제에서는 10초를 기다려 추론능력을 끌어올린다.
  console.log("Preloading prompt");
  await session.preloadPrompt(prompt);

  console.log("Prompt preloaded. Waiting 10 seconds");
  await new Promise(resolve => setTimeout(resolve, 1000 * 10));

  console.log("Generating response...");
  process.stdout.write("AI: ");
  const res = await session.prompt(prompt, {
    onTextChunk(text) {
      process.stdout.write(text);
    }
  });

  console.log("AI: " + res);
})