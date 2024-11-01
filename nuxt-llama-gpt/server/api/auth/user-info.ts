export default defineEventHandler( async event => {
  
  const session = await PageAuth.createSession(event)

  if(!session.id) throw 'User not login'

  const currentSession = await PageAuth.getCurrentSession(event)

  return currentSession.data
})