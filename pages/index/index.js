import {CommonApi} from '../../api/index'

const app = getApp()

Page({
  elForm: null,
  data: {
    pid: "",
    cjData: null,
  },
  handleClick() {
    this.elForm.openPopup()
  },
  refForm(ref) {
    // 存储自定义组件实例，方便以后调用
    this.elForm = ref;
  },
  goOrder() {
    // const url = 'https://card.liulianglf.cn/sim/index.html#/login'
    // tt.navigateTo({
    //   url: '/pages/iframe/iframe?url=' + encodeURIComponent(url),
    // })
    // tt.navigateTo({ url: '/pages/login/login' })
    tt.matomo.reportMatomo('点击订单查询','pages/login/login')
  },
  complaint() {
    const url = 'https://h5.lipush.com/h5/complaint/index.html'
    tt.navigateTo({
      url: '/pages/iframe/iframe?url=' + encodeURIComponent(url),
    })
  },
  // openService() {
  //   tt.showModal({
  //     title: "客服电话",
  //     content: "4008168562",
  //     showCancel: false
  //   })
  // },
  async getPageId() {
    const params = { pid: this.data.pid }
    let res = await CommonApi.pageIdLocation(params);
    if (res) {
      res.pid = this.data.pid
      this.setData({ cjData: res });
    }
  },
  onRefreshPageId: function () {
    this.getPageId()
  },
  onLoad() {
    tt.matomo.trackPageView('测试页面标题')
    const options = tt.getLaunchOptionsSync()
    if (options.query) {
      const pid = options.query.pid || app.getGlobal('pid') ||'29015'
      this.setData({ pid: pid });
    }
    this.getPageId()
  }
})
