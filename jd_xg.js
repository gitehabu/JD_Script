/*
 * @Author: shylocks https://github.com/shylocks
 * @Date: 2021-01-11 16:25:41
 * @Last Modified by:   shylocks
 * @Last Modified time: 2021-01-11 18:25:41
 */
/*
小鸽有礼
抽奖可获得京豆和快递优惠券
活动时间：2021年1月15日至2021年2月19日
更新地址：https://gitee.com/lxk0301/jd_scripts/raw/master/jd_xg.js
活动入口：https://snsdesign.jd.com/babelDiy/Zeus/4N5phvUAqZsGWBNGVJWmufXoBzpt/index.html?channel=lingsns003&scope=0&sceneid=9001&btnTips=&hideApp=0
已支持IOS双京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#小鸽有礼
5 7 * * * https://gitee.com/lxk0301/jd_scripts/raw/master/jd_xg.js, tag=小鸽有礼, img-url=https://raw.githubusercontent.com/yogayyy/Scripts/master/Icon/shylocks/jd_xg.jpg, enabled=true

================Loon==============
[Script]
cron "5 7 * * *" script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_xg.js,tag=小鸽有礼

===============Surge=================
小鸽有礼 = type=cron,cronexp="5 7 * * *",wake-system=1,timeout=200,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_xg.js

============小火箭=========
小鸽有礼 = type=cron,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_xg.js, cronexpr="5 7 * * *", timeout=200, enable=true
 */
const $ = new require('./Env.min').Env('小鸽有礼');
const notify = $.isNode() ? require('./sendNotify') : '';
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
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
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
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/`, {"open-url": "https://bean.m.jd.com/"});
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await jdXg()
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function jdXg() {
  await getInfo()
  await getUserInfo()
  while ($.userInfo.bless >= $.userInfo.cost_bless_one_time) {
    await draw()
    await getUserInfo()
    await $.wait(500)
  }
  await showMsg();
}

function showMsg() {
  return new Promise(resolve => {
    message += `本次运行获得${$.beans}京豆`
    $.msg($.name, '', `京东账号${$.index}${$.nickName}\n${message}`);
    resolve()
  })
}

function getInfo() {
  return new Promise(resolve => {
    $.get({
      url: 'https://snsdesign.jd.com/babelDiy/Zeus/4N5phvUAqZsGWBNGVJWmufXoBzpt/index.html?channel=lingsns003&scope=0&sceneid=9001&btnTips=&hideApp=0',
      headers: {
        Cookie: cookie
      }
    }, (err, resp, data) => {
      try {
        $.info = JSON.parse(data.match(/var snsConfig = (.*)/)[1])
        $.prize = JSON.parse($.info.prize)
        resolve()
      } catch (e) {
        console.log(e)
      }
    })
  })
}

function getUserInfo() {
  return new Promise(resolve => {
    $.get(taskUrl('query'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${err}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          $.userInfo = JSON.parse(data.match(/query\((.*)\n/)[1]).data
          // console.log(`您的好友助力码为${$.userInfo.shareid}`)
          console.log(`当前幸运值：${$.userInfo.bless}`)
          for (let task of $.info.config.tasks) {
            if (!$.userInfo.complete_task_list.includes(task['_id'])) {
              console.log(`去做任务${task['_id']}`)
              await doTask(task['_id'])
              await $.wait(500)
            }
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

function doTask(taskId) {
  let body = `task_bless=10&taskid=${taskId}`
  return new Promise(resolve => {
    $.get(taskUrl('completeTask', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${err}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data.match(/query\((.*)\n/)[1])
          if (data.data.complete_task_list.includes(taskId)) {
            console.log(`任务完成成功，当前幸运值${data.data.curbless}`)
            $.userInfo.bless = data.data.curbless
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

function draw() {
  return new Promise(resolve => {
    $.get(taskUrl('draw'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${err}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data.match(/query\((.*)\n/)[1])
          if (data.data.drawflag) {
            if ($.prize.filter(vo => vo.prizeLevel === data.data.level).length > 0) {
              console.log(`获得${$.prize.filter(vo => vo.prizeLevel === data.data.level)[0].prizename}`)
              if($.prize.filter(vo => vo.prizeLevel === data.data.level)[0].beansPerNum)
                $.beans += $.prize.filter(vo => vo.prizeLevel === data.data.level)[0].beansPerNum
            }
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
    url: `https://wq.jd.com/activet2/piggybank/${function_id}?${body}`,
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