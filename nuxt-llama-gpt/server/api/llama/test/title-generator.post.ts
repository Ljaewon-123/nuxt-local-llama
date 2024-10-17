import ChatSessionModel from "~~/server/models/ChatSession";
import UsersModel from "~~/server/models/Users";


export default defineEventHandler(async(event) => {

  const config = useRuntimeConfig()
  const rootPath = config.public.rootPath
  const body = await readBody<{ message: string }>(event)

  let answer: string 
  const question = body.message

  const currentSession = await PageAuth.getCurrentSession(event)

  answer = "New Title Test"
  const user = await UsersModel.findOne({
    email: currentSession.data.email,
  })
  if(!user) throw Error('User not found')
  const newSession = new ChatSessionModel({ 
    email: user._id,
    title: answer
  });
  await newSession.validate() 
  await newSession.save();

  user.chatSession.push(newSession._id)

  await user.validate()
  await user.save();

  return answer
})
