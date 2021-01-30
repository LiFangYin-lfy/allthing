import {
  request
} from "../../request/index.js"
const a = getApp()
Page({
  data: {
    baseUrl: a.globalData.baseUrl,
    imagesUrl: a.globalData.imagesUrl,
    statusTop: a.globalData.statusHeight,
    four: 4,
    msg: '',
    homeLoop: [],
    star: 4,
    it_cloose: true,
    index: 0,
    kw: '',
    Psize: 10,
    page: 1,
    type: "A",
    src: '',
    arr: '',
    obj: '',
  },
  onLoad: function (options) {
    let that = this
    console.log(options, "options");
    let src = options.arr + '?' + options.obj
    that.setData({
      src,
      arr: options.arr,
      obj: options.obj,
    })
    console.log(that.data.src, "src");
  },
  onShow: function () {},
  goback() {
    wx.navigateBack()
  },
  onShareAppMessage: function (options) {
    let that = this;
    return {
      title: '慧眼万物小程序',
      path: '/pages/searchResult/searchResult?arr=' + that.data.arr + '&obj=' + that.data.obj,
      imageUrl: ''
    }
  },


























  async getmyList() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: '',
        data: {
          param: '{"Route": "getVSProList", "Psize" :' + that.data.Psize + ',"Pindex": ' + that.data.page + ' ,"type":' + that.data.type + ',"KeyWords" :' + that.data.kw + '}'
        }
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
      that.setData({
        homeLoop: data
      })
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  bindtapItem(e) {
    let send = e.currentTarget.dataset.index
    this.setData({
      index: send
    })
  },
  gonewOut(e) {
    let that = this
    let it = e.currentTarget.dataset.it
    let token = wx.getStorageSync('token')
    if (token) {
      if (it.href != '') {
        wx.navigateTo({
          // url: '/pages/out/out?href=' + it.href
          url: '/pages/out/out?href=' + 'http://yx.newxnf.com/q.html?94754'
        })
      }
    } else {
      that.showModal()
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