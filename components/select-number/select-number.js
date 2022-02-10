import Api from '../../api/index'
import AllCity from '../../assets/js/city';

let allNums = []

Component({
  properties: {
    cjData: {
      type: Object | null,
      value: null,
      observer() {
        // newVal 是属性更新后的新值，oldVal 是更新前的旧值
        this.initIpNumber()
      }
    }
  },
  data: {
    cityInfo: [],
    multiIndex: [0, 0, 0],
    multiArr: [],
    multiText: [],
    multiStr: '',
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
      const tag = e.currentTarget.dataset.tag
      this.setData({ searchNum: tag, selectRule: '全部' })
      this.getNumber()
    },
    handleSelectRule(e) {
      const rule = e.currentTarget.dataset.rule
      this.setData({ searchNum: '', selectRule: rule })
      this.showLoading()
      this.getNumber()
    },
    bindNumInput(e) {
      const iptVal = e.detail.value;
      this.setData({ searchNum: iptVal })
    },
    async getPrettyMixItem() {
      const param = {
        pid: this.data.cjData.pid,
        searchNum: this.data.searchNum,
        productCode: this.data.cjData.productCode,
        sysOrderId: this.data.cjData.pageId,
        prettyType: this.data.selectRule
      }
      if (Array.isArray(this.data.multiText) && this.data.multiText.length > 1) {
        param.province = this.data.multiText[0]
        param.city = this.data.multiText[1]
      }
      let res = await Api.Choujin.getPrettyMixItem(param);
      if (res.code === '0000' && Array.isArray(res.data.numItem)) {
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
    handleSelect(phoneItem) {
      this.setData({
        selectPhone: phoneItem ? phoneItem.num : '',
        selectNumItem: phoneItem || ''
      })
    },
    // 锁号
    async lockNumber(e) {
      console.log(e);
      const phoneIndex = e.currentTarget.dataset.phoneIndex
      const phoneItem = e.currentTarget.dataset.phoneItem

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
      if (res.code === '0') {
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
    setMultiArr(defaultCity) {
      if (this.data.cityInfo.length === 0) return
      const cityInfo = this.data.cityInfo
      if (Array.isArray(defaultCity) && defaultCity.length > 0) {
        const province = defaultCity[0] ? defaultCity[0] : ''
        const city = defaultCity[1] ? defaultCity[1] : ''
        const area = defaultCity[2] ? defaultCity[2] : ''
        let provinces = [], provinceIndex = 0, citys = [], cityIndex = 0, areas = [], areaIndex = 0
        for (let index1 = 0; index1 < cityInfo.length; index1++) {
          const element1 = cityInfo[index1];
          provinces.push(element1.cityName)
          if (element1.cityName === province) {
            provinceIndex = index1
          }
        }
        const provinceObj = cityInfo[provinceIndex];
        for (let index2 = 0; index2 < provinceObj.cityInfo.length; index2++) {
          const element2 = provinceObj.cityInfo[index2];
          citys.push(element2.cityName)
          if (element2.cityName === city) {
            cityIndex = index2
          }
        }
        const cityObj = provinceObj.cityInfo[cityIndex];
        for (let index3 = 0; index3 < cityObj.cityInfo.length; index3++) {
          const element3 = cityObj.cityInfo[index3];
          areas.push(element3.cityName)
          if (element3.cityName === area) {
            areaIndex = index3
          }
        }
        this.setData({
          multiArr: [provinces, citys],
          multiIndex: [provinceIndex, cityIndex],
          multiText: [provinces[provinceIndex], citys[cityIndex]],
          multiStr: [provinces[provinceIndex], citys[cityIndex]].join(' ')
          // multiArr: [provinces, citys, areas],
          // multiIndex: [provinceIndex, cityIndex, areaIndex],
          // multiText: [provinces[provinceIndex], citys[cityIndex], areas[areaIndex]]
        })
      } else {
        const provinces = cityInfo.map(v => v.cityName) || []
        const citys = cityInfo[0].cityInfo ? cityInfo[0].cityInfo.map(v => v.cityName) : []
        // const areas = cityInfo[0].cityInfo[0]?.cityInfo?.map(v => v.cityName) || []
        this.setData({
          multiArr: [provinces, citys],
          multiIndex: [0, 0],
          multiText: [provinces[0], citys[0]],
          multiStr: [provinces[0], citys[0]].join(' ')
          // multiArr: [provinces, citys, areas],
          // multiIndex: [0, 0, 0],
          // multiText: [provinces[0], citys[0], areas[0]]
        })
      }
    },
    getMultiText(multiIndex) {
      if (Array.isArray(this.data.multiArr) && this.data.multiArr.length === 0) return []
      const province = this.data.multiArr[0][multiIndex[0]]
      const city = multiIndex[1] == 0 || multiIndex[1] ? this.data.multiArr[1][multiIndex[1]] : ''
      // const area = multiIndex[2] == 0 || multiIndex[2] ? this.data.multiArr[2][multiIndex[2]] : ''
      let multiText = []
      if (province) multiText.push(province)
      if (city) multiText.push(city)
      // if (area) multiText.push(area)
      return multiText
    },
    //改变归属地
    pickerColumnMulti(e) {
      switch (e.detail.column) {
        case 0:
          this.setMultiArr(this.getMultiText([e.detail.value]))
          break;
        case 1:
          this.setMultiArr(this.getMultiText([this.data.multiIndex[0], e.detail.value]))
          break;
        // case 2:
        //   this.setMultiArr(this.getMultiText([this.data.multiIndex[0], this.data.multiIndex[1], e.detail.value]))
        //   break;
      }
      this.getNumber()
    },
    async initIpNumber() {
      if (Array.isArray(this.data.ipRegion) && this.data.ipRegion.length > 0) return
      const res = await Api.Choujin.getIpRegion({})
      if (res.data) {
        const ctInfo = res.data || {}
        const arr = []
        if (ctInfo.province) arr.push(ctInfo.province)
        if (ctInfo.city) arr.push(ctInfo.city)
        if (ctInfo.district) arr.push(ctInfo.district)
        this.setData({ ipRegion: arr })
        this.setMultiArr(arr)
        this.getNumber()
      }
    }
  },
  async attached() {
    this.setData({ cityInfo: AllCity })
  }
})