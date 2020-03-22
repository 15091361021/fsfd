const app = getApp()
Page({
  data: {
    startCity: '北京',//出发城市
    endCity: '西安',//目的城市
    startTime: null,//出发日期
    endTime: null,//返回日期
    shows: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectDatas: ['自驾', '火车', '高铁', '飞机'], //下拉列表的数据
    indexs: 0 //选择的下拉列 表下标,
  },
  /**
   * 出发日期选择
   */
  duk_startTime: function (e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  duk_call:function(e){
    console.log("拨打");
    wx.makePhoneCall({
      phoneNumber: '03123688777',
    })
  },
  /**
   * 返回日期选择
   */
  duk_endTime: function (e) {
    this.setData({
      endTime: e.detail.value
    });
    console.log(this.data.endTime)
  },
  onLoad: function (options) {
    if (this.data.date == null || this.data.date.trim() == "") {
      var day = new Date()
      day.setTime(day.getTime() + 24 * 60 * 60 * 1000);
      var year = day.getFullYear(); //年
      var month = day.getMonth() + 1; //月
      var day = day.getDate(); //日
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      this.setData({
        startTime: year + '-' + month + '-' + day,
        endTime: year + '-' + month + '-' + day
      })
    }
  },
  duk_startCity: function () {
    wx.navigateTo({
      url: '../face_city/face_city?cityType=city',
    })
  },
  duk_endCity: function () {
    wx.navigateTo({
      url: '../face_city/face_city?cityType=end',
    })
  },
  onShow: function () {
    this.setData({
      startCity: app.globalData.trainBeginCity,
      endCity: app.globalData.trainEndCity
    })
  },
  /**
   * 点击下拉显示框
   * */
  duk_selectTaps: function () {
    this.setData({
      shows: !this.data.shows,
    });
  },
  /**
   * 点击下拉列表
   * */
  duk_optionTaps: function (e) {
    let Indexs = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    console.log(Indexs)
    this.setData({
      indexs: Indexs,
      shows: !this.data.shows,
    });
  },
  /**
   * 添加提交
   */
  duk_sub: function (e) {
    console.log(e)
    const db = wx.cloud.database();
    db.collection('order').add({
      data: {
        startCity: e.currentTarget.dataset['startcity'],
        endCity: e.currentTarget.dataset['endcity'],
        way: e.currentTarget.dataset['way'],
        startTime: e.currentTarget.dataset['starttime'],
        endTime: e.currentTarget.dataset['endtime'],
      }
    }).then(res => {
      wx.hideLoading()
      wx.navigateBack({ changed: true });
      wx.showToast({
        title: '添加成功',
      })
    }).catch(error => {
      console.log("添加失败")
    })
  }
})