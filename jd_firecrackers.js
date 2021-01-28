/*
 * @Author: shylocks https://github.com/shylocks
 * @Date: 2021-01-20 13:27:41
 * @Last Modified by:   shylocks
 * @Last Modified time: 2021-01-20 21:27:41
 */
/*
集鞭炮赢京豆
活动入口：京东APP首页-发现好货-悬浮窗领京豆
地址：https://linggame.jd.com/babelDiy/Zeus/heA49fhvyw9UakaaS3UUJRL7v3o/index.html
已支持IOS双京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#集鞭炮赢京豆
10 8,21 * * * https://raw.githubusercontent.com/LXK9301/jd_scripts/master/jd_firecrackers.js, tag=集鞭炮赢京豆, img-url=https://raw.githubusercontent.com/Orz-3/task/master/jd.png, enabled=true

================Loon==============
[Script]
cron "10 8,21 * * *" script-path=https://raw.githubusercontent.com/LXK9301/jd_scripts/master/jd_firecrackers.js,tag=集鞭炮赢京豆

===============Surge=================
集鞭炮赢京豆 = type=cron,cronexp="10 8,21 * * *",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/LXK9301/jd_scripts/master/jd_firecrackers.js

============小火箭=========
集鞭炮赢京豆 = type=cron,script-path=https://raw.githubusercontent.com/LXK9301/jd_scripts/master/jd_firecrackers.js, cronexpr="10 8,21 * * *", timeout=3600, enable=true
 */
const $ = new require('./Env.min').Env('集鞭炮赢京豆');
const notify = $.isNode() ? require('./sendNotify') : '';
let notifyBean = $.isNode() ? process.env.FIRECRACKERS_NOTITY_BEAN || 0 : 0; // 账号满足兑换多少京豆时提示 默认 0 不提示，格式：120 表示能兑换 120 豆子发出通知;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;

if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
  };
} else {
  let cookiesData = $.getdata('CookiesJD') || "[]";
  cookiesData = jsonParse(cookiesData);
  cookiesArr = cookiesData.map(item => item.cookie);
  cookiesArr.reverse();
  cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
  cookiesArr.reverse();
  cookiesArr = cookiesArr.filter(item => item !== "" && item !== null && item !== undefined);
}

!(async () => {
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
      $.beans = 0
      message = '';
      await TotalBean();
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        } else {
          $.setdata('', `CookieJD${i ? i + 1 : ""}`);//cookie失效，故清空cookie。$.setdata('', `CookieJD${i ? i + 1 : "" }`);//cookie失效，故清空cookie。
        }
        continue
      }
      await jdFamily()
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function jdFamily() {
  $.earn = 0
  await getInfo()
  await getUserInfo()
  await getUserInfo(true)
  await showMsg();
}

function showMsg() {
  return new Promise(async resolve => {
    subTitle = `【京东账号${$.index}】${$.nickName}`;
    message += `【鞭炮🧨】本次获得 ${$.earn}，共计${$.total}\n`
    if ($.total && notifyBean) {
      for (let item of $.prize) {
        if (notifyBean <= item.beansPerNum) { // 符合预定的京豆档位
          if ($.total >= item.prizerank) { // 当前鞭炮满足兑换
            message += `【京豆】请手动兑换 ${item.beansPerNum} 个京豆，需消耗花费🧨 ${item.prizerank}`
            $.msg($.name, subTitle, message);
            if ($.isNode()) {
              await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}`, `${subTitle}\n${message}`);
              resolve();
              return;
            }
          }
        }
      }
    }
    $.log(`${$.name}\n\n账号${$.index} - ${$.nickName}\n${subTitle}\n${message}`);
    resolve()
  })
}

function getInfo() {
  return new Promise(resolve => {
    $.get({
      url: 'https://linggame.jd.com/babelDiy/Zeus/heA49fhvyw9UakaaS3UUJRL7v3o/index.html',
      headers: {
        Cookie: cookie
      }
    }, async (err, resp, data) => {
      try {
        $.info = JSON.parse(data.match(/var snsConfig = (.*)/)[1])
        $.prize = JSON.parse($.info.prize)
      } catch (e) {
        console.log(e)
      } finally {
        resolve()
      }
    })
  })
}

function getUserInfo(info = false) {
  return new Promise(resolve => {
    $.get(taskUrl('family_query'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${err},${jsonParse(resp.body)['message']}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          $.userInfo = JSON.parse(data.match(/query\((.*)\n/)[1])
          if (info) {
            $.earn = $.userInfo.tatalprofits - $.total
          } else {
            for (let task of $.info.config.tasks) {
              let vo = $.userInfo.tasklist.filter(vo => vo.taskid === task['_id'])
              if (vo.length > 0) {
                vo = vo[0]
                if (vo['isdo'] === 1) {
                  if (vo['times'] === 0) {
                    console.log(`去做任务${task['_id']}`)
                    let res = await doTask(task['_id'])
                    if (!res) { // 黑号，不再继续执行任务
                      break;
                    }
                    await $.wait(3000)
                  } else {
                    console.log(`${Math.trunc(vo['times'] / 60)}分钟可后做任务${task['_id']}`)
                  }
                }
              }
            }
          }
          $.total = $.userInfo.tatalprofits
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function doTask(taskId) {
  let body = `taskid=${taskId}`
  return new Promise(resolve => {
    $.get(taskUrl('family_task', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${err},${jsonParse(resp.body)['message']}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          let res = data.match(/query\((.*)\n/)[1];
          data = JSON.parse(res);
          if (data.ret === 0) {
            console.log(`任务完成成功`)
          } else if (data.ret === 1001) {
            console.log(`任务完成失败，原因：这个账号黑号了！！！`)
            resolve(false);
            return;
          } else {
            console.log(`任务完成失败，原因未知`)
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

function taskUrl(function_id, body = '') {
  body = `activeid=${$.info.activeId}&token=${$.info.actToken}&sceneval=2&shareid=&_=${new Date().getTime()}&callback=query&${body}`
  return {
    url: `https://wq.jd.com/activep3/family/${function_id}?${body}`,
    headers: {
      'Host': 'wq.jd.com',
      'Accept': 'application/json',
      'Accept-Language': 'zh-cn',
      'Content-Type': 'application/json;charset=utf-8',
      'Origin': 'wq.jd.com',
      'User-Agent': 'JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)',
      'Referer': `https://anmp.jd.com/babelDiy/Zeus/xKACpgVjVJM7zPKbd5AGCij5yV9/index.html?wxAppName=jd`,
      'Cookie': cookie
    }
  }
}

function taskPostUrl(function_id, body) {
  return {
    url: `https://lzdz-isv.isvjcloud.com/${function_id}`,
    body: body,
    headers: {
      'Host': 'lzdz-isv.isvjcloud.com',
      'Accept': 'application/json',
      'Accept-Language': 'zh-cn',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Origin': 'https://lzdz-isv.isvjcloud.com',
      'User-Agent': 'JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)',
      'Referer': `https://lzdz-isv.isvjcloud.com/dingzhi/book/develop/activity?activityId=${ACT_ID}`,
      'Cookie': `${cookie} isvToken=${$.isvToken};`
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
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0") : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
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
      $.msg($.name, '', '不要在BoxJS手动复制粘贴修改cookie')
      return [];
    }
  }
}
