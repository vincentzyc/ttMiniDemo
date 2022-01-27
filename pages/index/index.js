import Api from '../../api/index'
Page({
  data: {
    pid: "25416",
    cjData: null
  },
  goOrder() {
    // const url = 'https://card.liulianglf.cn/sim/index.html#/login'
    // tt.navigateTo({
    //   url: '/pages/iframe/iframe?url=' + encodeURIComponent(url),
    // })
    tt.navigateTo({ url: '/pages/login/login' })
  },
  openService() {
    tt.showModal({
      title: "客服电话",
      content: "4008168562",
      showCancel: false
    })
  },
  async getPageId() {
    const params = { pid: this.data.pid }
    let res = await Api.Choujin.getPageId(params);
    console.log(res);
    if (res) {
      res.pid = this.data.pid
      this.setData({ cjData: res });
    }
  },
  onRefreshPageId: function () {
    this.getPageId()
  },
  onLoad() {
    const options = tt.getLaunchOptionsSync()
    if (options.query) {
      const pid = options.query.pid || '25416'
      this.setData({ pid: pid });
    }
    this.getPageId()
  }
})
