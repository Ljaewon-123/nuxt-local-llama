import PageAuth from "~~/server/utils/PageAuth";
import { useRedis } from "~~/server/utils/useRedis";

export default defineEventHandler( async event => {
  
  const config = useRuntimeConfig(event)

  const session = await useSession(event, {
    password: "80d42cfb-1cd2-462c-8f17-e3237d9027e9",
  });

  if(!session.id) throw 'User not log in'

  const verification = await PageAuth.verification(session.id)

  if (!verification) {
    throw new Error('Page Rejected');
  }

  // 갱신
  await PageAuth.refreshSession(session as any)

})