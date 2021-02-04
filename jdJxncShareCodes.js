/*
京喜农场助力码
此助力码要求种子 active 相同才能助力，多个账号的话可以种植同样的种子，如果种子不同的话，会自动跳过使用云端助力
此文件为Node.js专用。其他用户请忽略
支持京东N个账号
 */
//云服务器腾讯云函数等NOde.js用户在此处填写京京喜农场的好友码。
// 同一个京东账号的好友助力码用@符号隔开,不同京东账号之间用&符号或者换行隔开,下面给一个示例
// 如: 京东账号1的shareCode1@京东账号1的shareCode2&京东账号2的shareCode1@京东账号2的shareCode2
// 注意：京喜农场 种植种子发生变化的时候，互助码也会变！！
// 注意：京喜农场 种植种子发生变化的时候，互助码也会变！！
// 注意：京喜农场 种植种子发生变化的时候，互助码也会变！！
// 每个账号 shareCdoe 是一个 json，示例如下
// {"smp":"22bdadsfaadsfadse8a","active":"jdnc_1_btorange210113_2","joinnum":"1"}
let JxncShareCodes = [
    '{"smp":"4767489fc369e50ead0a65a4dbeee28e","active":"jdnc_1_3yuanxuecheng210202_2","joinnum":1}@{"smp":"da3843f5bb5eed623692c32b2087d1e9","active":"jdnc_1_hongfushi210126_2","joinnum":1}@{"smp":"a00cb9f8cf6546c491abed328f318aed","active":"jdnc_1_quqibinggan210126_2","joinnum":1}@{"smp":"73de4e7d794644c707f8a54fda567132","active":"jdnc_1_hnapple210126_2","joinnum":1}@{"smp":"04b703fc8d82e127466a6b1e70efa966","active":"jdnc_1_caomeigan210126_2","joinnum":1}@{"smp":"e32a7d2f2db9b60994423e991510befb","active":"jdnc_1_1yuanxiaoxiong210129_2","joinnum":1}',//账号一的好友shareCode,不同好友中间用@符号隔开
    '{"smp":"4767489fc369e50ead0a65a4dbeee28e","active":"jdnc_1_3yuanxuecheng210202_2","joinnum":1}@{"smp":"da3843f5bb5eed623692c32b2087d1e9","active":"jdnc_1_hongfushi210126_2","joinnum":1}@{"smp":"a00cb9f8cf6546c491abed328f318aed","active":"jdnc_1_quqibinggan210126_2","joinnum":1}@{"smp":"73de4e7d794644c707f8a54fda567132","active":"jdnc_1_hnapple210126_2","joinnum":1}@{"smp":"04b703fc8d82e127466a6b1e70efa966","active":"jdnc_1_caomeigan210126_2","joinnum":1}@{"smp":"e32a7d2f2db9b60994423e991510befb","active":"jdnc_1_1yuanxiaoxiong210129_2","joinnum":1}',
    '{"smp":"4767489fc369e50ead0a65a4dbeee28e","active":"jdnc_1_3yuanxuecheng210202_2","joinnum":1}@{"smp":"da3843f5bb5eed623692c32b2087d1e9","active":"jdnc_1_hongfushi210126_2","joinnum":1}@{"smp":"a00cb9f8cf6546c491abed328f318aed","active":"jdnc_1_quqibinggan210126_2","joinnum":1}@{"smp":"73de4e7d794644c707f8a54fda567132","active":"jdnc_1_hnapple210126_2","joinnum":1}@{"smp":"04b703fc8d82e127466a6b1e70efa966","active":"jdnc_1_caomeigan210126_2","joinnum":1}@{"smp":"e32a7d2f2db9b60994423e991510befb","active":"jdnc_1_1yuanxiaoxiong210129_2","joinnum":1}',
    '{"smp":"4767489fc369e50ead0a65a4dbeee28e","active":"jdnc_1_3yuanxuecheng210202_2","joinnum":1}@{"smp":"da3843f5bb5eed623692c32b2087d1e9","active":"jdnc_1_hongfushi210126_2","joinnum":1}@{"smp":"a00cb9f8cf6546c491abed328f318aed","active":"jdnc_1_quqibinggan210126_2","joinnum":1}@{"smp":"73de4e7d794644c707f8a54fda567132","active":"jdnc_1_hnapple210126_2","joinnum":1}@{"smp":"04b703fc8d82e127466a6b1e70efa966","active":"jdnc_1_caomeigan210126_2","joinnum":1}@{"smp":"e32a7d2f2db9b60994423e991510befb","active":"jdnc_1_1yuanxiaoxiong210129_2","joinnum":1}',
    '{"smp":"4767489fc369e50ead0a65a4dbeee28e","active":"jdnc_1_3yuanxuecheng210202_2","joinnum":1}@{"smp":"da3843f5bb5eed623692c32b2087d1e9","active":"jdnc_1_hongfushi210126_2","joinnum":1}@{"smp":"a00cb9f8cf6546c491abed328f318aed","active":"jdnc_1_quqibinggan210126_2","joinnum":1}@{"smp":"73de4e7d794644c707f8a54fda567132","active":"jdnc_1_hnapple210126_2","joinnum":1}@{"smp":"04b703fc8d82e127466a6b1e70efa966","active":"jdnc_1_caomeigan210126_2","joinnum":1}@{"smp":"e32a7d2f2db9b60994423e991510befb","active":"jdnc_1_1yuanxiaoxiong210129_2","joinnum":1}',
    '{"smp":"4767489fc369e50ead0a65a4dbeee28e","active":"jdnc_1_3yuanxuecheng210202_2","joinnum":1}@{"smp":"da3843f5bb5eed623692c32b2087d1e9","active":"jdnc_1_hongfushi210126_2","joinnum":1}@{"smp":"a00cb9f8cf6546c491abed328f318aed","active":"jdnc_1_quqibinggan210126_2","joinnum":1}@{"smp":"73de4e7d794644c707f8a54fda567132","active":"jdnc_1_hnapple210126_2","joinnum":1}@{"smp":"04b703fc8d82e127466a6b1e70efa966","active":"jdnc_1_caomeigan210126_2","joinnum":1}@{"smp":"e32a7d2f2db9b60994423e991510befb","active":"jdnc_1_1yuanxiaoxiong210129_2","joinnum":1}',
    '{"smp":"4767489fc369e50ead0a65a4dbeee28e","active":"jdnc_1_3yuanxuecheng210202_2","joinnum":1}@{"smp":"da3843f5bb5eed623692c32b2087d1e9","active":"jdnc_1_hongfushi210126_2","joinnum":1}@{"smp":"a00cb9f8cf6546c491abed328f318aed","active":"jdnc_1_quqibinggan210126_2","joinnum":1}@{"smp":"73de4e7d794644c707f8a54fda567132","active":"jdnc_1_hnapple210126_2","joinnum":1}@{"smp":"04b703fc8d82e127466a6b1e70efa966","active":"jdnc_1_caomeigan210126_2","joinnum":1}@{"smp":"e32a7d2f2db9b60994423e991510befb","active":"jdnc_1_1yuanxiaoxiong210129_2","joinnum":1}',
    '{"smp":"4767489fc369e50ead0a65a4dbeee28e","active":"jdnc_1_3yuanxuecheng210202_2","joinnum":1}@{"smp":"da3843f5bb5eed623692c32b2087d1e9","active":"jdnc_1_hongfushi210126_2","joinnum":1}@{"smp":"a00cb9f8cf6546c491abed328f318aed","active":"jdnc_1_quqibinggan210126_2","joinnum":1}@{"smp":"73de4e7d794644c707f8a54fda567132","active":"jdnc_1_hnapple210126_2","joinnum":1}@{"smp":"04b703fc8d82e127466a6b1e70efa966","active":"jdnc_1_caomeigan210126_2","joinnum":1}@{"smp":"e32a7d2f2db9b60994423e991510befb","active":"jdnc_1_1yuanxiaoxiong210129_2","joinnum":1}'
]
// 判断github action里面是否有京喜农场助力码
if (process.env.JXNC_SHARECODES) {
  if (process.env.JXNC_SHARECODES.indexOf('&') > -1) {
    console.log(`您的京喜农场助力码选择的是用&隔开\n`)
    JxncShareCodes = process.env.JXNC_SHARECODES.split('&');
  } else if (process.env.JXNC_SHARECODES.indexOf('\n') > -1) {
    console.log(`您的京喜农场助力码选择的是用换行隔开\n`)
    JxncShareCodes = process.env.JXNC_SHARECODES.split('\n');
  } else {
    JxncShareCodes = process.env.JXNC_SHARECODES.split();
  }
} else if (process.env.JD_COOKIE) {
  // console.log(`由于您secret里面未提供助力码，故此处运行将会给脚本内置的码进行助力，请知晓！`)
}
for (let i = 0; i < JxncShareCodes.length; i++) {
  const index = (i + 1 === 1) ? '' : (i + 1);
  exports['JxncShareCode' + index] = JxncShareCodes[i];
}
