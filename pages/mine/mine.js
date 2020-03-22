// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户个人信息 
    userInfo: {
      avatarUrl: "../../images/mine/o1.png",//用户头像
      nickName: "未登录",//用户昵称
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取用户信息
    wx.getUserInfo({
      success: function (res) {
        // console.log(res);
        var avatarUrl = 'userInfo.avatarUrl';
        var nickName = 'userInfo.nickName';
        that.setData({
          [avatarUrl]: res.userInfo.avatarUrl,
          [nickName]: res.userInfo.nickName,
        })
      }
    })
    //页面标题
    wx.setNavigationBarTitle({
      title: '我的'
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
   * 个人登录的界面
   */
  dsk: function () {
    wx.navigateTo({
      url: '../index/index',
    })
  },
  /**
   * 我的收藏
   */
  duk_collect: function () {
    wx.navigateTo({
      url: '../mine_collect/mine_collect',
    })
  },
  /**
   * 已出行
   */
  duk_already: function () {
    // wx.navigateTo({
    //   url: '../mine_already/mine_already',
    // })
  },
  /**
   * 全部出行
   */
  duk_all() {
    // wx.navigateTo({
    //   url: '../mine_all/mine_all',
    // })
  },
  /**
   * 意见反馈
   */
  duk_opinion() {
    wx.navigateTo({
      url: '../mine_opinion/mine_opinion',
    })
  },
  /**
   * 我的消息
   */
  duk_news() {
    wx.navigateTo({
      url: '../mine_news/mine_news',
    })
  },
  /**
   * 设置
   */
  duk_set() {
    wx.navigateTo({
      url: '../mine_set/mine_set',
    })
  }
})