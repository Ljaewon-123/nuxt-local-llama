import { io } from "socket.io-client";

// 나쁜방법은 아닌데 로그인 페이지부터 socket에 붙여버린다... 삭제예정
//Socket Client
const socket = io();
export default defineNuxtPlugin(() => {
  return {
    provide: {
      socket : socket,
    },
  };
});