import { ApiModule } from "./types"
import { Common, ApiModuleCommon } from './common';

const BaseUrl = "https://test-card.liulianglf.cn"

const createInterface = (arr: ApiModule[]) => {
  const Interface: Record<string, any> = {};
  arr.forEach(v => {
    Interface[v.name] = (param: unknown, config: Record<string, any>) => {
      return new Promise((resolve, reject) => {
        post({
          url: BaseUrl + v.url,
          data: param,
          getAllData: v.getAllData,
          getError: v.getError,
          ...config
        }).then(res => resolve(res)).catch(error => reject(error))
      })
    }
  })
  return Interface
}
export const CommonApi = createInterface(Common) as ApiModuleCommon

export function post(config: Record<string, any>) {
  return new Promise((resolve, reject) => {
    tt.request({
      url: config.url,
      method: 'POST',
      data: config.data,
      ...config,
      success(res) {
        if (res.statusCode !== 200) {
          console.log(res);
          tt.hideLoading({});
          tt.showModal({
            content: res.errMsg || '网络繁忙',
            showCancel: false
          })
          return
        }
        let result: any = res.data;
        if (config.getAllData) return resolve(result);
        switch (result.code) {
          case "0": //  成功
            return resolve(result.data);
          case "0000": //  成功
            return resolve(result.data);
          default: // 失败
            if (config.getError) return reject('fail')
            tt.hideLoading({});
            tt.showModal({
              content: result.message || result.msg || '服务器繁忙',
              showCancel: false
            })
        }
      },
      fail(error) {
        console.log(error);
        if (config.getError) return reject(error)
        tt.hideLoading({});
        tt.showModal({
          content: '服务器繁忙',
          showCancel: false
        })
      }
    })
  })
}