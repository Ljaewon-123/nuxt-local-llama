import sessionTtl from "../constant/session-ttl";

export class PageAuth {
  private redis = useRedis()

  async createSession(event: any ){
    return await useSession(event, {
      password: "80d42cfb-1cd2-462c-8f17-e3237d9027e9",
    });
  }

  async verification(sessionId: string){
    return await this.redis.getItem(sessionId)
  }
  
  // test용으로 15분정도 설정 
  async refreshSession(session: { id: string , data: Object }){
    await this.redis.setItem(session.id, session, sessionTtl) 
  }

}
// 생성자가 없으면 이런식으로 활용이 가능하다
export default new PageAuth()