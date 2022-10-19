const Common = bus => ({
  emit: {
    updateLocalStorage: d => bus.emit('form_updateLocalStorage', d)
  },
  on: {
    updateLocalStorage: cb => bus.on('form_updateLocalStorage', cb),
  },
})

export default Common