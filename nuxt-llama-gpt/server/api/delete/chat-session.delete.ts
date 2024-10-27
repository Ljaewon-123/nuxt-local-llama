import ChatSessionModel from "~~/server/models/ChatSession"

export default defineEventHandler( async(event) => {

  const body = await readBody(event)

  try{
    await ChatSessionModel.deleteOne({ _id: body.id })
    return true
  }
  catch(e){
    console.log(e)
    return false
  }

})