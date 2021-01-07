/*
水果互助码
此文件为Node.js专用。其他用户请忽略
支持京东N个账号
 */
//云服务器腾讯云函数等NOde.js用户在此处填写京东东农场的好友码。
// github action用户的好友互助码填写到Action->Settings->Secrets->new Secret里面(Name填写 FruitShareCodes(此处的Name必须按此来写,不能随意更改),内容处填写互助码,填写规则如下)
// 同一个京东账号的好友互助码用@符号隔开,不同京东账号之间用&符号或者换行隔开,下面给一个示例
// 如: 京东账号1的shareCode1@京东账号1的shareCode2&京东账号2的shareCode1@京东账号2的shareCode2
let FruitShareCodes = [
    '',//账号一的好友shareCode,不同好友中间用@符号隔开
    '',//账号二的好友shareCode，不同好友中间用@符号隔开
]

// 判断github action里面是否有水果互助码
if (process.env.FRUITSHARECODES) {
  if (process.env.FRUITSHARECODES.indexOf('&') > -1) {
    console.log(`您的东东农场互助码选择的是用&隔开\n`)
    FruitShareCodes = process.env.FRUITSHARECODES.split('&');
  } else if (process.env.FRUITSHARECODES.indexOf('\n') > -1) {
    console.log(`您的东东农场互助码选择的是用换行隔开\n`)
    FruitShareCodes = process.env.FRUITSHARECODES.split('\n');
  } else {
    FruitShareCodes = process.env.FRUITSHARECODES.split();
  }
} else if (process.env.JD_COOKIE) {
  console.log(`由于您secret里面未提供助力码，故此处运行将会给脚本内置的码进行助力，请知晓！`)
}

for (let i = 0; i < FruitShareCodes.length; i++) {
  const index = (i + 1 === 1) ? '' : (i + 1);
  // exports['FruitShareCode' + index] = FruitShareCodes[i];
}




let hy = {
    '_zZ': {
        nickName: '',
        shareCode: '6e74c86a47f84db5832b33c76fbe32a8'
    },
    '_D': {
        nickName: '',
        shareCode: '33819377bfd44628b3fe7607fb5ea090'
    },
    '_MA': {
        nickName: '',
        shareCode: '597f1a10a91b473ab89f03cafa88a9a4'
    },
    '_BA': {
        nickName: '',
        shareCode: 'b0f5d0c06eb74dc39d62b336264df3fe'
    },
    '_WZ': {
        nickName: '',
        shareCode: 'b6b55daa037c4eacac258b717b36aea2'
    },
    '_FF': {
        nickName: '',
        shareCode: '289f2cb96f284588a8f3b33f0d023bf0'
    },
    '_ZL': {
        nickName: '泽',
        shareCode: '2e504781a7f049ce850554ef685511b6'
    },
    '_AiE': {
        nickName: 'ai娥',
        shareCode: '48a0dd9e2c41427eb2273160804b592b'
    },
    '_WZMAMA': {
        nickName: '',
        shareCode: '10908d829ca944e997200a0d8209783c'
    }
}
let helpArr = {
    '_FF': [hy._zZ.shareCode, hy._D.shareCode, hy._BA.shareCode, hy._MA.shareCode],
    '_WZ': [hy._zZ.shareCode, hy._D.shareCode, hy._MA.shareCode, hy._WZMAMA.shareCode],
    '_BA': [hy._zZ.shareCode, hy._D.shareCode, hy._MA.shareCode, hy._WZ.shareCode],
    '_D': [hy._zZ.shareCode, hy._BA.shareCode, hy._MA.shareCode, hy._WZ.shareCode],
    '_zZ': [hy._D.shareCode, hy._BA.shareCode, hy._FF.shareCode, hy._ZL.shareCode],
    '_MA': [hy._D.shareCode, hy._FF.shareCode, hy._WZ.shareCode],
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

    console.log('=> test: ', curName, curNickName, nowTime, nowTime > format("21:00:00"), helpFriends.indexOf(hy._AiE.nickName), helpFriends.indexOf(hy._ZL.nickName), helpFriends, curShareCode)


    if (curShareCode === hy._MA.shareCode) {
        if (helpFriends.indexOf(hy._AiE.nickName) > -1) {
            helpArr._MA[helpArr._MA.length] = hy._AiE.shareCode
        } else if (helpFriends.indexOf(hy._ZL.nickName) > -1) {
            helpArr._MA[helpArr._MA.length] = hy._ZL.shareCode
        } else if ((helpFriends.indexOf(hy._AiE.nickName) < 0) && (nowTime > format("18:00:00"))){ // 超过设定时间
            helpArr._MA[helpArr._MA.length] = hy._AiE.shareCode
        }
    }

    /**
    if (curShareCode === hy._zZ.shareCode) {
        if (helpFriends.indexOf(hy._ZL.nickName) > -1) {
            helpArr._zZ[helpArr._zZ.length] = hy._ZL.shareCode
        } else if ((helpFriends.indexOf(hy._ZL.nickName) < 0) && (nowTime > format("21:00:00"))){
            helpArr._zZ[helpArr._zZ.length] = hy._MA.shareCode
        }
    }
     */

    return helpArr[curName]
}