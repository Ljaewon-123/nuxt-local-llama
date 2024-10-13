export default defineEventHandler(async(event) => {

  const a = await sendRedirect(event, '/login', 307);
  console.log(a,'@@?')
})
// get일때 작동한다