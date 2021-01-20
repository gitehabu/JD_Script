/*
东东萌宠互助码
此文件为Node.js专用。其他用户请忽略
支持京东N个账号
 */
//云服务器腾讯云函数等NOde.js用户在此处填写东东萌宠的好友码。
// github action用户的好友互助码填写到Action->Settings->Secrets->new Secret里面(Name填写 PetShareCodes(此处的Name必须按此来写,不能随意更改),内容处填写互助码,填写规则如下)
// 同一个京东账号的好友互助码用@符号隔开,不同京东账号之间用&符号或者换行隔开,下面给一个示例
// 如: 京东账号1的shareCode1@京东账号1的shareCode2&京东账号2的shareCode1@京东账号2的shareCode2
let PetShareCodes = []

// 判断github action里面是否有东东萌宠互助码
if (process.env.PETSHARECODES) {
  if (process.env.PETSHARECODES.indexOf('&') > -1) {
    console.log(`您的东东萌宠互助码选择的是用&隔开\n`)
    PetShareCodes = process.env.PETSHARECODES.split('&');
  } else if (process.env.PETSHARECODES.indexOf('\n') > -1) {
    console.log(`您的东东萌宠互助码选择的是用换行隔开\n`)
    PetShareCodes = process.env.PETSHARECODES.split('\n');
  } else {
    PetShareCodes = process.env.PETSHARECODES.split();
  }
} else if (process.env.JD_COOKIE) {
  console.log(`由于 Github Secret 里面未提供助力码，故此处运行将会给脚本内置的码进行助力，请知晓！`)
}

for (let i = 0; i < PetShareCodes.length; i++) {
  const index = (i + 1 === 1) ? '' : (i + 1);
  exports['PetShareCode' + index] = PetShareCodes[i];
}


let hy = {
    '_zZ': {
        nickName: '',
        shareCode: 'MTAxODc2NTEzMTAwMDAwMDAwNTczNjI3Nw=='
    },
    '_D': {
        nickName: '',
        shareCode: 'MTEzMzI0OTE0NTAwMDAwMDAzNDU3MjIwNw=='
    },
    '_MA': {
        nickName: '',
        shareCode: 'MTAxODc2NTEzMjAwMDAwMDAxMjg2NzEyMw=='
    },
    '_BA': {
        nickName: '',
        shareCode: 'MTAxODc2NTEzOTAwMDAwMDAzMTg0NzE1MQ=='
    },
    '_WZ': {
        nickName: '',
        shareCode: 'MTAxODc2NTEzNDAwMDAwMDAzMTQyMDUwMQ=='
    },
    '_WZMAMA': {
        nickName: '',
        shareCode: 'MTAxODc2NTEzOTAwMDAwMDAzMzM4NjQ2Nw=='
    },
    '_FF': {
        nickName: '',
        shareCode: 'MTAxODc2NTEzMTAwMDAwMDAxOTU2MTU1NQ=='
    },
    '_ZL': {
        nickName: '泽',
        shareCode: 'MTAxODcxOTI2NTAwMDAwMDAwMzAwNjk3NQ=='
    },
    '_ZQ': {
        nickName: '泽Q',
        shareCode: 'MTAxODc2NTEzMTAwMDAwMDAxODk4MTIyNQ=='
    },
    '_AIE': {
        nickName: 'AIE',
        shareCode: 'MTAxODc2NTEzOTAwMDAwMDAwNDk2MjUxNg=='
    }
}

// let arr = [
//     `${hy._zZ.shareCode}@${hy._MA.shareCode}@${hy._D.shareCode}@${hy._BA.shareCode}`,                           // _FF
//     `${hy._zZ.shareCode}@${hy._MA.shareCode}@${hy._WZMAMA.shareCode}@${hy._D.shareCode}@${hy._BA.shareCode}`,   // _WZ
//     `${hy._WZ.shareCode}@${hy._MA.shareCode}`,                                                                  // _WZMAMA
//     `${hy._zZ.shareCode}@${hy._MA.shareCode}@${hy._D.shareCode}@${hy._WZ.shareCode}`,                           // _BA
//     `${hy._zZ.shareCode}@${hy._MA.shareCode}@${hy._BA.shareCode}@${hy._WZ.shareCode}`,                          // _D
//     `${hy._MA.shareCode}@${hy._FF.shareCode}@${hy._WZ.shareCode}@${hy._ZL.shareCode}@${hy._D.shareCode}@${hy._BA.shareCode}`,           // _zZ
//     `${hy._D.shareCode}@${hy._BA.shareCode}@${hy._FF.shareCode}@${hy._WZ.shareCode}@${hy._WZMAMA.shareCode}`,                           // _MA
// ]

let helpArr = {
    '_ZL':      [hy._zZ.shareCode, hy._MA.shareCode, hy._ZQ.shareCode, hy._AIE.shareCode],
    '_FF':      [hy._zZ.shareCode, hy._MA.shareCode, hy._D.shareCode, hy._BA.shareCode, hy._WZMAMA.shareCode],
    '_WZ':      [hy._zZ.shareCode, hy._MA.shareCode, hy._D.shareCode, hy._BA.shareCode, hy._WZMAMA.shareCode],
    '_WZMAMA':  [hy._zZ.shareCode, hy._MA.shareCode, hy._D.shareCode, hy._BA.shareCode, hy._WZ.shareCode],
    '_BA':      [hy._zZ.shareCode, hy._MA.shareCode, hy._D.shareCode, hy._WZ.shareCode, hy._WZMAMA.shareCode],
    '_D':       [hy._zZ.shareCode, hy._MA.shareCode, hy._BA.shareCode, hy._WZ.shareCode, hy._ZL.shareCode],
    '_MA':      [hy._zZ.shareCode, hy._ZL.shareCode, hy._D.shareCode, hy._FF.shareCode, hy._WZ.shareCode, hy._WZMAMA.shareCode],
    '_zZ':      [hy._ZL.shareCode, hy._MA.shareCode, hy._D.shareCode, hy._BA.shareCode, hy._WZ.shareCode, hy._FF.shareCode, hy._WZMAMA.shareCode],
}

exports.hy = function (helpFriends, curNickName, curShareCode) {
    let curName = null
    for (let key in hy){
        if (hy[key].shareCode === curShareCode) {
            curName = key
            break
        }
    }
    let format = function(fmt, date){
        fmt = fmt ||  "yyyy-MM-dd HH:mm:ss";
        if(typeof date === 'string') date = new Date(date.replace(/-/g,'/'));
        if(typeof date === 'number') date = new Date(date);
        date = date || new Date();

        let o = {
            "M+": date.getMonth() + 1,                                  // 月份
            "d+": date.getDate(),                                       // 日
            "H+": date.getHours(),                                      // 24小时制
            "h+": date.getHours()%12 === 0 ? 12 : date.getHours()%12,   // 12小时制
            "m+": date.getMinutes(),                                    // 分
            "s+": date.getSeconds(),                                    // 秒
            "q+": Math.floor((date.getMonth() + 3) / 3),                // 季度
            "S": date.getMilliseconds()                                 // 毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k])
                    : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
    let nowTime = format("HH:mm:ss", new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000)
    console.log('=> test: ', nowTime, nowTime > format("21:00:00"), helpFriends.indexOf(hy._ZL.nickName), helpFriends, curNickName, curShareCode)

    // if (curShareCode === hy._MA.shareCode) {
    //     if (helpFriends.indexOf(hy._ZL.nickName) > -1) {
    //         arr[5] += `@${hy._ZL.shareCode}`
    //     } else if ((helpFriends.indexOf(hy._ZL.nickName) < 0) && (nowTime > format("21:00:00"))){ // 超过设定时间
    //         arr[5] += `@${hy._zZ.shareCode}`
    //     }
    // }

    // if (curShareCode === hy._zZ.shareCode) {
    //     if (helpFriends.indexOf(hy._ZL.nickName) > -1) {
    //         arr[4] += `@${hy._ZL.shareCode}`
    //     } else if ((helpFriends.indexOf(hy._ZL.nickName) < 0) && (nowTime > format("21:00:00"))){
    //         arr[4] += `@${hy._MA.shareCode}`
    //     }
    // }


    if ((curShareCode === hy._D.shareCode) && (nowTime > format("17:00:00"))) {
        helpArr['_D'].push(hy._zZ.shareCode)
    }

    // if ((curShareCode === hy._zZ.shareCode) && (nowTime > format("11:00:00"))) {
    //     helpArr['_zZ'].push(hy._MA.shareCode, hy._ZL.shareCode, hy._D.shareCode, hy._BA.shareCode)
    // }

    return helpArr[curName]
}