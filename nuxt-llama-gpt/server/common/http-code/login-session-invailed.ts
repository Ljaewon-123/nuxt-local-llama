class LoginSessionInvailed {
  statusCode: number = 580;
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
