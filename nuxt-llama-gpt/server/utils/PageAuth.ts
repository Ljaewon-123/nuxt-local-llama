import { AuthSession } from "../api/types/session.type";
import { LoginSessionInvailed } from "../common/http-code/login-session-invailed";
import sessionTtl from "../constant/session-ttl";

interface Session {
  id: string ,
  data: object 
}
const isProd = process.env.NODE_ENV === "production";
export class PageAuth {
  private redis = useRedis()

  async createSession(event: any ){
    /** 보안 강화 하려면 password env로 */
    return await useSession(event, {
      password: "80d42cfb-1cd2-462c-8f17-e3237d9027e9",
      cookie: {
        sameSite: isProd ? "strict" : false, // 개발: false, 배포: Lax
        secure: false, // https일때 이거 켜줌: isProd,                  // 배포: true, 개발: false
        httpOnly: isProd,                // 배포: true
      },
    });
  }

  async verification(sessionId: string){
    return await this.redis.getItem(sessionId) // has가 안된다.... 
  }

    /** The function is the same as the [verification] function */
    async getSession(sessionId: string){
      return await this.redis.getItem(sessionId) // equal verification function
    }
  
  /** 
   * Session ttl initialization use setItem 
   * @warning Be careful when using it because it is virtually the same setItem.
   */
  async refreshSession(session: Session){
    await this.redis.setItem(session.id, session, sessionTtl) 
  }

  /** Get a session that has completed exception handling and type inference */
  async getCurrentSession(event: any): Promise<AuthSession> {
    const authSession = await this.createSession(event)
    
    if (!authSession.id) {
      throw createError(new LoginSessionInvailed());
    }
  
    const redis = useRedis();
    const currentSession = await redis.getItem<AuthSession>(authSession.id);
    
    if (!currentSession) {
      throw createError(new LoginSessionInvailed());
    }
  
    return currentSession;
  }

}

export default new PageAuth()