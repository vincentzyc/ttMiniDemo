class EventBus {
  constructor() {
    this.bus = {}
    this.temBus = {}
  }
  // on 监听
  on(type, fun) {
    if (typeof fun !== 'function') {
      console.error('fun is not a function');
      return;
    }
    (this.bus[type] = this.bus[type] || []).push(fun);
    if (this.temBus[type]) {
	  for (let event of this.temBus[type]) {
        event.call();
      }
      delete this.temBus[type]
    }
  }
  // emit 触发
  emit(type, ...param) {
    let cache = this.bus[type];
    if (cache) {
      for (let event of cache) {
        event.call(this, ...param);
      }
    } else {
      (this.temBus[type] = this.temBus[type] || []).push(() => this.emit(type, ...param))
    }
  }
  // off 释放
  off(type, fun) {
    let events = this.bus[type];
    if (!events) return;
    let i = 0,
      n = events.length;
    for (i; i < n; i++) {
      let event = events[i];
      if (fun === event) {
        events.splice(i, 1);
        break;
      }
    }
  }
}

export default EventBus