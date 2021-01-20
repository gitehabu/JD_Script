//此处填写京东账号cookie。
//注：github action用户cookie填写到Settings-Secrets里面，新增JD_COOKIE，多个账号的cookie使用`&`隔开或者换行
let CookieJDs = [
    'pt_pin=jd_50c7c7245aa0d;pt_key=AAJgB_DDADDM93TVurZTXLkl3cQVX9RjJtD1BzQ-_-wb5fuQ19l7uBcmmqRUSIIXTeKykfJIRKE;',  // ZL
    'pt_pin=jd_55c7e48b4e383;pt_key=AAJf9nW0ADDuiLP2DAgVUUqm-h9UxHwYP0kODAHzb6VYkmeTh-Kk3Kht01usD_A6Rf75U-Dfoqo;',  // FF
    'pt_pin=jd_gHaaNzkPDUEX;pt_key=AAJf-aNIADBv7xZW45EZDJt6UFtmAjsRT34_rQtzKI4YdWy_fhdBR_WQZBxG8Xr9HYrrc4vCdRk;',   // WZ
    'pt_pin=jd_6118be1810ae2;pt_key=AAJf_q0FADBGG3zjBt-_rfoejZqz6Uks5MVdBFQrsk_NmqJdidQtRKsqfDiyfDdO6H_-kQHKXPg;',  // WZMAMA
    'pt_pin=jd_ZoKhGsiVmSQB;pt_key=AAJf9vykADBnUYmww3UVhQsSxf2JbAEZVPYwaBmCK5ZdEpMiJeifE-gehvxszZ-n31u78Z4j_oM;',   // BA
    'pt_pin=jd_768bda175d69f;pt_key=AAJf9m4TADDJvi43mdRng1RlEDDbL4YURwLJc0mKrhDvYg0nyEV0tKukSsSdhsCdXoeLh3Njkzg;',  // MA
    'pt_pin=18316696145_p;pt_key=AAJf9m6aADDg4-15GtgMkSX8BkIP4VVueVxH6LfFBuCkT3l3XxpWw44F8-j3x9KhJsqxO5uuH-Y;',     // zZ
    'pt_pin=jd_51f8ec4809c0f;pt_key=AAJf9m8bADCv6YqWIcoJCVWFX2HFvNstLDSPLP--H71ipT82WGCyPYXt8zzECE_3nUqeT0N-obI;',  // D
]

// 判断github action里面是否有京东ck
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
