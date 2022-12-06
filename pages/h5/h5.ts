import { CommonApi } from '../../api/index'
import { PageIdLocation } from "../../api/types/common";

const cmsUrl = 'https://test-cms.jetmobo.com/service/content/template/'

const app = getApp()

Page({
  data: {
    wgList: null,
    pid: "31818",
    defaultPid: "31818",
    pdData: null as PageIdLocation | null,
    pgStyle: "background-color: rgba(255, 255, 255, 1)"
  },
  getPgData(id: string | number) {
    tt.request({
      url: cmsUrl + id,
      method: 'GET',
      success: (res: any) => {
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
  async getPageId(pid: string) {
    const params = {
      pid: pid,
      ipLocation: '1'
    }
    let res = await CommonApi.pageIdLocation(params);
    if (res) {
      res.pid = pid
      this.setData({
        pdData: res
      });
    }
  },
  onLoad(options) {
    app.matomo.trackPageView('测试页面标题')
    if (options && options.id) this.getPgData(options.id)
    if (options && options.pid) this.getPageId(options.pid)
  },
  onShow() {
    tt.hideHomeButton({});
  }
})