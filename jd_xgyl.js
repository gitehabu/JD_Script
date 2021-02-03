/*
小鸽有礼2
每天抽奖25豆
活动入口：https://jingcai-h5.jd.com/#/dialTemplate?activityCode=1354740864131276800
活动时间：2021年1月28日～2021年2月28日
更新地址：https://gitee.com/lxk0301/jd_scripts/raw/master/jd_xgyl.js

已支持IOS双京东账号, Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, 小火箭，JSBox, Node.js
============Quantumultx===============
[task_local]
#小鸽有礼2
30 7 * * * https://gitee.com/lxk0301/jd_scripts/raw/master/jd_xgyl.js, tag=小鸽有礼2, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jd_xgyl.png, enabled=true

================Loon==============
[Script]
cron "30 7 * * *" script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_xgyl.js, tag=小鸽有礼2

===============Surge=================
小鸽有礼2 = type=cron,cronexp="30 7 * * *",wake-system=1,timeout=3600,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_xgyl.js

============小火箭=========
小鸽有礼2 = type=cron,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_xgyl.js, cronexpr="30 7 * * *", timeout=3600, enable=true
 */
const $ = new require('./Env.min').Env('小鸽有礼2');

const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
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
      await xgyl();
      await showMsg();
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

function showMsg() {
  message += `本次运行获得${$.beans}京豆`
  return new Promise(resolve => {
    $.msg($.name, '', `【京东账号${$.index}】${$.nickName}\n${message}`);
    resolve()
  })
}

async function xgyl() {
  $.draw = 0
  $.beans = 0
  for (let i = 0; i < 20; ++i) {
    await getMissionList()
    await $.wait(1000)
  }
  await getActInfo()
  while ($.draw--) {
    await draw()
    await $.wait(1000)
  }
}

function getActInfo() {
  return new Promise(resolve => {
    $.post(taskUrl('luckdraw/queryActivityBaseInfo'), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(resp)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success) {
              $.rewardList = data.content.rewardInfoDTOs
              console.log(`剩余抽奖次数：${data.content.drawNum}`)
              $.draw = data.content.drawNum
            }
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

function getMissionList() {
  return new Promise(resolve => {
    $.post(taskUrl('luckdraw/queryMissionList'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(resp)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success) {
              for (let vo of data.content.missionList) {
                if (vo.completeNum < vo.totalNum) {
                  console.log(`去做【${vo.desc}】任务`)
                  await doMission({missionNo: vo.missionNo, params: vo.params})
                  await $.wait(1000)
                }
                if (vo.status === 11) {
                  await getDrawChance({"getCode": vo.getRewardNos[0]})
                }
              }
            }
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

function getDrawChance(body) {
  return new Promise(resolve => {
    $.post(taskUrl('luckdraw/getDrawChance', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(resp)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success) {
              console.log(`获得一次抽奖机会`)
            } else {
              console.log(JSON.stringify(data))
            }
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

function doMission(body) {
  return new Promise(resolve => {
    $.post(taskUrl('luckdraw/completeMission', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(resp)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success) {
              console.log(`任务完成成功`)
            } else {
              console.log(`任务完成失败`)
            }
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

function draw() {
  return new Promise(resolve => {
    $.post(taskUrl('luckdraw/draw'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(resp)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success) {
              console.log(`抽奖获得：【${data.content.rewardDTO.title}】`)
              if (data.content.rewardDTO.rewardType === 102) {
                $.beans += data.content.rewardDTO.jdBeanDTO.sendNum
              }
            } else {
              console.log(JSON.stringify(data))
            }
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

function taskUrl(function_id, body) {
  return {
    url: `https://lop-proxy.jd.com/${function_id}`,
    body: JSON.stringify([{"userNo": "$cooMrdGatewayUid$", "activityCode": "1354740864131276800", ...body}]),
    headers: {
      'Host': 'lop-proxy.jd.com',
      'lop-dn': 'jingcai.jd.com',
      'biz-type': 'service-monitor',
      'app-key': 'jexpress',
      'access': 'H5',
      'content-type': 'application/json;charset=utf-8',
      'clientinfo': '{"appName":"jingcai","client":"m"}',
      'accept': 'application/json, text/plain, */*',
      'jexpress-report-time': new Date().getTime().toString(),
      'x-requested-with': 'XMLHttpRequest',
      'source-client': '2',
      'appparams': '{"appid":158,"ticket_type":"m"}',
      'version': '1.0.0',
      'origin': 'https://jingcai-h5.jd.com',
      'sec-fetch-site': 'same-site',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'referer': 'https://jingcai-h5.jd.com/',
      'accept-language': 'zh-CN,zh;q=0.9',
      "Cookie": cookie,
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
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
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
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