import Api from '../../api/index'

const cmsUrl = 'https://test-cms.jetmobo.com/service/content/template/'

Page({
  data: {
    wgList: null,
    pid: "31818",
    defaultPid: "31818",
    pdData: null,
    pgStyle: "background-color: rgba(255, 255, 255, 1)"
  },
  getPgData(id) {
    tt.request({
      url: cmsUrl + id,
      method: 'GET',
      success: res => {
        const templateValue = JSON.parse(res.data.data.templateValue)
        const compList = templateValue.list
        this.setData({
          wgList: compList,
          pgStyle: `background-color:${templateValue.style.backgroundColor}`
        })
      },
      fail(res) {
        console.log("调用失败", res.errMsg);
      }
    })
  },
  async getPageId() {
    const params = {
      pid: this.data.pid,
      ipLocation: '1'
    }
    let res = await Api.Choujin.getNewPageId(params);
    if (res) {
      res.pid = this.data.pid
      this.setData({
        pdData: res
      });
    }
  },
  onRefreshPageId: function () {
    this.getPageId()
  },
  onLoad(options) {
    if (options && options.id) this.getPgData(options.id)
    if (options && options.pid) {
      const pid = options.pid || this.data.defaultPid
      this.setData({
        pid: pid
      });
    }
    this.getPageId()
  },
  onShow() {
    tt.hideHomeButton();
  }
})