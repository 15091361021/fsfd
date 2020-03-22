// pages/comm_comment_add/comm_comment_add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    add_img: [],//添加的图片
    fileIDs: [],//添加图片的路径
    comt:"",//点评
    input:"",//评价内容
    cmId: "",//评价的商铺ID
    time: "",//评价时间
    com_good: 0,
    com_bad: 0,
    userInfo: {
      avatarUrl: "../../images/img4/o1.png",//用户头像
      nickName: "未登录",//用户昵称
    }
  },
  /**
   * 点评获取
   */
  duk_radio:function(e){
    this.setData({
      comt: e.detail.value
    })
    console.log(this.data.comt)
  },
  /**
   * 点评内容
   */
  duk_input:function(e){
    this.setData({
      input: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    var that = this;
    //获取用户信息
    wx.getUserInfo({
      success: function (res) {
        var avatarUrl = 'userInfo.avatarUrl';
        var nickName = 'userInfo.nickName';
        that.setData({
          [avatarUrl]: res.userInfo.avatarUrl,
          [nickName]: res.userInfo.nickName,
        })
      }
    })
    //获取当前商铺ID
    this.setData({
      cmId: options.cmId
    })
    // console.log(this.data.cmId)
    //获取当前日期
    var data = new Date()
    data.setTime(data.getTime() + 24 * 60 * 60 * 1000);
    var year = data.getFullYear(); //年
    var month = data.getMonth() + 1; //月
    var day = data.getDate() - 1; //日
    var hour = data.getHours(); //时
    var minute = data.getMinutes(); //分
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    if (hour < 10) {
      hour = "0" + hour;
    }
    if (minute < 10) {
      minute = "0" + minute;
    }
    this.setData({
      time: year + '-' + month + '-' + day + ' '+ hour + ':' + minute
    })
    wx.hideLoading();
    wx.setNavigationBarTitle({
      title: '我的评价'
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
   * 选择添加照片
   */
  duk_addImg: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // var tempFilePaths = res.tempFilePaths
        var src = res.tempFilePaths;
        var aa = that.data.add_img.concat(src)
        that.setData({
          add_img: aa
        })
      }
    })
  },
  /**
   * 选择删除照片
   */
  duk_deleteImg: function (e) {
    var num = e.currentTarget.dataset.num;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          that.data.add_img.splice(num, 1)
          that.setData({
            add_img: that.data.add_img
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 选择放大照片
   */
  duk_onImg: function (e) {
    var cur_num = e.currentTarget.dataset.num;
    var img_list = this.data.add_img
    wx.previewImage({
      current: img_list[cur_num],
      urls: this.data.add_img
    })
  },
  duk_sub:function(e){
    if(this.data.input==""){
      wx.showToast({
        icon: 'none',
        title: '请填写评论'
      });
    }else if(this.data.comt==""){
      wx.showToast({
        icon: 'none',
        title: '请点评'
      });
    }else{
      wx.showLoading({
        title: '发布中',
      });
      const promiseArr = [];
      //只能一张张上传 遍历临时的图片数组
      for (let i = 0; i < this.data.add_img.length; i++) {
        let filePath = this.data.add_img[i]
        let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取文件扩展名
        //在每次上传的时候，就往promiseArr里存一个promise，只有当所有的都返回结果时，才可以继续往下执行
        promiseArr.push(new Promise((reslove, reject) => {
          wx.cloud.uploadFile({
            cloudPath: new Date().getTime() + suffix,
            filePath: filePath, // 文件路径
          }).then(res => {
            this.setData({
              fileIDs: this.data.fileIDs.concat(res.fileID)
            })
            reslove()
          }).catch(error => {
            console.log("添加失败")
          })
        }))
      };
      // Promise.all(promiseArr).then(res => {
        const db = wx.cloud.database();
        db.collection('comment').add({
          data: {
            cmId: this.data.cmId,//商铺ID 
            name: this.data.userInfo.nickName,//评价人
            img: this.data.userInfo.avatarUrl,//点评人图像
            text: this.data.input,//评价内容
            comt: this.data.comt,//点评
            fileIDs: this.data.fileIDs, //图片链接
            time: this.data.time,//评价时间
            appraise: this.data.comt//评价等级（好/坏）
          }
        }).then(res => {
          var that = this;
          const db = wx.cloud.database();
          db.collection('comm').doc(that.data.cmId).get({ 
            success: function (res) {
              if(res.data){
                var c1 = res.data.good
                var c2 = res.data.bad
                if (that.data.comt == "好评") {
                  c1 = c1 + 1;
                } else if (that.data.comt = "差评") {
                  c2 = c2 + 1;
                }
                var c3 = ((c1/(c1+c2))*5).toFixed(1);
                db.collection('comm').doc(that.data.cmId).update({
                  data: {
                    good: c1,
                    bad: c2,
                    score: c3
                  }
                }).then(res => {
                  wx.redirectTo({
                    url: '../face_minute/face_minute?cmId=' + that.data.cmId,
                  })
                })
              }
            }
          })
          wx.hideLoading()
          wx.showToast({
            title: '发布成功',
          })
        }).catch(error => {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '发布失败',
          })
        })
      // })
    }
  }
})