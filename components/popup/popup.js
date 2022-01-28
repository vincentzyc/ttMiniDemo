Component({
    data: {
        show: false
    },

    methods: {
        openPopup() {
            this.setData({
                show: true
            })
        },
        closePopup() {
            this.setData({
                show: false
            })
        },

        handleContact(e) {
            console.log(e.detail)
        }
    }
})
    // const elYunPopup = this.selectComponent('#yun-popup')
    // elYunPopup.data.show ? this.selectComponent('#yun-popup').closePopup() : this.selectComponent('#yun-popup').openPopup()