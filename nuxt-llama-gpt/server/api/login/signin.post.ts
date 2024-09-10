import UsersModel from "~~/server/models/Users"
import CryptoJS from "crypto-js";

export default defineEventHandler( async(event) => {

  const body = await readBody(event)
  const config = useRuntimeConfig()
  const key = CryptoJS.SHA256(config.public.encryptionKey).toString(CryptoJS.enc.Hex);

  const user = await UsersModel.findOne({
    email: body.email,
  })

  if (!user) {
    throw Error('User not found')
  }

  const decryptedBodyPass = CryptoJS.AES.decrypt(body.password, key);
  const decryptedDB = CryptoJS.AES.decrypt(user.password, key);
  const decryptedText = decryptedBodyPass.toString(CryptoJS.enc.Utf8);
  const mongoPassword = decryptedDB.toString(CryptoJS.enc.Utf8);

  if(decryptedText != mongoPassword){
    throw Error('Password miss match')
  }

  return true

})