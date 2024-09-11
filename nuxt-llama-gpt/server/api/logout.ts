export default defineEventHandler( async(event) => {

  const session = await PageAuth.createSession(event)

  const redis = useRedis()

  if(!session.id) throw 'session keys miss'

  redis.removeItem(session.id)


})