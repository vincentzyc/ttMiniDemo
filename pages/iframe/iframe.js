Page({
  data: {
    url: 'https://h5.lipush.com/h5/complaint/index.html',
  },
  onLoad: function (options) {
    if (options) {
      const url = options.url || ''
      if (url) this.setData({ url: decodeURIComponent(url) });
    }
  }
})
