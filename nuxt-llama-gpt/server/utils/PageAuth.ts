export class PageAuth {
  private redis = useRedis()

  async verification(sessionId: string){
    return await this.redis.getItem(sessionId)
  }
  
  async refreshSession(session: { id: string , data: Object }){
    await this.redis.setItem(session.id, session, { ttl: 60 * 15 })
  }

}
// 생성자가 없으면 이런식으로 활용이 가능하다
export default new PageAuth()