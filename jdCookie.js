//此处填写京东账号cookie。
//注：github action用户cookie填写到Settings-Secrets里面，新增JD_COOKIE，多个账号的cookie使用`&`隔开或者换行
let CookieJDs = [
    'pt_pin=jd_50c7c7245aa0d;pt_key=AAJgB_DDADDM93TVurZTXLkl3cQVX9RjJtD1BzQ-_-wb5fuQ19l7uBcmmqRUSIIXTeKykfJIRKE;',  // ZL
    'pt_pin=jd_55c7e48b4e383;pt_key=AAJf9nW0ADDuiLP2DAgVUUqm-h9UxHwYP0kODAHzb6VYkmeTh-Kk3Kht01usD_A6Rf75U-Dfoqo;',  // FF
    'pt_pin=jd_gHaaNzkPDUEX;pt_key=AAJgHPVYADCTkS4pdxh4weNnyy8NYG6Ogvez58BTq-QTINlkLbF4PNcORPTMFqQ2GZIqZg7pArI;',   // WZ
    'pt_pin=jd_41284b5930d4c;pt_key=AAJgHPRNADAp0LZy1kjvnyN2cj1HLlZnqVsj9K90EsuA0gI68ST9dYNjhiTsYe_H7K9DTCNF1BI;',  // TT
    'pt_pin=jd_6118be1810ae2;pt_key=AAJf_q0FADBGG3zjBt-_rfoejZqz6Uks5MVdBFQrsk_NmqJdidQtRKsqfDiyfDdO6H_-kQHKXPg;',  // WZMAMA
    'pt_pin=jd_ZoKhGsiVmSQB;pt_key=AAJf9vykADBnUYmww3UVhQsSxf2JbAEZVPYwaBmCK5ZdEpMiJeifE-gehvxszZ-n31u78Z4j_oM;',   // BA
    'pt_pin=jd_51f8ec4809c0f;pt_key=AAJgHPdhADCxQKdUGh82UFpJfUCl9zjeQUizkBcg7VusI4HWt_Np45wuUTwRt5xIwObQeDtmSBk;',  // D
    'pt_pin=jd_768bda175d69f;pt_key=AAJf9m4TADDJvi43mdRng1RlEDDbL4YURwLJc0mKrhDvYg0nyEV0tKukSsSdhsCdXoeLh3Njkzg;',  // MA
    'pt_pin=18316696145_p;pt_key=AAJgHPamADBZ3fVmU7ygN3N3gUa0QEA28o1k8m_mVl_IRsoooh-q4i_Uedd6uNKbX8p1pEDqBUw;',     // zZ
]

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
  console.log(`======================================== ${msg}，共有 ${CookieJDs.length} 个京东账号 Cookie ========================================\n`);
  // console.log(`\n==================脚本执行来自 github action=====================\n`)
}

console.log(`======================================== 脚本执行 - 北京时间(UTC+8)：${new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000).toLocaleString()} ========================================\n`)

for (let i = 0; i < CookieJDs.length; i++) {
  const index = (i + 1 === 1) ? '' : (i + 1);
  exports['CookieJD' + index] = CookieJDs[i];
}
