import EventBus from "./bus"

const Common = (bus: EventBus) => ({
  emit: {
    updateLocalStorage: (d: any) => bus.emit('form_updateLocalStorage', d)
  },
  on: {
    updateLocalStorage: (cb: (d?: any) => void) => bus.on('form_updateLocalStorage', cb),
  },
})

export default Common