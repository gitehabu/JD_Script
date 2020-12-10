//此处填写京东账号cookie。
//注：github action用户cookie填写到Settings-Secrets里面，新增JD_COOKIE，多个账号的cookie使用`&`隔开或者换行
let CookieJDs = [
    'pt_pin=jd_55c7e48b4e383;pt_key=AAJf0H5fADBFUYxsC_5HwAqhRh12fSkXUgeNOvvlhu95Iz4T8N_7_BfjKFuB9gE99q0Nw78-L9A;',  // FF
    'pt_pin=jd_gHaaNzkPDUEX;pt_key=AAJf0LWGADCizuf-BaTDnpmtKDkuaXyedXfcON3OBMqMzX04w-lZLdXtqJqogjjNRWASr2iOWm4;',   // WZ
    'pt_pin=jd_ZoKhGsiVmSQB;pt_key=AAJfzhzTADAGkrd7-49e11CEO_LMnMxo8y3GvKta6xC_-7L6vMTQd_2oMGIfTkrNxGagGxDBhXU;',   // BA
    'pt_pin=jd_51f8ec4809c0f;pt_key=AAJfzg61ADBxh9Io7h644BCa7RA2-a1aoDsC1Y60U1Q5Lk0s0H15lzWqRNcWk10ChiG8ENa16p8;',  // D
    'pt_pin=18316696145_p;pt_key=AAJfzg4dADAfbKNFrA8UnvOclNwVcBG1CCNffrGXLUH1hx9RZ2JlvAiM7WHeGMb81cbF6F6Z2-I;',     // zZ
    'pt_pin=jd_768bda175d69f;pt_key=AAJfzg-AADCesVJFw90UOupjmq6Lm2bEzzO2yvMFKztk60GtScjLQfD-TdcMRfg1miXRBPyv144;',  // MA
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
