export default defineEventHandler( async event => {
  const config = useRuntimeConfig(event)

  // 듀토 코드 일단 가져와봄 
  // await useStorage('redis').setItem('foo:world', { hello: 'world' },{ ttl: 30 })
  // await useStorage('redis').setItem('foo:world', { hello: 'world' })
  // const redis = await useStorage('redis').getItem('foo:world')
  // await useStorage('data').setItem('foo', { hello: 'world' }) // 파일 시스템에 쓰기 만료기간 때문에 redis선호 

  // const session = await useSession(event, {
  //   password: "80d42cfb-1cd2-462c-8f17-e3237d9027e9",
  // });
  // const count = (session.data.count || 0) + 1;
  // await session.update({
  //   count: count,
  // });
  // // await session.clear();

  // console.log('@!!!!!!!!!!!!!!!!!!!!!!@')
  // console.log(session, 'session')
  // console.log(session.id , 'id')
  // console.log(session.data , 'data')
  // console.log('@!!!!!!!!!!!!!!!!!!!!!!@')

})