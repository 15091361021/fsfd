// pages/face_minute/face_minute.js
const app = getApp()
var startX, endX;
var moveFlag = true; // 判断执行滑动事件
var qcmId;//全局当前商铺ID
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cmId: "", //商铺ID
    com: [], //店铺对象
    page: 0, //图片第几张
    pages: 0, //图片总张数
    imgs: [], //图片集合
    comm: [], //评价集合
    collect: false, // false-不收藏/true-收藏
    collect_id: "",//收藏的ID
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    var that = this;
    const db = wx.cloud.database();
    //获取当前用户_openid
    var openid;
    wx.cloud.callFunction({
      name: 'getOpenId',
      complete: res => {
        openid = res.result.openid;
      }
    })
    if (options != null) {
      qcmId = "0ec685215e48ecf1108405fe40f7782d";//options.cmId;//全局商铺ID赋值
    }
    // console.log(qcmId)

    //查看是否是当前用户已收藏店铺
    db.collection('collect').where({
      _openid: openid,
      cmId: qcmId
    }).get().then(res => {
      // console.log(res.data[0]._id)
      if (res.data.length > 0) {
        that.setData({
          collect: true,
          collect_id: res.data[0]._id
        })
      }
      console.log(that.data.collect)
    })
    //获取当前商铺ID
    that.setData({
      cmId: qcmId
    })
    //获取当前店铺详情
    db.collection('comm').doc(qcmId).get({
      success: function (res) {
        if (res.data) {
          that.setData({
            com: res.data,
            pages: res.data.fileIDs.length,
            imgs: res.data.fileIDs
          })
        }
      }
    })
    //获取当前店铺下评价详情
    var cot = [];
    db.collection('comment').where({
      cmId: qcmId
    }).get().then((res) => {
      var leths = res.data.length;
      if (leths > 0) {
        var leth;
        if (leths >= 10) {
          leth = 10;
        } else {
          leth = res.data.length;
        }
        var ins = 0;
        for (var i = leths - 1; i >= leths - leth; i--) {
          cot[ins++] = res.data[i];
        }
        that.setData({
          comm: cot
        })
        console.log(res.data)
      }
    })
    wx.hideLoading();
    wx.setNavigationBarTitle({
      title: '详情'
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
  // 获取触摸时的原点
  duk_start: function (e) {
    startX = e.touches[0].pageX;
    moveFlag = true;
  },
  // 触摸移动事件
  duk_move: function (e) {
    endX = e.touches[0].pageX; // 获取触摸时的原点
    if (moveFlag) {
      if (endX - startX > 50) {
        console.log("move right");
        this.moveRight();
        moveFlag = false;
      }
      if (startX - endX > 50) {
        console.log("move left");
        this.moveLeft();
        moveFlag = false;
      }
    }
  },
  // 触摸结束事件
  duk_end: function (e) {
    moveFlag = true; // 回复滑动事件
  },
  //向左滑动操作,下一张
  moveLeft() {
    var that = this;
    var dpag = this.data.page + 1;
    var max = this.data.imgs.length - 1;
    if (this.data.page == max) {
      wx.showToast({
        icon: 'none',
        title: '最后一张',
      })
      return
    }
    setTimeout(function () {
      that.setData({
        page: dpag,
      });
    }, 800)
  },
  //向右滑动操作，上一张
  moveRight() {
    var that = this;
    var upag = this.data.page - 1;
    if (this.data.page == 0) {
      wx.showToast({
        icon: 'none',
        title: '第一张',
      })
      return
    }
    setTimeout(function () {
      that.setData({
        page: upag,
      });
    }, 800)
  },
  /**
   * 拨号
   */
  duk_call: function(e){
    var call = e.currentTarget.dataset.call;
    wx.makePhoneCall({
      phoneNumber: call,
    })
  },
  /**
   * 查看全部评价
   */
  duk_comment: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: '../comm_comment/comm_comment?cmId' + id,
    })
  },
  /**
   * 添加自己评价
   */
  duk_comment_add: function (e) {
    var id = e.currentTarget.dataset['id']
    wx.navigateTo({
      url: '../comm_comment_add/comm_comment_add?cmId=' + id,
    })
  },
  /**
   * 选择放大照片
   */
  duk_onImg: function (e) {
    var cur_num = e.currentTarget.dataset.num;
    var img_list = e.currentTarget.dataset.img
    wx.previewImage({
      current: img_list[cur_num],
      urls: e.currentTarget.dataset.img
    })
  },
  /**
   * 店铺收藏
   */
  duk_collect: function (e) {
    var that = this
    var coll = that.data.collect;
    that.setData({
      collect: !coll
    })
    const db = wx.cloud.database();
    if (!coll) {
      console.log("添加收藏")
      db.collection('collect').add({
        data: ({
          cmId: e.currentTarget.dataset.id
        })
      }).then(res => {
        that.onLoad();
        wx.showToast({
          title: '收藏成功',
        })
      })
    } else {
      console.log("取消收藏")
      db.collection('collect').doc(that.data.collect_id).remove({
        success: function (res) {
          that.onLoad();
          wx.showToast({
            title: '取消收藏',
          })
        }, fail: err => {
          console.log(err)
        }
      })
    }
  },
  /**
   * 店铺分享
   */
  duk_share: function (e) {
    console.log("分享")
  },
})