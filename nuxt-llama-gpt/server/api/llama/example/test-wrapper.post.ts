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

  // 이전대답에 대해 재질문 하는 template wrapper 유용할거같은데 활용하기 힘들거같다 
  const chatWrapper = new TemplateChatWrapper({
      template: "{{systemPrompt}}\n{{history}}model: {{completion}}\nuser: ",
      historyTemplate: {
        system: "system: {{message}}\n",
        user: "user: {{message}}\n",
        model: "model: {{message}}\n"
      },
      // functionCallMessageTemplate: { // optional
      //     call: "[[call: {{functionName}}({{functionParams}})]]",
      //     result: " [[result: {{functionCallResult}}]]"
      // }
  });
  const session = new LlamaChatSession({
    contextSequence: context.getSequence(),
    chatWrapper: chatWrapper
  });


  const q1 = "Hi there, how are you?";
  console.log("User: " + q1);

  const a1 = await session.prompt(q1);
  console.log("AI: " + a1);


  const q2 = "Summarize what you said";
  console.log("User: " + q2);

  const a2 = await session.prompt(q2);
  console.log("AI: " + a2);

  return 'Done'
})