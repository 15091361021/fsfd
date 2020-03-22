// pages/comm_comment/comm_comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    style1: 1, 
    style2: 0,
    style3: 0,
    cmId: "",//商铺ID
    comm: [],//评价集合
    comms: [],//用于刷新评价集合
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    var that = this;
    //获取当前商铺ID
    that.setData({
      cmId: options.cmId
    })
    console.log(options)
    const db = wx.cloud.database();
    db.collection('comment').where({
      cmId: that.data.cmId
    }).get().then((res) => {
      var leths = res.data.length;
      if (leths > 0) {
        that.setData({
          comm: res.data.reverse(),
          comms: res.data.reverse(),
        })
        console.log(that.data.comm)
      }
      wx.hideLoading();
    })
    wx.setNavigationBarTitle({
      title: '全部评价'
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
   * 全部评价
   * */
  duk_all:function(){
    var that = this;
    that.setData({
      style1: 1,
      style2: 0,
      style3: 0
    })
    that.setData({
      comm: that.data.comms,
    })
  },
  /**
   * 好评
   * */
  duk_good:function(){
    var that = this;
    that.setData({
      style1: 0,
      style2: 1,
      style3: 0
    })
    const db = wx.cloud.database();
    db.collection('comment').where({//options.cmId
      cmId: that.data.cmId,
      appraise: "好评"
    }).get().then((res) => {
      var leths = res.data.length;
      if (leths > 0) {
        that.setData({
          comm: res.data.reverse()
        })
        console.log(that.data.comm)
      }
    })
  },
   /**
   * 差评
   * */
  duk_bad:function(){
    var that = this;
    that.setData({
      style1: 0,
      style2: 0,
      style3: 1
    })
    const db = wx.cloud.database();
    db.collection('comment').where({//options.cmId
      cmId: that.data.cmId,
      appraise: "差评"
    }).get().then((res) => {
      var leths = res.data.length;
      if (leths > 0) {
        that.setData({
          comm: res.data.reverse()
        })
        console.log(that.data.comm)
      }
    })
  },
})