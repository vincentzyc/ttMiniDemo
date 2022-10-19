import { objStyle2Str, isLink } from '../../utils/index'
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
      const link = e.currentTarget.dataset.otherlink
      if (isLink(link)) {
        tt.navigateTo({
          url: '/pages/iframe/iframe?url=' + encodeURIComponent(link),
        })
      }
    }
  }
})