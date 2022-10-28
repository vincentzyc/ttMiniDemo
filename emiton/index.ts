import EventBus from "./bus"

import Image from "./widget/image"

import Common from "./common"

const eventBus = new EventBus()

export default {
  busImage: Image(eventBus),
  busCommon: Common(eventBus),
}


