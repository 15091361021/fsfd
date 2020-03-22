// pages/mine_set_add/mine_set_add.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    add_img: [],//添加的图片
    fileIDs: [],
    multiArray: [],
    multiIndex: [0, 0, 0],
    shows: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectDatas: ['景点', '餐饮', '酒店', '娱乐', '购物'], //下拉列表的数据
    indexs: 0, //选择的下拉列 表下标,
    img: '../../images/mine/add_right.png',
    cara_name: "",
    cara_adress: "",
    cara_descript: "",
    cara_money: "",
    care_call: "",
    startTime: null,//营业开始时间
    endTime: null,//营业结束时间
    startDate: null,//开业时间
  },
  /**
   * 变量赋值
   */
  cara_name: function (e) {
    this.data.cara_name = e.detail.value;
  },
  cara_adress: function (e) {
    this.data.cara_adress = e.detail.value;
  },
  cara_descript: function (e) {
    this.data.cara_descript = e.detail.value;
  },
  cara_money: function (e) {
    this.data.cara_money = e.detail.value;
  },
  care_call: function (e) {
    this.data.care_call = e.detail.value;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCityInfo();
    //获取当前时间
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
      startTime: hour + ':' + minute,
      endTime: hour + ':' + minute,
      startDate: year + '-' + month + '-' + day
    })
    //页面标题
    wx.setNavigationBarTitle({
      title: '添加我的店'
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
   * 开业时间
   */
  duk_startDate: function (e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  /**
   * 营业开始时间
   */
  duk_startTime: function (e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  /**
   * 营业结束时间
   */
  duk_endTime: function (e) {
    this.setData({
      endTime: e.detail.value
    })
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

  duk_imgsUp: function (e) {
    if (!this.data.imgbox.length) {//
      wx.showToast({
        icon: 'none',
        title: '图片类容为空'
      });
    }
  },
  /**
   * 组件的方法列表
   */
  //获取数据库数据
  getCityInfo: function () {
    wx.cloud.init()
    const db = wx.cloud.database()
    //因为数据库只存有一个总的数据字典，所以指定它的ID直接获取数据
    //get 方法会触发网络请求，往数据库取数据
    var that = this
    db.collection('test').doc('SoSwu4KUywItKpe0XGsb0P9eX2TY47aVYQkp3DqYYnSmnNAf').get({
      success: function (res) {
        // console.log(res.data)
        wx.hideLoading();
        if (res.data) {
          //获取云数据库数据
          var temp = res.data.data;
          //初始化更新数据
          that.setData({
            provinces: temp,
            multiArray: [temp, temp[0].citys, temp[0].citys[0].areas],
            multiIndex: [0, 0, 0]
          })
        }
      },
      fail: err => {
        wx.hideLoading();
        console.error(err)
      }
    })
  },
  //点击确定
  bindMultiPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  //滑动
  bindMultiPickerColumnChange: function (e) {
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    //更新滑动的第几列e.detail.column的数组下标值e.detail.value
    data.multiIndex[e.detail.column] = e.detail.value;
    //如果更新的是第一列“省”，第二列“市”和第三列“区”的数组下标置为0
    if (e.detail.column == 0) {
      data.multiIndex = [e.detail.value, 0, 0];
    } else if (e.detail.column == 1) {
      //如果更新的是第二列“市”，第一列“省”的下标不变，第三列“区”的数组下标置为0
      data.multiIndex = [data.multiIndex[0], e.detail.value, 0];
    } else if (e.detail.column == 2) {
      //如果更新的是第三列“区”，第一列“省”和第二列“市”的值均不变。
      data.multiIndex = [data.multiIndex[0], data.multiIndex[1], e.detail.value];
    }
    var temp = this.data.provinces;
    data.multiArray[0] = temp;
    if ((temp[data.multiIndex[0]].citys).length > 0) {
      //如果第二列“市”的个数大于0,通过multiIndex变更multiArray[1]的值
      data.multiArray[1] = temp[data.multiIndex[0]].citys;
      var areaArr = (temp[data.multiIndex[0]].citys[data.multiIndex[1]]).areas;
      //如果第三列“区”的个数大于0,通过multiIndex变更multiArray[2]的值；否则赋值为空数组
      data.multiArray[2] = areaArr.length > 0 ? areaArr : [];
    } else {
      //如果第二列“市”的个数不大于0，那么第二列“市”和第三列“区”都赋值为空数组
      data.multiArray[1] = [];
      data.multiArray[2] = [];
    }
    //setData更新数据
    this.setData(data);
  },
  /**
   * 点击下拉显示框
   * */
  selectTaps: function () {
    this.setData({
      shows: !this.data.shows,
    });
    if (this.data.shows) {
      this.setData({
        img: '../../images/img4/add_dowon.png',
      });
    } else {
      this.setData({
        img: '../../images/img4/add_right.png'
      });
    }
  },
  /**
   * 点击下拉列表
   * */
  optionTaps: function (e) {
    let Indexs = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    console.log(Indexs)
    this.setData({
      indexs: Indexs,
      shows: !this.data.shows,
      img: '../../images/img4/add_right.png'
    });
  },
  duk_sub: function (e) {
    wx.showLoading({
      title: '添加中',
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
    Promise.all(promiseArr).then(res => {
      wx.cloud.init();
      const db = wx.cloud.database();
      var cit = this.data.multiArray[0][this.data.multiIndex[0]].name + this.data.multiArray[1][this.data.multiIndex[1]].name + this.data.multiArray[2][this.data.multiIndex[2]].name;
      var acit = this.data.multiArray[1][this.data.multiIndex[1]].name;
      db.collection('comm').add({
        data: {
          name: this.data.cara_name,
          city: cit,
          acity: acit,
          adress: this.data.cara_adress,
          descript: this.data.cara_descript,
          money: this.data.cara_money,
          kinds: this.data.selectDatas[this.data.indexs],
          startTime: this.data.startTime,
          endTime: this.data.endTime,
          call: this.data.care_call,
          startDate: this.data.startDate,
          good: 0,
          bad: 0,
          score: 5,
          fileIDs: this.data.fileIDs //只有当所有的图片都上传完毕后，这个值才能被设置，但是上传文件是一个异步的操作，你不知道他们什么时候把fileid返回，所以就得用promise.all
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
    })
  }
})