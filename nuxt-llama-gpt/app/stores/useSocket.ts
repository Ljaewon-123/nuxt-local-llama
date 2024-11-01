import { io } from "socket.io-client";

export const useSocket = defineStore('socket', () => {

  const socket = ref()
  // id로? 
  const connectSocket = (email:string) => {
    socket.value = io({
      query: { roomName: email }
    });
  }

  return {
    connectSocket,
    socket
  }
})
