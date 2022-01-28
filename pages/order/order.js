import MD5 from "../../assets/js/md5"
import Api from '../../api/index'

Page({
  data: {
    list: [],
    telephone: '',
    smsText: '获取验证码',
    channel: "haoKa",
    secretKey: "e706a9d5e4d146af6ca84b423f586b8c",
    sysOrderStatus: 0,
  },
  async getOrderList() {
    const params = {
      channel: this.data.channel,
      sign: MD5(this.data.telephone + this.data.channel + this.data.secretKey),
      sysOrderStatus: this.data.sysOrderStatus,
      telephone: this.data.telephone
    }
    const res = await Api.Choujin.orderList(params)
    if (res) this.setData({ list: res })
  },
  onLoad(option) {
    if (option.phone) {
      this.setData({ telephone: option.phone })
      this.getOrderList()
    }
  }
});