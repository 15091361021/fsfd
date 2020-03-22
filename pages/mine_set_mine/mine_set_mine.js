// pages/mine_set_mine/mine_set_mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comms: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var openid;
    //获取当前用户_openid
    wx.cloud.callFunction({
      name: 'getOpenId',
      complete: res => {
        openid = res.result.openid;
        // console.log('openid--', res.result.openid)
      }
    })
    //调取云数据库
    const db = wx.cloud.database();
    db.collection('comm').where({
      _openid: openid
    }).get().then((res) => {
      var com = res.data;//res为openid相关的所有在集合的数据，
      this.setData({
        comms: com
      });
      // console.log(this.data.comms) 
    })
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
   * 修改当前店铺信息
   */
  duk_update:function(e){
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showToast({
            title: '删除成功',
          })
        } else if (res.cancel) {
          wx.showToast({
            title: '用户点击取消',
          })
        }
      }
    })
    console.log(e.currentTarget.dataset['id'])
  },
  /**
   * 删除当前店铺
   */
  duk_delete:function(e){
    const db = wx.cloud.database();
    var cid = e.currentTarget.dataset['id'];
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          db.collection("comm").doc(cid).remove({
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
    // console.log(cid);
  }
})