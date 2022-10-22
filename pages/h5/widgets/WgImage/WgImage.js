import { objStyle2Str, isLink } from '../../../../utils/index'

const app = getApp();

Component({
  cpPopup: null,
  data: {
    wgStyle: ''
  },
  properties: {
    wgItem: Object
  },
  observers: {
    "wgItem.style"(newVal) {
      this.setData({
        wgStyle: objStyle2Str(newVal)
      });
    },
  },
  methods: {
    refPopup(ref) {
      // 存储自定义组件实例，方便以后调用
      this.cpPopup = ref;
    },
    goUrl(e) {
      console.log(e, this.data.wgItem)
      this.cpPopup.openPopup()
      // app.busImage.emit.testEmit('HAHA')
      // setTimeout(() => {
      //   app.busImage.emit.testEmit('hehe')
      // }, 1100);
      // const link = e.currentTarget.dataset.otherlink
      // if (isLink(link)) {
      //   tt.navigateTo({
      //     url: '/pages/iframe/iframe?url=' + encodeURIComponent(link),
      //   })
      // }
    }
  }
})