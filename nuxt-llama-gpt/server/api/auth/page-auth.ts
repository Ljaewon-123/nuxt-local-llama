export default defineEventHandler( async event => {
  
  const config = useRuntimeConfig(event)

  const session = await PageAuth.createSession(event)

  if(!session.id) throw 'User not log in'

  const verification = await PageAuth.verification(session.id)

  if (!verification) {
    throw createError({
      statusCode: 498,
      message: 'Page Rejected'
    })
  }

  // 갱신
  await PageAuth.refreshSession(session as any)

})