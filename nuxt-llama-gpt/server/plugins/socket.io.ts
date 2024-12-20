import type { NitroApp } from "nitropack";
import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";

// 이거는 서버켜질때 붙이는게 맞는거같은데
const engine = new Engine();
export const io = new Server();
export default defineNitroPlugin((nitroApp: NitroApp) => {
  
  io.bind(engine);
  
  io.on("connection", (socket) => {
    // your code...
    console.log(socket.handshake.query.roomName)
    io.socketsJoin(socket.handshake.query.roomName as string)

    socket.on("ping", (cb) => {
      cb("pong");
    });

    socket.on('test', mess => {
      console.log(mess,' test socket io in server')
    })

    socket.on('message', mess => {
      socket.emit("llama", mess)
    })


    console.log('connection socket io')
  });

  nitroApp.router.use("/socket.io/", defineEventHandler({
    handler(event) {
      engine.handleRequest(event.node.req as any, event.node.res);
      event._handled = true;
    },
    websocket: {
      open(peer) {
        const nodeContext = peer.ctx.node;
        const req = nodeContext.req;

        // @ts-expect-error private method
        engine.prepare(req);

        const rawSocket = nodeContext.req.socket;
        const websocket = nodeContext.ws;

        // @ts-expect-error private method
        engine.onWebSocket(req, rawSocket, websocket);
      }
    }
  }));
});