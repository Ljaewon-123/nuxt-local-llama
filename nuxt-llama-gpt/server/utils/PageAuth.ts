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
    return await useSession(event, {
      password: "80d42cfb-1cd2-462c-8f17-e3237d9027e9",
      cookie: {
        sameSite: isProd ? "strict" : false, // 개발: false, 배포: Lax
        secure: isProd,                  // 배포: true, 개발: false
        httpOnly: isProd,                // 배포: true
      },
    });
  }

  async verification(sessionId: string){
    return await this.redis.getItem(sessionId)
  }
  
  async refreshSession(session: Session){
    await this.redis.setItem(session.id, session, sessionTtl) 
  }

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
// 생성자가 없으면 이런식으로 활용이 가능하다
export default new PageAuth()