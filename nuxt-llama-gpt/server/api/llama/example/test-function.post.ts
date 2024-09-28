import {fileURLToPath} from "url";
import path from "path";
import {getLlama, LlamaChatSession, defineChatSessionFunction} from "node-llama-cpp";

// 내 대답에 따른 정답을 확정시킬수있다. 
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

  const fruitPrices: Record<string, string> = {
      "apple": "$6",
      "banana": "$4"
  };
  const functions = {
      getFruitPrice: defineChatSessionFunction({
          description: "Get the price of a fruit",
          params: {
              type: "object",
              properties: {
                  name: {
                      type: "string"
                  }
              }
          },
          async handler(params) {
              const name = params.name.toLowerCase();
              if (Object.keys(fruitPrices).includes(name))
                  return {
                      name: name,
                      price: fruitPrices[name]
                  };

              return `Unrecognized fruit "${params.name}"`;
          }
      })
  };


  const q1 = "Is an apple more expensive than a banana?";
  console.log("User: " + q1);

  const a1 = await session.prompt(q1, {functions});
  console.log("AI: " + a1);

})