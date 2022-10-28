import EventBus from "../bus"

const Image = (bus: EventBus) => ({
  on: {
    testOn: (cb: (d?: any) => void) => bus.on('image_test', cb)
  },
  emit: {
    testEmit: (d: any) => bus.emit('image_test', d)
  }
})

export default Image