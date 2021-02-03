/*
5G狂欢城
活动时间: 2021-1-30至2021-2-4
活动入口：暂无
活动地址：https://rdcseason.m.jd.com/
已支持IOS双京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#5G狂欢城
0 0,6,12,18 * * * https://gitee.com/lxk0301/jd_scripts/raw/master/jd_5g.js, tag=5G狂欢城, img-url=https://raw.githubusercontent.com/Orz-3/task/master/jd.png, enabled=true

================Loon==============
[Script]
cron "0 0,6,12,18 * * *" script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_5g.js, tag=5G狂欢城

===============Surge=================
5G狂欢城 = type=cron,cronexp="0 0,6,12,18 * * *",wake-system=1,timeout=3600,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_5g.js

============小火箭=========
5G狂欢城 = type=cron,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_5g.js, cronexpr="0 0,6,12,18 * * *", timeout=3600, enable=true
 */
const $ = new require('./Env.min').Env('5G狂欢城');

const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let jdNotify = true;//是否关闭通知，false打开通知推送，true关闭通知推送
const randomCount = $.isNode() ? 20 : 5;

//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  let cookiesData = $.getdata('CookiesJD') || "[]";
  cookiesData = jsonParse(cookiesData);
  cookiesArr = cookiesData.map(item => item.cookie);
  cookiesArr.reverse();
  cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
  cookiesArr.reverse();
  cookiesArr = cookiesArr.filter(item => item !== "" && item !== null && item !== undefined);
}
const JD_API_HOST = 'https://rdcseason.m.jd.com/api/';
const inviteCodes = [
  '',
  ''
];
!(async () => {
  await requireConfig();
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }

  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      await TotalBean();
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await shareCodesFormat();
      await jdFive()
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function jdFive() {
  try {
    $.beans = 0
    $.score = 0
    $.risk = false
    await getToday()
    if($.risk){
      message += '活动太火爆了，快去买买买吧\n'
      await showMsg()
      return
    }
    await getHelp()
    console.log(`去浏览会场`)
    await getMeetingList()
    console.log(`去浏览商品`)
    await getGoodList()
    console.log(`去浏览店铺`)
    await getShopList()
    await $.wait(10000);
    console.log(`去浏览会场`)
    await getMeetingList()
    console.log(`去浏览商品`)
    await getGoodList()
    console.log(`去浏览店铺`)
    await getShopList()
    console.log(`去帮助好友`)
    await helpFriends()
    await myRank();//领取往期排名奖励
    await getActInfo()
    await showMsg()
  } catch (e) {
    $.logErr(e)
  }
}

async function helpFriends() {
  for (let code of $.newShareCodes) {
    if (!code) continue
    await doHelp(code)
    await $.wait(2000)
  }
}

function showMsg() {
  return new Promise(resolve => {
    message += `本次运行获得${$.beans}京豆，${$.score}积分`
    if (!jdNotify) {
      $.msg($.name, '', `${message}`);
    } else {
      $.log(`京东账号${$.index}${$.nickName}\n${message}`);
    }
    resolve()
  })
}

function doHelp(id) {
  return new Promise((resolve) => {
    $.post(taskPostUrl('task/toHelp', `shareId=${id}`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data && data['code'] === 200) {
            console.log(`助力结果:${JSON.stringify(data)}`);
          } else {
            console.log(data)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
function getToday() {
  return new Promise((resolve) => {
    $.post(taskPostUrl('task/getPresetJingTie', "presentAmt=20"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data && data['code'] === 200) {
            console.log(data.data.rsMsg)
          } else {
            console.log(data.msg)
            if(data.code===1002){
              $.risk = true
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
function getActInfo() {
  return new Promise((resolve) => {
    $.get(taskUrl('task/findJingTie', ), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data && data['code'] === 200) {
            message += `用户当前积分：${data.data.integralNum}\n`
            console.log(`用户当前积分：${data.data.integralNum}`)
          } else {
            console.log(JSON.stringify(data))
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
function getMeetingList() {
  return new Promise((resolve) => {
    $.get(taskUrl('task/listMeeting'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data && data['code'] === 200) {
            for(let vo of data.data.meetingList){
              await browseMeeting(vo['id'])
              await getMeetingPrize(vo['id'])
            }
          } else {
            console.log(JSON.stringify(data))
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
function browseMeeting(id) {
  return new Promise((resolve) => {
    $.post(taskPostUrl('task/browseMeeting', `meetingId=${id}`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data && data['code'] === 200) {
            console.log(data.msg)
          } else {
            console.log(JSON.stringify(data))
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
function getMeetingPrize(id) {
  return new Promise((resolve) => {
    $.post(taskPostUrl('task/getMeetingPrize', `meetingId=${id}`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data && data['code'] === 200) {
            $.beans += parseInt(data.data.jdNum)
            $.score += parseInt(data.data.integralNum)
            console.log(`获得${data.data.jdNum}京豆，${data.data.integralNum}积分`)
          } else {
            console.log(JSON.stringify(data))
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
function getGoodList() {
  return new Promise((resolve) => {
    $.get(taskUrl('task/listGoods'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data && data['code'] === 200) {
            for(let vo of data.data.goodsList){
              await browseGood(vo['id'])
              await getGoodPrize(vo['id'])
            }
          } else {
            console.log(JSON.stringify(data))
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
function browseGood(id) {
  return new Promise((resolve) => {
    $.get(taskUrl('task/browseGoods', `skuId=${id}`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data && data['code'] === 200) {
            console.log(data.msg)
          } else {
            console.log(JSON.stringify(data))
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
function getGoodPrize(id) {
  return new Promise((resolve) => {
    $.get(taskUrl('task/getGoodsPrize', `skuId=${id}`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data && data['code'] === 200) {
            $.beans += parseInt(data.data.jdNum)
            $.score += parseInt(data.data.integralNum)
            console.log(`获得${data.data.jdNum}京豆，${data.data.integralNum}积分`)
          } else {
            console.log(JSON.stringify(data))
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
function getShopList() {
  return new Promise((resolve) => {
    $.get(taskUrl('task/shopInfo'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data && data['code'] === 200) {
            for(let vo of data.data){
              await browseShop(vo['shopId'])
              await getShopPrize(vo['shopId'])
            }
          } else {
            console.log(JSON.stringify(data))
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
function browseShop(id) {
  return new Promise((resolve) => {
    $.post(taskPostUrl('task/browseShop', `shopId=${id}`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data && data['code'] === 200) {
            console.log(data.msg)
          } else {
            console.log(JSON.stringify(data))
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
function getShopPrize(id) {
  return new Promise((resolve) => {
    $.post(taskPostUrl('task/getShopPrize', `shopId=${id}`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data && data['code'] === 200) {
            $.beans += parseInt(data.data.jdNum)
            $.score += parseInt(data.data.integralNum)
            console.log(`获得${data.data.jdNum}京豆，${data.data.integralNum}积分`)
          } else {
            console.log(JSON.stringify(data))
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
function getHelp() {
  return new Promise((resolve) => {
    $.get(taskUrl('task/getHelp'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data && data['code'] === 200) {
            console.log(`您的好友助力码为：${data.data.shareId} \n注：此邀请码每天都变！`);
          } else {
            console.log(JSON.stringify(data))
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
function myRank() {
  return new Promise(resolve => {
    const options = {
      "url": `${JD_API_HOST}task/myRank?t=${Date.now()}`,
      "headers": {
        "Host": "rdcseason.m.jd.com",
        "Accept": "application/json, text/plain, */*",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1",
        "Accept-Language": "zh-cn",
        "Referer": "https://rdcseason.m.jd.com/",
        "Accept-Encoding": "gzip, deflate, br"
      }
    }
    $.jbeanNum = '';
    $.get(options, async (err, resp, data) => {
      try {
        // console.log('查询获奖列表data', data);
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.code === 200 && data.data.myHis) {
            for (let i = 0; i < data.data.myHis.length; i++) {
              $.date = data.data.myHis[0].date;
              if (data.data.myHis[i].status === '21') {
                await $.wait(1000);
                console.log('开始领奖')
                let res = await saveJbean(data.data.myHis[i].id);
                // console.log('领奖结果', res)
                if (res.code === 200 && res.data.rsCode === 200) {
                  // $.jbeanNum += Number(res.data.jbeanNum);
                  console.log(`${data.data.myHis[i].date}日奖励领取成功${JSON.stringify(res.data.jbeanNum)}`)
                }
              }
              if (i === 0 && data.data.myHis[i].status === '22') {
                $.jbeanNum = data.data.myHis[i].prize;
              }
            }
            // for (let item of data.data.myHis){
            //   if (item.status === '21') {
            //     await $.wait(1000);
            //     console.log('开始领奖')
            //     let res = await saveJbean(item.id);
            //     // console.log('领奖结果', res)
            //     if (res.code === 200 && res.data.rsCode === 200) {
            //       $.jbeanNum += Number(res.data.jbeanNum);
            //     }
            //   }
            // }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function saveJbean(id) {
  return new Promise(resolve => {
    const options = {
      "url": `${JD_API_HOST}task/saveJbean`,
      "body": `prizeId=${id}`,
      "headers": {
        "Host": "rdcseason.m.jd.com",
        "Accept": "application/json, text/plain, */*",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1",
        "Accept-Language": "zh-cn",
        "Referer": "https://rdcseason.m.jd.com/",
        "Accept-Encoding": "gzip, deflate, br"
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        // console.log('领取京豆结果', data);
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function readShareCode() {
  console.log(`开始`)
  return new Promise(async resolve => {
    $.get({
      url: `http://jd.turinglabs.net/api/v2/jd/5g/read/${randomCount}/`,
      'timeout': 10000
    }, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            console.log(`随机取${randomCount}个码放到您固定的互助码后面(不影响已有固定互助)`)
            data = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
    await $.wait(2000);
    resolve()
  })
}

//格式化助力码
function shareCodesFormat() {
  return new Promise(async resolve => {
    // console.log(`第${$.index}个京东账号的助力码:::${$.shareCodesArr[$.index - 1]}`)
    $.newShareCodes = [];
    if ($.shareCodesArr[$.index - 1]) {
      $.newShareCodes = $.shareCodesArr[$.index - 1].split('@');
    } else {
      console.log(`由于您第${$.index}个京东账号未提供shareCode,将采纳本脚本自带的助力码\n`)
      const tempIndex = $.index > inviteCodes.length ? (inviteCodes.length - 1) : ($.index - 1);
      $.newShareCodes = inviteCodes[tempIndex].split('@');
    }
    const readShareCodeRes = await readShareCode();
    if (readShareCodeRes && readShareCodeRes.code === 200) {
      $.newShareCodes = [...new Set([...$.newShareCodes, ...(readShareCodeRes.data || [])])];
    }
    console.log(`第${$.index}个京东账号将要助力的好友${JSON.stringify($.newShareCodes)}`)
    resolve();
  })
}

function requireConfig() {
  return new Promise(async resolve => {

    console.log(`开始获取${$.name}配置文件\n`);
    //Node.js用户请在jdCookie.js处填写京东ck;
    let shareCodes = []
    console.log(`共${cookiesArr.length}个京东账号\n`);
    if ($.isNode() && process.env.JD818_SHARECODES) {
      if (process.env.JD818_SHARECODES.indexOf('\n') > -1) {
        shareCodes = process.env.JD818_SHARECODES.split('\n');
      } else {
        shareCodes = process.env.JD818_SHARECODES.split('&');
      }
    }
    $.shareCodesArr = [];
    if ($.isNode()) {
      Object.keys(shareCodes).forEach((item) => {
        if (shareCodes[item]) {
          $.shareCodesArr.push(shareCodes[item])
        }
      })
    }
    let data = await updateShareCodes("https://gitee.com/shylocks/updateTeam/raw/main/jd_818.json")
    if(data){
      inviteCodes[0] = data.join('@')
      inviteCodes[1] = data.join('@')
    }
    console.log(`您提供了${$.shareCodesArr.length}个账号的${$.name}助力码\n`);
    resolve()
  })
}

function taskUrl(function_id,body) {
  let url = `${JD_API_HOST}${function_id}?t=${new Date().getTime()}&${body}`;
  return {
    url,
    headers: {
      "Cookie": cookie,
      "origin": "https://rdcseason.m.jd.com",
      "referer": "https://rdcseason.m.jd.com/",
      'Content-Type': 'application/x-www-form-urlencoded',
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1"
    }
  }
}

function taskPostUrl(function_id, body = "") {
  let url = `${JD_API_HOST}${function_id}`;
  return {
    url,
    body: body,
    headers: {
      "Cookie": cookie,
      "origin": "https://rdcseason.m.jd.com",
      "referer": "https://rdcseason.m.jd.com/",
      'Content-Type': 'application/x-www-form-urlencoded',
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1"
    }
  }
}

function taskPostUrl2(function_id, body = {}, function_id2) {
  let url = `${JD_API_HOST}`;
  if (function_id2) {
    url += `?functionId=${function_id2}`;
  }
  return {
    url,
    body: `functionId=${function_id}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0`,
    headers: {
      "Cookie": cookie,
      "origin": "https://h5.m.jd.com",
      "referer": "https://h5.m.jd.com/",
      'Content-Type': 'application/x-www-form-urlencoded',
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1"
    }
  }
}

function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1"
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            $.nickName = data['base'].nickname;
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}

function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}
function updateShareCodes(url = 'https://gitee.com/lxk0301/updateTeam/raw/master/shareCodes/jd_818.json') {
  return new Promise(resolve => {
    $.get({url,
      headers:{"User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")}
    }, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
        } else {
          resolve(JSON.parse(data))
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}