const app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
var scity = "西安";
Page({
  data: {
    province: '',
    city: '西安',
    latitude: '',
    longitude: '',
    comm:[],
  },
  onLoad: function() {
    qqmapsdk = new QQMapWX({
      key: 'T75BZ-5GUW4-GZWUJ-DXK6G-7CY25-6FFTM' //这里自己的key秘钥进行填充
    });
    var cit = this.data.city + "市";
    const db = wx.cloud.database();
    db.collection('comm').where({
      acity: cit
    }).get().then((res) => {
      var com = res.data;
      this.setData({
        comm: com
      })
      console.log(this.data.comm)
    })
  },
  onShow: function() {
    let vm = this;
    vm.getUserLocation();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    var cc= scity
    console.log(cc);
    that.setData({
      city: scity
    })
    that.onLoad();
  },
  getUserLocation: function() {
    let vm = this;
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function(res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function(dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      vm.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          vm.getLocation();
        } else {
          //调用wx.getLocation的API
          vm.getLocation();
        }
      }
    })
  },
  // 微信获得经纬度
  // getLocation: function() {
  //   let vm = this;
  //   wx.getLocation({
  //     type: 'wgs84',
  //     success: function(res) {
  //       console.log(JSON.stringify(res))
  //       var latitude = res.latitude
  //       var longitude = res.longitude
  //       var speed = res.speed
  //       var accuracy = res.accuracy;
  //       vm.getLocal(latitude, longitude)
  //     },
  //     fail: function(res) {
  //       console.log('fail' + JSON.stringify(res))
  //     }
  //   })
  // },
  // 获取当前地理位置
  // getLocal: function(latitude, longitude) {
  //   let vm = this;
  //   qqmapsdk.reverseGeocoder({
  //     location: {
  //       latitude: latitude,
  //       longitude: longitude
  //     },
  //     success: function(res) {
  //       console.log(JSON.stringify(res));
  //       let province = res.result.ad_info.province
  //       let city = res.result.ad_info.city
  //       vm.setData({
  //         province: province,
  //         city: city,
  //         latitude: latitude,
  //         longitude: longitude
  //       })

  //     },
  //     fail: function(res) {
  //       console.log(res);
  //     },
  //     complete: function(res) {
  //       console.log(res);
  //     }
  //   });
  // },
  //更换城市
  bindcity: function() {
    wx.navigateTo({
      url: '../face_city/face_city?cityType=city',
    })
  },
  onShow: function() {
    if (app.globalData.trainBeginCity){
      scity = app.globalData.trainBeginCity
    }
    this.setData({
      city: scity
    })
  },
  /**
   * kinds = 景点/餐饮/酒店/娱乐/购物
   */
  duk_item: function(e){
    var kinds = e.currentTarget.dataset.kinds;
    var acity = this.data.city;
    wx.navigateTo({
      url: '../face_item/face_item?data='+[acity,kinds],
    })
  },
  // //景点
  // duk_scenic: function() {
  //   wx.navigateTo({
  //     url: '../face_scenic/face_scenic?acity=' + this.data.acity,
  //   })
  // },
  // //餐饮
  // duk_eat: function() {
  //   wx.navigateTo({
  //     url: '../face_eat/face_eat?acity=' + this.data.acity,
  //   })
  // },
  // //酒店
  // duk_grog: function() {
  //   wx.navigateTo({
  //     url: '../face_grog/face_grog?acity=' + this.data.acity,
  //   })
  // },
  // //购物
  // duk_shop: function() {
  //   wx.navigateTo({
  //     url: '../face_shop/face_shop?acity=' + this.data.acity,
  //   })
  // },
  // //娱乐
  // duk_play: function() {
  //   wx.navigateTo({
  //     url: '../face_play/face_play?acity=' + this.data.acity,
  //   })
  // },
  /**
   * 所选详情
   */
  duk_minute:function(e){
    var id = e.currentTarget.dataset['id']
    wx.navigateTo({
      url: '../face_minute/face_minute?cmId=' + id,
    })
  },
})