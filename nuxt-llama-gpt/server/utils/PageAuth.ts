export class PageAuth {
  // private session: any // type정의가 안되네;;
  private redis = useRedis()
  // constructor(session: any) {
  //   this.session = session
  // }
  
  // session = await useSession(event, {
  //   password: "80d42cfb-1cd2-462c-8f17-e3237d9027e9",
  // });
  async verification(sessionId: string){
    return await this.redis.getItem(sessionId)
  }
  
  async refreshSession(session: { id: string , data: Object }){
    await this.redis.setItem(session.id, session, { ttl: 60 * 15 })
  }

}
// 생성자가 없으면 이런식으로 활용이 가능하다
export default new PageAuth()