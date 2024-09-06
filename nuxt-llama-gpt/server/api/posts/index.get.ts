import postModel from "~~/server/models/post"

export default defineEventHandler( async(event) => {
  try{
    const result = await postModel.find()
    return result
  }
  catch(e){
    console.error(e)
  }
})