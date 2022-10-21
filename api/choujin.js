// export const cjBaseUrl = "https://card-api.liulianglf.cn"
export const cjBaseUrl = "https://test-card.liulianglf.cn"

export const Choujin = [{
    name: "submitForm",
    url: "/service/onlineSaleCard/handleOrder"
}, {
    name: "getPageId",
    url: "/service/jimPenn/page_id"
}, {
    name: "getNewPageId",
    url: "/service/jimPenn/pageIdLocation"
}, {
    name: "getCityInfo",
    url: "/api/product/h5_city_info"
}, {
    name: "getAuthCode",
    url: "/service/onlineSaleCard/getAuthCode"
}, {
    name: "collectData",
    url: "/service/onlineSaleCard/collect"
}, {
    name: "disperOrder",
    url: "/service/onlineSaleCard/disperOrder"
}, {
    name: "getHandleNoItem",
    url: "/service/onlineSaleCard/getHandleNoItem",
    getError: true,
    getAllData: true
}, {
    name: "addJsInfo",
    url: "/service/onlineSaleCard/addJsInfo"
}, {
    name: "getIpRegion",
    url: "/service/onlineSaleCard/getIpRegion",
    getError: true,
    getAllData: true
}, {
    name: "getNewIpRegion",
    url: "https://region.cooldl.cn/service/onlineSaleCard/getIpRegion",
    getError: true,
    getAllData: true
}, {
    name: "broadbandOrder",
    url: "/api/onlineSaleBroadband/handleOrder"
}, {
    name: "collectOrder",
    url: "/service/onlineSaleCard/collectOrder"
}, {
    name: "getPrettyNoItem",
    url: "/service/onlineSaleCard/getPrettyNoItem",
    getError: true,
    getAllData: true
}, {
    name: "getPrettyMixItem",
    url: "/service/onlineSaleCard/getPrettyMixItem",
    getError: true,
    getAllData: true
}, {
    name: "lockNumber",
    url: "/service/onlineSaleCard/lockNumber"
}, {
    name: "getJumpPage",
    url: "/api/jumpPage/getJumpPage"
}, {
    name: "wapPrePay",
    url: "/api/pay/wapPrePay",
    getAllData: true
}, {
    name: "getProtocol",
    url: "/api/operator/getProtocol",
    type: "get",
    getAllData: true
}, {
    name: "authCode",
    url: "/api/appOrderDetails/authCode"
}, {
    name: "orderList",
    url: "/api/appOrderDetails/list"
}, {
    name: "verifyAuthCode",
    url: "/api/appOrderDetails/verifyAuthCode"
}]


export default Choujin