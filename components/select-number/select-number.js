import Api from '../../api/index'

Component({
  properties: {
    cjData: {
      optionalTypes: ['Object', 'Null'],
      value: null
    }
  },
  data: {
    hadCityInfo: false,
    cityInfo: [],
    ipRegion: [],
    region: [],
    searchNum: '',
    phoneList: [],
    selectNumItem: '',
    selectPhone: '',
    loading: false,
    timer: 0,
    showBottomBtn: true
  },
  observers: {
    'cjData.productCode': function (productCode) {
      if (this.data.hadCityInfo) return
      if (productCode) {
        this.getNumber()
        this.getCityInfo(productCode)
      }
    }
  },
  methods: {
    bindNumInput(e) {
      const iptVal = e.detail.value;
      this.setData({ searchNum: iptVal })
      clearTimeout(this.data.timer)
      this.data.timer = setTimeout(() => {
        this.getNumber()
      }, 300);
    },
    handleSelect(phoneItem) {
      this.setData({
        selectPhone: phoneItem?.num || '',
        selectNumItem: phoneItem || ''
      })
    },
    async getCityInfo(productCode) {
      const res = await Api.Choujin.getCityInfo({ productCode: productCode })
      if (res && res.length > 0) {
        this.data.hadCityInfo = true
        this.setData({ cityInfo: res })
        this.setMultiArr(this.data.ipRegion)
      }
    },
    getNumber() {
      this.setData({ loading: true })
      this.getHandleNoItem().then(res => {
        this.setData({ phoneList: res || [], selectNumItem: res[0] || '', selectPhone: res[0]?.num || '' })
      }).finally(() => {
        this.setData({ loading: false })
      })
    },
    async getHandleNoItem() {
      const param = {
        pid: this.data.cjData.pid,
        searchNum: this.data.searchNum,
        productCode: this.data.cjData.productCode,
        sysOrderId: this.data.cjData.pageId,
      }
      let res = await Api.Choujin.getHandleNoItem(param);
      if (res.code === '0000' && Array.isArray(res.data?.numItem)) {
        return res.data.numItem.slice(0, 8)
      }
      return []
    },
    changeNumber() {
      if (this.data.loading) return;
      this.setData({ loading: true })
      this.getHandleNoItem().then(res => {
        this.setData({ phoneList: res || [], selectNumItem: res[0] || '', selectPhone: res[0]?.num || '' })
      }).finally(() => {
        this.setData({ loading: false })
      })
    },
    async lockNumber(e) {
      const phoneIndex = e.currentTarget?.dataset?.phoneIndex
      const phoneItem = e.currentTarget?.dataset?.phoneItem
      tt.showLoading({ title: '拼命抢号中...', mask: true })
      const params = {
        handleNo: phoneItem.num,
        pid: this.data.cjData.pid,
        productCode: this.data.cjData.productCode,
        sysOrderId: this.data.cjData.pageId,
      }
      const res = await Api.Choujin.lockNumber(params)
      tt.hideLoading()
      if (res?.code === '0') {
        this.handleSelect(phoneItem)
      } else {
        tt.showToast({
          title: '您下手太慢了，该号码已被别的用户选取！',
          icon: 'none',
        })
        this.data.phoneList.splice(phoneIndex, 1)
        this.setData({ phoneList: this.data.phoneList })
      }
    },
  }
})