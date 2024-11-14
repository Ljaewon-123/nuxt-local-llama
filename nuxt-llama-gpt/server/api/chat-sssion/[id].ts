import ChatSessionModel from "~~/server/models/ChatSession"

export default defineEventHandler( async(event) => {
  const params = getRouterParams(event)
  console.log( params, 'inner server')

  //_id가 유닉이랑 필요없을거 같은데
  // const currentSession = await PageAuth.getCurrentSession(event)

  try{
    const chat = await ChatSessionModel.findOne({ _id: params.id }).populate('histories')
    return { histories: chat?.histories, title: chat?.title }
  }
  catch(e){
    console.log(e)
  }

})