App({
  onLaunch(options) {
    if (options.query.pid) this.globalData.pid = options.query.pid
    this.globalData.query = options.query
  },
  setGlobal(key, value) {
    this.globalData[key] = value
  },
  getGlobal(key) {
    return this.globalData[key] || null
  },
  globalData: {
    pid: '25416',
    query: '',
    ipRegion: []
  }
})
