import { io, Socket } from "socket.io-client";

export const useSocket = defineStore('socket', () => {

  const $socket = ref<Socket>()
  // id로? 
  const connectSocket = (email:string) => {
    $socket.value = io({
      query: { roomName: email }
    });
  }

  return {
    connectSocket,
    $socket
  }
})
