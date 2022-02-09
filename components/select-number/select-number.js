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
    tagItems: ['66', '88', '520', '521', '1314'],
    selectRule: '全部',
    ruleItems: [
      { label: '全部', value: '全部' },
      { label: 'AABA', value: 'AABA' },
      { label: 'AAAAA', value: 'AAAAA' },
      { label: 'AAA+', value: 'AAA+' },
      { label: 'AACBA', value: 'AACBA' },
      { label: 'AABB', value: 'AABB' },
      { label: 'ABCD', value: 'ABCD' },
      { label: 'AA&BB', value: 'AA&BB' },
      { label: 'ABAA', value: 'ABAA' },
      { label: 'ABAB', value: 'ABAB' },
    ],
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
    showLoading() {
      clearTimeout(this.data.timer)
      this.data.timer = setTimeout(() => {
        tt.showLoading({ title: "号码获取中..." });
      }, 300);
    },
    hideLoading() {
      clearTimeout(this.data.timer)
      tt.hideLoading()
    },
    handleHotSearch(e) {
      const tag = e.currentTarget?.dataset?.tag
      this.setData({ searchNum: tag, selectRule: '全部' })
      this.getNumber()
    },
    handleSelectRule(e) {
      const rule = e.currentTarget?.dataset?.rule
      this.setData({ searchNum: '', selectRule: rule })
      this.showLoading()
      this.getNumber()
    },
    bindNumInput(e) {
      const iptVal = e.detail.value;
      this.setData({ searchNum: iptVal })
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
    async getPrettyMixItem() {
      const param = {
        pid: this.data.cjData.pid,
        searchNum: this.data.searchNum,
        productCode: this.data.cjData.productCode,
        sysOrderId: this.data.cjData.pageId,
        prettyType: this.data.selectRule,
        city: "广州市",
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
    // 选择号码
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
        return this.getNumber()
      }
      this.setData({ phoneList: pagePhoneList.filter(v => !v.isLock) })
    },
    // 上一页
    getPrePage() {
      this.setData({ numIndex: this.data.numIndex - 1 })
      this.setPhoneList()
    },
    // 下一页
    getNextPage() {
      this.setData({ numIndex: this.data.numIndex + 1 })
      this.setPhoneList()
    },
    // 获取号码
    getNumber() {
      if (this.data.loading) return;
      this.setData({ loading: true })
      this.showLoading()
      this.getPrettyMixItem().then(res => {
        this.initAllNum(res)
      }).finally(() => {
        this.setData({ loading: false, nextLoading: false })
        this.hideLoading()
      })
    },
    // 搜索
    changeNumber() {
      if (this.data.loading) return;
      this.setData({ selectRule: '全部' })
      this.getNumber()
    },
    // 锁号
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