import Api from '../../api/index'

let allNums = []

Component({
  properties: {
    cjData: {
      type: Object | null,
      value: null,
      observer() {
        // newVal 是属性更新后的新值，oldVal 是更新前的旧值
        this.getNumber()
      }
    }
  },
  data: {
    hadCityInfo: false,
    cityInfo: [],
    ipRegion: [],
    searchNum: '',
    phoneList: [],
    selectNumItem: '',
    selectPhone: '',
    loading: false,
    showPNBtn: true,
    nextLoading: false,
    timer: 0,
    numIndex: 0,
    numSize: 20
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
      this.getPrettyMixItem().then(res => {
        this.setData({ phoneList: res.slice(0, this.data.numSize) || [] })
      }).finally(() => {
        this.setData({ loading: false })
      })
    },
    async getPrettyMixItem() {
      const param = {
        pid: this.data.cjData.pid,
        searchNum: this.data.searchNum,
        productCode: this.data.cjData.productCode,
        sysOrderId: this.data.cjData.pageId,
        city: "广州市",
        prettyType: "ALL1",
        province: "广东省"
      }
      let res = await Api.Choujin.getPrettyMixItem(param);
      if (res.code === '0000' && Array.isArray(res.data?.numItem)) {
        allNums = res.data.numItem.map(v => ({ ...v, isLock: false }))
        return allNums
      }
      return []
    },
    initAllNum(resNum) {
      allNums = Array.isArray(resNum) ? resNum : []
      this.setData({ numIndex: 0 })
      this.setPhoneList()
    },
    setPhoneList() {
      if (allNums.length === 0) {
        this.data.showPNBtn = false
        return this.setData({ phoneList: [], showPNBtn: false })
      } else {
        this.setData({ showPNBtn: true })
      }
      const startIndex = this.data.numIndex * this.data.numSize
      const endIndex = this.data.numIndex * this.data.numSize + this.data.numSize
      const pagePhoneList = allNums.slice(startIndex, endIndex);
      if (Array.isArray(pagePhoneList) && pagePhoneList.length === 0) {
        this.setData({ nextLoading: true })
        return this.changeNumber(true)
      }
      this.setData({ phoneList: pagePhoneList.filter(v => !v.isLock) })
    },
    getPrePage() {
      // 上一页
      this.setData({ numIndex: this.data.numIndex - 1 })
      this.setPhoneList()
    },
    getNextPage() {
      // 下一页
      this.setData({ numIndex: this.data.numIndex + 1 })
      this.setPhoneList()
    },
    changeNumber() {
      if (this.data.loading) return;
      this.setData({ loading: true })
      this.getPrettyMixItem().then(res => {
        this.initAllNum(res)
      }).finally(() => {
        this.setData({ loading: false, nextLoading: false })
      })
    },
    async lockNumber(e) {
      console.log(e);
      const phoneIndex = e.currentTarget?.dataset?.phoneIndex
      const phoneItem = e.currentTarget?.dataset?.phoneItem

      // this.data.phoneList.splice(phoneIndex, 1)
      // allNums[numSize * this.data.numIndex + phoneIndex].isLock = true

      // this.setData({ phoneList: this.data.phoneList })

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