import {fileURLToPath} from "url";
import path from "path";
import {GeneralChatWrapper, getLlama, LlamaChatSession} from "node-llama-cpp";
import {TemplateChatWrapper} from "node-llama-cpp";

export default defineEventHandler(async(event) => {
  // const __dirname = path.dirname(fileURLToPath(import.meta.url)); # 일단 여기저기서 불릴거라 
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


  const q1 = "Hi there, how are you?";
  console.log("User: " + q1);

  process.stdout.write("AI: ");
  const a1 = await session.prompt(q1, {
    // 로그를 안찍어도 표시가 된다 socket대신에 사용하는거 같은데 
    onTextChunk(chunk: string) { // 스트리밍에 유용하다고 되어있다 text를 청크로 나눠서 전달에서 그런거 같긴한데
      // socket emit()
      process.stdout.write(chunk);
    }
  });

  return 'Done'
})

// What diff?
// const a1 = await session.prompt(q1, {
//   repeatPenalty: {
//       lastTokens: 24,
//       penalty: 1.12,
//       penalizeNewLine: true,
//       frequencyPenalty: 0.02,
//       presencePenalty: 0.02,
//       punishTokensFilter(tokens: Token[]) {
//           return tokens.filter(token => {
//               const text = model.detokenize([token]);

//               // allow the model to repeat tokens
//               // that contain the word "better"
//               return !text.toLowerCase().includes("better");
//           });
//       }
//   }
// });
// console.log("AI: " + a1);