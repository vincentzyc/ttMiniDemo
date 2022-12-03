import eventBus from './emiton/index'
// import matomo from './matomo/index'

// matomo(tt, 80)

// console.log(tt.matomo)

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
