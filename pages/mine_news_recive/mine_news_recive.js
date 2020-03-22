// pages/mine_news_recive/mine_news_recive.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    texts:"",
    ropenid:"",
    rname:"",
    userInfo: {
      nickName: "未登录",//用户昵称
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var dataArray = options.data.split(',');
    console.log(dataArray);
    this.setData({
      ropenid: dataArray[0], 
      rname: dataArray[1]
    })
    var that = this;
    /**
   * 获取用户信息
   */
    wx.getUserInfo({
      success: function (res) {
        var nickName = 'userInfo.nickName';
        that.setData({
          [nickName]: res.userInfo.nickName,
        })
      }
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
   * 获取输入值
   */
  duk_input: function (e) {
    this.data.texts = e.detail.value;
  },
  duk_sub:function(e){
    var openid;
    //获取当前用户_openid
    wx.cloud.callFunction({
      name: 'add',
      complete: res => {
        openid = res.result.openid;
      }
    })
    var sName;
    if (openid = "oc0pa5J0IGJb9_t_m2_inbSYd12I"){
      sName = "小V";
    }else{
      sName = this.data.userInfo.nickName;
    }
    const db = wx.cloud.database();
    db.collection('news').add({
      data: {
        opinionTexts: this.data.texts,
        send: sName,
        recive: this.data.ropenid,
        news: 0
      }
    }).then(res => {
      wx.hideLoading()
      wx.navigateBack({
        changed: true
      });
      wx.showToast({
        title: '回复成功',
      })
    }).catch(error => {
      console.log("回复失败")
    })
  }
})