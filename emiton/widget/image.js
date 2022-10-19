const Image = bus => ({
  on: {
    testOn: cb => bus.on('image_test', cb)
  },
  emit: {
    testEmit: d => bus.emit('image_test', d)
  }
})

export default Image