import UsersModel from "~~/server/models/Users"

export default defineEventHandler( async(event) => {
  const PER_PAGE = 10
  const params = getRouterParams(event)
  const currentPage = Number(params.id)
  if(Number.isNaN(currentPage)) {
    console.error("Bad Request")
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request"
    })
  }
  const currentSession = await PageAuth.getCurrentSession(event)
  const user = await UsersModel.findOne({
    email: currentSession.data.email,
  })
    .populate({
      path: 'chatSession',
      select: '-email -createdAt -histories -__v', // 필드를 제외하고 가져옴 
      options: { 
        sort: { updatedAt: -1 }, 
        skip: (currentPage -1) * PER_PAGE,
        limit: PER_PAGE 
      }
    })
  if(!user) throw Error('User not found')

  if(user.chatSession.length == 0) {
    console.error("No Content")

    return { last: true }
    // throw createError({
    //   statusCode: 204,
    //   statusMessage: "No Content"
    // })
  }

  console.log('load title', params, )
  return user.chatSession
})