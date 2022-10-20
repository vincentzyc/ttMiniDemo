import eventBus from './emiton/index'
App({
  ...eventBus,
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
    pid: '29015',
    // pid: '18922', 测试线pid
    query: '',
    ipRegion: []
  }
})
