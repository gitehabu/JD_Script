//此处填写京东账号cookie。
//注：github action用户cookie填写到Settings-Secrets里面，新增JD_COOKIE，多个账号的cookie使用`&`隔开或者换行
let CookieJDs = []

// 判断github action里面是否有京东ck
console.log(process.env.JD_COOKIE)
if (process.env.JD_COOKIE) {
  let msg = ''
  if (process.env.JD_COOKIE.indexOf('&') > -1) {
    msg = '您的cookie选择的是用&隔开'
    CookieJDs = process.env.JD_COOKIE.split('&');
  } else if (process.env.JD_COOKIE.indexOf('\n') > -1) {
    msg = '您的cookie选择的是用换行隔开'
    CookieJDs = process.env.JD_COOKIE.split('\n');
  } else {
    CookieJDs = process.env.JD_COOKIE.split();
  }
  console.log(`======================================== ${msg}，共有 ${CookieJDs.length-1} 个京东账号 Cookie ========================================\n`);
  // console.log(`\n==================脚本执行来自 github action=====================\n`)
}

console.log(`======================================== 脚本执行 - 北京时间(UTC+8)：${new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000).toLocaleString()} ========================================\n`)

for (let i = 0; i < CookieJDs.length; i++) {
  const index = (i + 1 === 1) ? '' : (i + 1);
  exports['CookieJD' + index] = CookieJDs[i];
}
