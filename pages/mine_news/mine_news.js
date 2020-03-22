// pages/mine_news/mine_news.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    news: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取当前用户_openid
    var openid;
    wx.cloud.callFunction({
      name: 'getOpenId',
      complete: res => {
        openid = res.result.openid;
      }
    })
    //调取云数据库
    const db = wx.cloud.database();
    db.collection('news').where({
      recive: openid 
    }).get().then((res) => {
      var com = res.data; //res为openid相关的所有在集合的数据，
      this.setData({
        news: com
      });
      // console.log(this.data.news)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 回复消息
   */
  duk_recive:function(e){
    var a = e.currentTarget.dataset.id; 
    var b = e.currentTarget.dataset.name; 
    var that = this;
    wx.navigateTo({
      url: '../mine_news_recive/mine_news_recive?data='+[a,b],
    })
    that.onLoad();
    console.log("回复")
  },
  /**
   * 删除消息
   */
  duk_delete: function (e) {
    const db = wx.cloud.database();
    var oid = e.currentTarget.dataset['id'];
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          db.collection("news").doc(oid).remove({
            success: function (res) {
              that.onLoad();
              wx.showToast({
                title: '删除成功',
              })
            }, fail: err => {
              console.log(err)
            }
          });
        }
      }
    })
    console.log("删除")
  },
  /**
   * 标记已读
   */
  duk_alredy: function (e) {
    var oid = e.currentTarget.dataset['id'];
    var that = this;
    wx.cloud.callFunction({
      // 云函数名称
      name: 'update_news_id',
      // 传给云函数的参数
      data: {
        id: oid,
        news: 1
      }, success: function (res) {
        that.onLoad();
        console.log(res.result)
      }
    })
    console.log("标为已读")
  },
  /**
   * 标记未读
   */
  duk_no:function(e){
    var oid = e.currentTarget.dataset['id'];
    var that = this;
    wx.cloud.callFunction({
      // 云函数名称
      name: 'update_news_id',
      // 传给云函数的参数
      data: {
        id: oid,
        news: 0
      }, success: function (res) {
        that.onLoad();
        console.log(res.result)
      }
    })
    console.log("标为未读")
  },
  /**
   * 全部已读
   */
  duk_all: function (e) {
    console.log(app.globalData.openid)
    // var that = this;
    // wx.cloud.callFunction({
    //   name: 'update_news',
    //   data: {
    //     _openid: app.globalData.openid,
    //     news1: 0,
    //     news2: 1
    //   }, success: function (res) {
    //     that.onLoad();
    //     console.log(res.result)
    //   }
    // })
  }
})