import CryptoJS from "crypto-js";

class CryptoInfo {
  private config = useRuntimeConfig()
  private key = this.createKey()

  createKey(){
    return CryptoJS.SHA256(this.config.public.encryptionKey).toString(CryptoJS.enc.Hex);
  }

  encryptStr(str?: string){
    if(!str) return 
    return CryptoJS.AES.encrypt(str, this.key).toString() 
  }

  decryptStr(strInfo: string){
    const decrypted = CryptoJS.AES.decrypt(strInfo, this.key);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

}

export default new CryptoInfo()