import UsersModel from "~~/server/models/Users"
import CryptoJS from "crypto-js";

export default defineEventHandler( async(event) => {

  const body = await readBody(event)
  const config = useRuntimeConfig()

  const user = await UsersModel.findOne({
    email: body.email,
  })

  if (!user) {
    throw Error('User not found')
  }

  const decryptedText = CryptoInfo.decryptStr(body.password)
  const mongoPassword = CryptoInfo.decryptStr(user.password)
  // const decryptedBodyPass = CryptoJS.AES.decrypt(body.password, key);
  // const decryptedDB = CryptoJS.AES.decrypt(user.password, key);
  // const decryptedText = decryptedBodyPass.toString(CryptoJS.enc.Utf8);
  // const mongoPassword = decryptedDB.toString(CryptoJS.enc.Utf8);

  if(decryptedText != mongoPassword){
    throw Error('Password miss match')
  }

  const session = await PageAuth.createSession(event)
  await session.update({
    email: user.email,
    userName: user.userName
  });
  const redis = useRedis()
  await redis.setItem(session.id ?? 'null', session, { ttl: 60 * 15 })

  return true

})