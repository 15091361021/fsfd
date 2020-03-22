// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数===>(用于修改消息是否已读)
exports.main = async (event, context) => {
  try {
    return await db.collection('news').doc(event.id).update({
      data: {
        news: event.news
      }
    })
  } catch (e) {
    return e
  }
}