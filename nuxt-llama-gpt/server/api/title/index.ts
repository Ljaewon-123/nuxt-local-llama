import UsersModel from "~~/server/models/Users"

export default defineEventHandler( async(event) => {

  const currentSession = await PageAuth.getCurrentSession(event)
  const user = await UsersModel.findOne({
    email: currentSession.data.email,
  }).populate({
    path: 'chatSession',
    select: '-email -createdAt -histories' // 필드를 제외하고 가져옴 
  })
  if(!user) throw Error('User not found')

  // console.log(user.chatSession)
  return user.chatSession
})