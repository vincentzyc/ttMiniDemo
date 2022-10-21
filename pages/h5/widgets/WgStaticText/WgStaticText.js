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
      app.busImage.on.testOn(d => {
        console.log(d)
      })
      // const link = e.currentTarget.dataset.otherlink
      // if (isLink(link)) {
      //   tt.navigateTo({
      //     url: '/pages/iframe/iframe?url=' + encodeURIComponent(link),
      //   })
      // }
    }
  },
  attached() {
    console.log(666)
    // app.busImage.on.testOn(d => {
    //   console.log(d)
    // })
  }
})