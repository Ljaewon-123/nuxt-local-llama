export default [
  (v:string) => {
    if(!v) return 'You must enter value.'
    return true
  }
]


// 배열말고 객체만??? 여러 룰을 조합할수도 있는데