import { objStyle2Str, isLink } from '../../../../utils/index'

const app = getApp();

Component({
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
    goUrl(e) {
      console.log(e)
      app.busImage.emit.testEmit('HAHA')
      setTimeout(() => {
        app.busImage.emit.testEmit('hehe')
      }, 1100);
      // const link = e.currentTarget.dataset.otherlink
      // if (isLink(link)) {
      //   tt.navigateTo({
      //     url: '/pages/iframe/iframe?url=' + encodeURIComponent(link),
      //   })
      // }
    }
  }
})