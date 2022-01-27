import ruleList from '../../assets/js/validate.js';
import Api from '../../api/index'

Page({
  data: {
    timer: 0,
    disabledBtn: false,
    telephone: '',
    smsText: '获取验证码',
  },
  smsCount(t) {
    const run = () => {
      if (t > 1) {
        t -= 1;
        this.setData({
          disabledBtn: true,
          smsText: t + "秒重新获取"
        })
      } else {
        clearInterval(this.data.timer);
        this.setData({
          disabledBtn: false,
          smsText: "获取验证码"
        })
      }
    };
    this.data.timer = setInterval(function () {
      run()
    }, 1000)
    run()
  },
  bindNumInput(e) {
    const iptVal = e.detail.value;
    this.setData({ telephone: iptVal })
  },
  async getAuthCode() {
    let params = {
      telephone: this.data.telephone
    };
    const valiDateRes = this.valiDate(params);
    if (valiDateRes !== true) {
      return ks.showToast({ title: valiDateRes, icon: 'none' })
    }
    Api.Choujin.authCode(params)
    this.smsCount(60)
    // 用户体验优化，直接倒计时，不等结果
    // const res = await Api.Choujin.authCode(params)Z
    // if (res.responseCode === '0000') {
    //   this.smsCount(60);
    // } else {
    //   ks.showToast({ title: res.message, icon: 'none' })
    // }
  },
  valiDate(obj) {
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        const element = obj[key];
        if (ruleList[key]) {
          const valiRes = ruleList[key](element)
          if (valiRes !== true) return valiRes
        }
      }
    }
    return true
  },
  async submit(e) {
    const params = e.detail.value
    const valiDateRes = this.valiDate(params);
    if (valiDateRes !== true) {
      return ks.showToast({ title: valiDateRes, icon: 'none' })
    }
    ks.showLoading({ title: '正在登录', mask: true })
    const res = await Api.Choujin.verifyAuthCode(params)
    ks.hideLoading()
    if (res.responseCode === '0000') {
      ks.navigateTo({ url: '/pages/order/order?phone=' + params.telephone })
    } else {
      ks.showToast({ title: res.result || '网络繁忙，请稍后重试', icon: 'none' })
    }
  }
});