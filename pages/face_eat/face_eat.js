Page({

  /**
   * 页面的初始数据
   */
  data: {
    kinds: "餐饮",//景点类
    acity: "",//城市
    comm: [],//全部景点集合
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    var that = this;
    that.setData({
      acity: options.acity+"市"
    })
    const db = wx.cloud.database();
    db.collection('comm').where({
      acity: that.data.acity,
      kinds: that.data.kinds
    }).get({
      success: function (res) {
        that.setData({
          comm: res.data
        })
        wx.hideLoading();
        console.log(res.data)
      }
    })


    //页面标题
    wx.setNavigationBarTitle({
      title: '景点'
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
   * 所选详情
   */
  duk_minute: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../face_minute/face_minute?cmId=' + id,
    })
  },
})