import {
  request
} from "../../request/index.js"
const a = getApp()
Page({
  data: {
    baseUrl: a.globalData.baseUrl,
    imagesUrl: a.globalData.imagesUrl,
    four: 4,
    msg: '',
    statusTop: a.globalData.statusHeight,
    href: '',
    url: 'https://yx.newxnf.com/al.html?1',
    src: '',
    count: 'a',
    TK: '',
    UID: '',
    SrUID: '',
    shareUrl: ''
  },
  onLoad: function (options) {
    let that = this
    let token = wx.getStorageSync('token') || ''
    let UID = wx.getStorageSync('SrUID') || ''
    console.log(options, "options收到反馈");
    console.log(token, "token");
    console.log(UID, "UID");
    if (options) {
      that.setData({
        src: options.src || '',
        SrUID: options.SrUID || '',
        i: options.i || '',
      })
    }
    let url = that.data.url
    let ht = ''
    ht = url + '.' + UID + '.' + token + '.' + options.i
    console.log(ht);
    that.setData({
      src: ht
    })
    wx.setStorageSync('sharePagePath', '/pages/out/out?url=' + url)


  },
  onShow: function () {},
  goback() {
    wx.navigateBack()
  },

  getMessage(e) {
    console.log(e)
    let that = this;
    let shareUrl = e.detail.data[e.detail.data.length - 1];
    that.setData({
      shareUrl: JSON.parse(shareUrl)
    })
    console.log(that.data.shareUrl, "that.data.shareUrl");
  },

  onShareAppMessage: function (options) {
    let that = this;
    console.log(that.data.shareUrl)
    let UID = wx.getStorageSync('SrUID') || ''
    let ht = ''
    ht = url + '.' + that.data.i + '&SrUID=' + UID
    return {
      title: '慧眼万物小程序',
      path: '/pages/out/out?url=' + ht,
      imageUrl: ''
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
  popSuccessTest() {
    wx.showToast({
      title: this.data.msg,
      icon: '', //默认值是success,就算没有icon这个值，就算有其他值最终也显示success
      duration: 1300, //停留时间
    })
  },
})