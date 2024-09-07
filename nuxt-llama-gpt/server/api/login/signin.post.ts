import UsersModel from "~~/server/models/Users"

export default defineEventHandler( async(event) => {

  const body = await readBody(event)

  const user = await UsersModel.findOne({
    email: body.email,
  })

  if (!user) {
    throw Error('User not found')
  }

  if(body.password != user.password){
    throw Error('Password miss match')
  }

  return sendRedirect(event, '/', 302)

})