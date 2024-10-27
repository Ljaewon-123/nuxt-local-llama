import ChatSessionModel from "~~/server/models/ChatSession"

export default defineEventHandler( async(event) => {

  const body = await readBody(event)
  console.log(body)

  // try{
  //   await ChatSessionModel.updateOne({ _id: body.id })
  //   return true
  // }
  // catch(e){
  //   console.log(e)
  //   return false
  // }

})