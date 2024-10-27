export default defineEventHandler( async(event) => {

  const session = await PageAuth.createSession(event)

  const redis = useRedis()

  if(!session.id) throw Error('already logout')

  redis.clear(session.id)
  await session.clear()

  redis.removeItem(session?.id)

})