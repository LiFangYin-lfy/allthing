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
    storeList: [],
    star: 4,
    it_cloose: false,
    index: 0,
    Psize: 10,
    page: 1,
    Uid: '',
    TK: '',
    is_have: 0,
    count: 1
  },
  onLoad: function (options) {
    console.log(options);
    let that = this
    let token = wx.getStorageSync('token')
    let Uid = wx.getStorageSync('SrUID')
    if (token && Uid) {
      that.setData({
        Uid
      })
      that.getmyList()
    } else {
      if (options) {
        let obj = options
        wx.setStorageSync('token', obj.TK)
        wx.setStorageSync('SrUID', obj.UID)
      }
    }

  },
  onShow: function () {
    let that = this


  },
  goback() {
    wx.navigateBack()
  },
  async getmyList() {
    let that = this
    let token = wx.getStorageSync('token')
    let Psize = that.data.Psize
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'Applets_cp.ashx',
        data: {
          param: '{"Route": "getProListBuy", "Uid": "' + that.data.Uid + '", "Psize" :' + that.data.Psize + ',"Pindex": ' + that.data.page + ',"TK":"' + token + '"}'
        }
      })
      console.log(data);
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
      that.setData({
        storeList: that.data.storeList.concat(data)
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
    wx.navigateTo({
      url: '/pages/out/out?i=' + it
    })
  },
  onReachBottom: function () {
    let that = this
    let newpageNum = that.data.page;
    let is_have = that.data.is_have
    if (is_have == 0) {
      that.setData({
        msg: '已到底部~'
      })
      that.popTest()
    } else {
      newpageNum++;
      that.setData({
        page: newpageNum
      })
      that.getmyList()
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