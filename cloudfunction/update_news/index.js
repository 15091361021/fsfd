// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数==>(用于批量标记消息已读/未读)
exports.main = async (event, context) => {
  try {
    return await db.collection('news').where({
      _openid: event._openid,
      news: event.news1
    }).update({
        data: {
          news: event.news2
        }
    })
  } catch (e) {
    return {
      resok: "失败",
      _openid:event._openid,
      e: e
    }
  }
  
}