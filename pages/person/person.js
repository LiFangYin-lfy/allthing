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
    code: '',
    encryptedData: '',
    iv: '',
    SrUID: 0,
    HeadImg: '',
    Headname: '',
    userInfo: {},
    Uid: '',
    token: '',
    is_items: false,

  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    if (options.TK) {
      let obj = options
      wx.setStorageSync('token', obj.TK)
      wx.setStorageSync('SrUID', obj.UID)
    }
    let token = wx.getStorageSync('token')
    let Uid = wx.getStorageSync('SrUID')
    console.log(token, Uid);
    if (token && Uid) {
      wx.showLoading({
        mask: true
      })
      that.getmyList()
    } else {
      that.showModal()
    }

  },
  onShow: function () {

  },
  goback() {
    wx.navigateBack()
  },
  async getmyList() {
    let that = this
    let token = wx.getStorageSync('token')
    let Uid = wx.getStorageSync('SrUID')
    console.log(token, Uid);
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'UserObj.ashx',
        method: 'GET',
        data: {
          param: '{"Route": "GetUInfo", "Uid" : "' + Uid + '","TK":"' + token + '"}'
        }
      })
      console.log(data);
      if (data.length != 0) {
        let obj = data[0]
        console.log(obj);
        that.setData({
          HeadImg: obj.HeadImg,
          Headname: unescape(obj.name),
        })
      }
      wx.hideLoading()
      that.setData({
        is_items: true
      })

    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg,
        is_items: true
      })
      wx.hideLoading()
      that.popTest()

      if (err.status == 1002) {
        that.getcode()
      } else {
        that.goOutLogin()
      }

    }
  },
  showModal() { //显示对话框
    let that = this
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true,
      is_items: true
    })
    // wx.hideLoading()
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
  goOutLogin() {
    wx.clearStorage()
    this.setData({
      SrUID: 0,
      HeadImg: '',
      Headname: '',
      userInfo: {},

    })
  },
  getcode() {
    let that = this
    wx.login({
      success(res) {
        console.log(res);
        that.setData({
          code: res.code,
        })
        try {
          request({
            url: 'Applets_cp.ashx',
            method: 'GET',
            data: {
              param: '{"Route": "Ulog","code": "' + res.code + '"}'
            }
          }).then(res => {
            console.log(res);
            console.log(res.data.data);
            if (res.data.status == 200) {
              let obj = JSON.parse(res.data.data)
              that.setData({
                SrUID: obj.UID,
                HeadImg: obj.HeadImg,
                Headname: unescape(obj.name),
                userInfo: obj,
              })
              wx.setStorageSync('token', obj.TK)
              wx.setStorageSync('SrUID', obj.UID)
            }
          }).catch(err => {
            console.log(err);
            if (err.status == 3001) {
              that.showModal()
            }
          })

        } catch (err) {
          console.log(err);
          that.setData({
            msg: err.msg
          })
          that.popTest()
        }
      }
    })
  },
  wechatWarranty(e) { // 立即授权
    console.log(e)
    let that = this;
    let ary = JSON.parse(e.detail.rawData)
    console.log(ary);
    let country = ary.country
    let province = ary.province
    let city = ary.city
    console.log(country, province, city);
    wx.login({
      async success(res) {
        try {
          const {
            data
          } = await request({
            url: 'Applets_cp.ashx',
            method: "GET",
            data: {
              param: '{"iv": "' + e.detail.iv + '","encryptedData":"' + e.detail.encryptedData + '", "code": "' + res.code + '","Route": "getUinfo","SrUID":"' + that.data.SrUID + '","country":"' + country + '","province":"' + province + '","city":"' + city + '"}'
            }
          })
          console.log(data);
          if (data.status == 200) {
            let obj = JSON.parse(data.data)
            console.log(obj);
            that.setData({
              SrUID: obj.UID,
              HeadImg: obj.HeadImg,
              Headname: unescape(obj.name),
              userInfo: obj,
            })
            wx.setStorageSync('token', obj.TK)
            wx.setStorageSync('SrUID', obj.UID)
            that.hideModal()
          }

        } catch (err) {
          console.log(err);
          that.setData({
            msg: err.msg
          })
          that.popTest()
        }
      }
    })
  },
  getToken() {
    let that = this
    let token = wx.getStorageSync('token')
    if (token) {

    } else {
      // that.showModal()
      that.getcode()
    }
  },
  goMyBuy() {
    let that = this
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/myBuy/myBuy'
      })
    } else {
      that.goLogin()
    }
  },
  goMyLooked() {
    let that = this
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/myLooked/myLooked'
      })
    } else {
      that.goLogin()
    }

  },
  goMyCollected() {
    let that = this
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/myCollected/myCollected'
      })
    } else {
      that.goLogin()
    }

  },
  goMyCoupon() {
    let that = this
    let token = wx.getStorageSync('token')
    console.log(token);
    if (token) {
      wx.navigateTo({
        url: '/pages/myCoupon/myCoupon'
      })
    } else {
      that.goLogin()
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
    let that = this
    wx.showModal({
      title: '提示',
      content: '您尚未登录，前往登录',
      success: function (res) {
        if (res.confirm) {
          that.showModal()

        } else {

        }
      }
    })
  },
})