import CryptoJS from "crypto-js";

export function useCrypto() {
  
  const config = useRuntimeConfig()
  const key = createKey()

  function createKey(){
    return CryptoJS.SHA256(config.public.encryptionKey).toString(CryptoJS.enc.Hex);
  }

  function encryptStr(str?: string){
    if(!str) return 
    return CryptoJS.AES.encrypt(str, key).toString() 
  }

  function decryptStr(strInfo: string){
    const decrypted = CryptoJS.AES.decrypt(strInfo, key);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  return { 
    encryptStr,
    decryptStr,
  }
}