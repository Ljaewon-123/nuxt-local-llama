import { CustomHttpCode } from "~/common/custom-http-code";

export class LoginSessionInvailed {
  statusCode: number = CustomHttpCode.LoginSessionInvailed;
  statusMessage: string = 'Login Session Invailed';
  message: string = 'Login Session Invailed';

  constructor() {
    return {
      statusCode: this.statusCode,
      statusMessage: this.statusMessage,
      message: this.message
    };
  }
}
