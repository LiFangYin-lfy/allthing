import {
  request
} from "../../request/index.js"
const a = getApp()
Page({
  data: {
    baseUrl: a.globalData.baseUrl,
    imagesUrl: a.globalData.imagesUrl,
    statusTop: a.globalData.statusHeight,
    itemImg: a.globalData.itemImg,

    four: 4,
    msg: '',
    homeLoop: [],
    autoplay: true,
    interval: 3000,
    indicatorDots: true,
    indicator: '#FFFFFF',
    indicatorActive: '#ACACAC',
    circular: true,
    star: 4,
    href: '',
    it_cloose: false,
    indexTitle: 0,
    kw: '',
    Psize: 10,
    page: 1,
    storeList: [],
    is_have: 0,
    count: 1,
    listError: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试',
    showDialog: false

  },
  onLoad: function (options) {
    let that = this
    try {
      const res = wx.getSystemInfoSync()
      console.log(res.model)
      console.log(res.pixelRatio)
      console.log(res.windowWidth)
      console.log(res.windowHeight)
      console.log(res.language)
      console.log(res.version)
      console.log(res.platform)
      let pt = parseInt(res.version)
      console.log(pt);
      if (pt < 7) {
        that.toggleDialog()
      }
    } catch (e) {}
  },

  onShow: function () {
    this.gethoneList(1)
    this.getList(1)
  },
  goback() {
    // wx.navigateBack()
  },
  consume() {
    return false
  },
  toggleDialog() {
    this.setData({
      showDialog: !this.data.showDialog
    })
  },
  onPullDownRefresh: function () {
    let that = this
    let indexTitle = that.data.indexTitle
    wx.showNavigationBarLoading() //在标题栏中显示加载
    that.gethoneList(2)
    that.getsearchList(2)
    if (indexTitle == 1) {
      that.getGDRList(2)
    } else {
      that.getList(2)
    }
  },
  gonewOut(e) {
    let that = this
    let it = e.currentTarget.dataset.it
    wx.navigateTo({
      url: '/pages/out/out?i=' + it
    })
  },
  async getList(type) {
    let that = this
    let Psize = that.data.Psize
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'Applets_cp.ashx',
        data: {
          param: '{"Route": "getVSProList", "Psize" : "' + Psize + '","Pindex":"' + that.data.page + '"}'
        },
        method: 'GET'
      })
      if (data.length != 0) {
        data.forEach(item => {
          item.Uname = unescape(item.Uname)
        });
        that.setData({
          it_cloose: false
        })
      } else {
        that.setData({
          it_cloose: true
        })
      }
      if (data.length < Psize) {
        that.setData({
          is_have: 0,
        })
      } else {
        that.setData({
          is_have: 1,
        })
      }
      console.log(data);
      that.setData({
        storeList: that.data.storeList.concat(data)
      })



      if (type == 2) {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }

    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  async getGDRList(type) {
    let that = this
    let Psize = that.data.Psize
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'Applets_cp.ashx',
        data: {
          param: '{"Route": "getProList", "Psize" : "' + Psize + '","Pindex":"' + that.data.page + '"}'
        },
        method: 'GET'
      })
      console.log(data);
      if (data.length != 0) {
        that.setData({
          it_cloose: false
        })
      } else {
        that.setData({
          it_cloose: true
        })
      }
      if (data.length < Psize) {
        that.setData({
          is_have: 0,
        })
      } else {
        that.setData({
          is_have: 2,
        })
      }
      that.setData({
        storeList: that.data.storeList.concat(data)
      })
      if (type == 2) {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        console.log('nihao');
      }

    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  async gethoneList(type) {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'Applets_cp.ashx',
        data: {
          param: '{"Route": "getRotationImg"}'
        },
        method: 'GET'
      })
      console.log(data);
      that.setData({
        homeLoop: data
      })
      if (type == 2) {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        console.log('adb');
      }

    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  async getsearchList(type) {
    let that = this
    let indexTitle = that.data.indexTitle
    let Psize = that.data.Psize
    let typ = '';
    if (indexTitle == 0) {
      typ = "A";
    } else {
      typ = "B";
    }
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'Applets_cp.ashx',
        data: {
          param: '{"Route": "searchPro", "type" : "' + typ + '", "Psize" :' + that.data.Psize + ',"Pindex": ' + that.data.page + ',"KeyWords" : "' + that.data.kw + '"}'
        },
        method: 'GET'
      })
      console.log(data);
      if (data.length != 0) {
        data.forEach(item => {
          item.Uname = unescape(item.Uname)
        });
      }
      if (data.length < Psize) {
        that.setData({
          is_have: 0,
        })
      } else {
        that.setData({
          is_have: 3,
        })
      }
      that.setData({
        storeList: that.data.storeList.concat(data)
      })
      if (type == 2) {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        console.log('search');
      }
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  RichScan() {
    let that = this
    wx.scanCode({
      success: (res) => {
        console.log("扫码结果");
        console.log(res);
        that.setData({
          img: res.result,
        })
        let arr = res.result
        let obj = a.getCaption(arr);
        console.log(obj);
        wx.navigateTo({
          url: '/pages/searchResult/searchResult?obj=' + obj + '&arr=' + arr
        })
      },
      fail: (res) => {
        console.log(res);
      }
    })

  },


  getInput(e) {
    let that = this
    console.log(e.detail.value);
    this.setData({
      kw: e.detail.value
    })
    // that.getsearchList()
  },
  navtosearch(e) {
    let that = this
    console.log(e.detail.value);
    this.setData({
      kw: e.detail.value,
      page: 1,
      storeList: [],
    })
    that.getsearchList()
  },
  bindtapItem(e) {
    let that = this
    let send = e.currentTarget.dataset.index
    that.setData({
      indexTitle: send,
      page: 1,
      storeList: [],
    })
    console.log(that.data.storeList);
    if (send == 1) {
      that.getGDRList()
    } else {
      that.getList()
    }
  },
  showModal() { //显示对话框
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 100)
  },
  hideModal() { //隐藏对话框
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 100)
  },
  onShareAppMessage() {
    return {
      title: '慧眼万物小程序',
      path: '/pages/home/home',
    }
  },
  onReachBottom: function () {
    let that = this
    let newpageNum = that.data.page;
    let is_have = that.data.is_have
    let indexTitle = that.data.indexTitle
    if (indexTitle == 0) {
      if (is_have == 0) {
        that.setData({
          msg: '已到底部~'
        })
        that.popTest()
      } else if (is_have == 1) {
        newpageNum++;
        that.setData({
          page: newpageNum
        })
        that.getList()
      } else if (is_have == 3) {
        newpageNum++;
        that.setData({
          page: newpageNum
        })
        that.getsearchList()
      }
    } else {
      if (is_have == 0) {
        that.setData({
          msg: '已到底部~'
        })
        that.popTest()
      } else if (is_have == 2) {
        newpageNum++;
        that.setData({
          page: newpageNum
        })
        that.getGDRList()
      } else if (is_have == 3) {
        newpageNum++;
        that.setData({
          page: newpageNum
        })
        that.getsearchList()
      }
    }

  },



















  async public() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: '',
        data: {
          goods_id: that.data.goods_id
        }
      })
      console.log(data);
      that.setData({
        public: data
      })
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  popTest() {
    wx.showToast({
      title: this.data.msg,
      icon: 'none', //如果要纯文本，不要icon，将值设为'none'
      duration: 1300
    })
  },

  popSuccessTest() {
    wx.showToast({
      title: this.data.msg,
      icon: '', //默认值是success,就算没有icon这个值，就算有其他值最终也显示success
      duration: 1300, //停留时间
    })
  },
  goLogin() {
    wx.showModal({
      title: '提示',
      content: '您尚未登录，前往登录',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            // url: '/pages/authorization/authorization'
          })

        } else {
          wx.switchTab({
            url: '/pages/home/home'
          })
        }
      }
    })
  },
})