import { io } from "~~/server/plugins/socket.io"

export default defineEventHandler(async(event) => {
  console.log('operaion here??')
  // io.serverSideEmit("test", (err:any , responses:any ) => {
  //   console.log(responses[0]); // prints "pong"
  // });
  
  // 통하지 않고 한번에 보낼수있다.
  io.emit('test','hi')
  // clientSocket.emit('test', 'client')
})