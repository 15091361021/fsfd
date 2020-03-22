// pages/mine_collect/mine_collect.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coll: [], //收藏夹集合
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    });
    var that = this;
    that.setData({
      coll: []
    })
    //获取当前用户_openid
    var openid;
    wx.cloud.callFunction({
      name: 'getOpenId',
      complete: res => {
        openid = res.result.openid;
      }
    })
    //调取云数据库获取收藏夹列表
    const db = wx.cloud.database();
    db.collection('collect').where({
      _openid: openid
    }).get({
      success: function(res) {
        var com = res.data.reverse(); 
        for (var i = 0; i < com.length; i++) {
          var col_id = com[i]._id;
          db.collection('comm').doc(com[i].cmId).get({
            success: function(res) {
              var coll = that.data.coll;
              res.data.col_id = col_id;
              // console.log(res.data)
              coll.push(res.data)
              that.setData({coll});
            }
          })
        }
      }
    })
    wx.hideLoading();
    // console.log(that.data.coll)
    //页面标题
    wx.setNavigationBarTitle({
      title: '我的收藏'
    })
    // wx.setnav
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 店铺详情
   */
  duk_minute:function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../face_minute/face_minute?cmId=' + id,
    })
  },
  /**
   * 删除收藏
   */
  duk_delete:function(e){
    var that = this;
    var id = e.currentTarget.dataset.colid
    const db = wx.cloud.database();
    db.collection('collect').doc(id).remove({
      success: function (res) {
        that.onLoad();
        wx.showToast({
          title: '取消收藏',
        })
      }, fail: err => {
        console.log(err)
      }
    })
  },
})