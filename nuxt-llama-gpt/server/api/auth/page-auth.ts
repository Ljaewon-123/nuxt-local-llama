import { LoginSessionInvailed } from "~~/server/common/http-code/login-session-invailed"

export default defineEventHandler( async event => {
  
  const config = useRuntimeConfig(event)

  const session = await PageAuth.createSession(event)

  if(!session.id) throw 'User not login'

  const verification = await PageAuth.verification(session.id)

  if (!verification) {
    console.log(" rejected 띄우기전!!@!@", session, "verify",verification)
    throw createError(new LoginSessionInvailed)
  }

  // 갱신
  await PageAuth.refreshSession(session as any)

})