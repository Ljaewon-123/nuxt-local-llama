import ChatSessionModel from "~~/server/models/ChatSession"

export default defineEventHandler( async(event) => {

  const body = await readBody(event)
  console.log(body)

  try{
    const updateChatSession = await ChatSessionModel.findByIdAndUpdate(
      body.id,
      { title: body.title },
      { new: true }
    )
    console.log(updateChatSession, 'success update')
    return updateChatSession
  }
  catch(e){
    console.log(e)
    throw createError({
      statusCode: 400,
      message: 'Update Error'
    })
  }

})