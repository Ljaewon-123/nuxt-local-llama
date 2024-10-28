// import { getRequestURL, sendRedirect } from "h3";

export default defineEventHandler(async(event) => {
  const url = getRequestURL(event);
  // console.log('hi?@@@@@@@@@@@@@@@@@@', url)
  // return await sendRedirect(event, "/login");
});

// socketio 쪽도 다 해버려서 버그 위험성이 높은거 같다 

// 모든요청전후에 세션확인???????
// 인터셉터쓰면 될거같기는 한데 필요한건가???
// websocket도 확을 하기는 해야함