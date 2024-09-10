import UsersModel from "~~/server/models/Users"

export default defineEventHandler( async(event) => {

  const body = await readBody(event)
  try{
    const users = new UsersModel()
    users.email = body.email
    users.userName = body.userName
    users.password = body.password

    await users.validate()

    await users.save()
    console.log('success create')
  }
  catch (e:any){
    console.error('create account error', e)
    
    if(e.code === 11000){
      console.log('exist account error')
      throw createError({
        statusCode: 400,
        message: 'Already account exist',
      })
    }

    throw createError({
      statusCode: 500,
      message: 'create account error',
    })
  }

  return true
})