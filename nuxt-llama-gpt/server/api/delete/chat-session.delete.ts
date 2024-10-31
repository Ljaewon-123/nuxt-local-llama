import ChatSessionModel from "~~/server/models/ChatSession"

export default defineEventHandler( async(event) => {

  const body = await readBody(event)

  try{
    return await ChatSessionModel.findOneAndDelete({ _id: body.id })
  }
  catch(e){
    console.log(e)
    throw Error('Delete Error')
  }

})