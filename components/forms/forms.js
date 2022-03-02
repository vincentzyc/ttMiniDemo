import AllCity from '../../assets/js/city';
import ruleList from '../../assets/js/validate.js';
import Api from '../../api/index'

const app = getApp();

Component({
  properties: {
    cjData: {
      optionalTypes: ['Object', 'Null'],
      value: null
    },
    selectNumItem: {
      optionalTypes: ['Object', 'Null'],
      value: null
    },
    selectCityStr: {
      optionalTypes: String,
      value: ''
    }
  },
  data: {
    agrList: [{
      title: '《个人信息保护政策》',
      url: 'https://h5.lipush.com/h5/index.html?id=2021102815452100034'
    }, {
      title: '《单独同意书》',
      url: 'https://h5.lipush.com/h5/index.html?id=2021102817561400047'
    }, {
      title: '《入网许可协议》',
      url: 'https://h5.lipush.com/h5/index.html?id=2022022414052500011'
    }, {
      title: '《个人信息收集证明》',
      url: 'https://h5.lipush.com/h5/index.html?id=2022022414061500012'
    }],
    checkbox1: false,
    hadPhone: false,
    cityInfo: [],
    ipRegion: [],
    multiIndex: [0, 0, 0],
    multiArr: [],
    multiText: [],
    multiStr: '',
    searchNum: '',
    phoneList: [],
    loading: false,
  },
  // observers: {
  //   multiText(value) {
  //     console.log(value);
  //     if (Array.isArray(value)) this.setData({ multiStr: value.join(' ') })
  //   }
  // },
  methods: {
    // toggleNumPicker() {
    //   const elNumPopup = this.selectComponent('#num-popup')
    //   elNumPopup.data.show ? elNumPopup.closePopup() : elNumPopup.openPopup()
    // },
    bindPhoneInput(e) {
      const val = e.detail.value;
      const valiRes = ruleList.contactNumber(val)
      if (valiRes === true) {
        this.setData({ hadPhone: true })
      }
    },
    getMultiText(multiIndex) {
      if (Array.isArray(this.data.multiArr) && this.data.multiArr.length === 0) return []
      const province = this.data.multiArr[0][multiIndex[0]]
      const city = multiIndex[1] == 0 || multiIndex[1] ? this.data.multiArr[1][multiIndex[1]] : ''
      const area = multiIndex[2] == 0 || multiIndex[2] ? this.data.multiArr[2][multiIndex[2]] : ''
      let multiText = []
      if (province) multiText.push(province)
      if (city) multiText.push(city)
      if (area) multiText.push(area)
      return multiText
    },
    async getCityInfo(productCode) {
      const res = await Api.Choujin.getCityInfo({ productCode: productCode })
      if (res && res.length > 0) {
        this.setData({ cityInfo: res })
        this.setMultiArr(this.data.ipRegion)
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
          multiArr: [provinces, citys, areas],
          multiIndex: [provinceIndex, cityIndex, areaIndex],
          multiText: [provinces[provinceIndex], citys[cityIndex], areas[areaIndex]],
          multiStr: [provinces[provinceIndex], citys[cityIndex], areas[areaIndex]].join(' ')
        })
      } else {
        const provinces = cityInfo.map(v => v.cityName) || []
        const citys = cityInfo[0].cityInfo ? cityInfo[0].cityInfo.map(v => v.cityName) : []
        const areas = cityInfo[0].cityInfo[0] ? cityInfo[0].cityInfo[0].cityInfo.map(v => v.cityName) : []
        this.setData({
          multiArr: [provinces, citys, areas],
          multiIndex: [0, 0, 0],
          multiText: [provinces[0], citys[0], areas[0]],
          multiStr: [provinces[0], citys[0], areas[0]].join(' ')
        })
      }
    },
    pickerColumnMulti(e) {
      switch (e.detail.column) {
        case 0:
          this.setMultiArr(this.getMultiText([e.detail.value]))
          break;
        case 1:
          this.setMultiArr(this.getMultiText([this.data.multiIndex[0], e.detail.value]))
          break;
        case 2:
          this.setMultiArr(this.getMultiText([this.data.multiIndex[0], this.data.multiIndex[1], e.detail.value]))
          break;
      }
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
    formatParam(params) {
      if (Array.isArray(params.selectCity) && params.selectCity.length > 0) {
        const arrCity = this.getMultiText(params.selectCity)
        params.province = arrCity[0] || "";
        params.city = arrCity[1] || "";
        params.district = arrCity[2] || "";
      }
      params.pageId = this.data.cjData.pageId
      params.pid = this.data.cjData.pid
      params.handleNo = this.data.selectNumItem.num
      return params
    },
    async submit(e) {
      const params = this.formatParam(e.detail.value)
      const valiDateRes = this.valiDate(params);
      if (valiDateRes !== true) {
        return tt.showToast({ title: valiDateRes, icon: 'none' })
      }
      console.log(params);
      tt.showLoading({ title: '正在提交', mask: true })
      let res = await Api.Choujin.submitForm(params);
      tt.hideLoading()
      if (res.responseCode === '0') {
        tt.navigateTo({ url: '/pages/success/success' })
      } else {
        tt.showModal({
          showCancel: false,
          content: res.msg || '提交失败，请稍后重试'
        })
      }
    },
    toggleAgr(event) {
      const link = event.currentTarget.dataset.agrlink
      tt.navigateTo({
        url: '/pages/iframe/iframe?url=' + encodeURIComponent(link),
      })
    }
  },
  async ready() {
    const ipRegion = app.getGlobal('ipRegion')
    this.setData({ cityInfo: AllCity })
    if (Array.isArray(ipRegion) && ipRegion.length > 0) this.setData({ ipRegion: ipRegion })
    if (this.data.cjData.productCode) this.getCityInfo(this.data.cjData.productCode)
  }
})