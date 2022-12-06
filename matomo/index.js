class Tracker {
  constructor(miniType, siteId) {
    this.miniType = miniType // 小程序类型
    this.configTrackerSiteId = siteId
    this.configTrackerUrl = 'https://dw-m.jetmobo.com/tj'
    this.configRequestMethod = 'GET'
    this.configRequestContentType = 'application/x-www-form-urlencoded; charset=UTF-8'
    this.uvidStorageKey = 'MatomoUvid'
    this.uvid = ''
    this.pvid = ''
    this.pageTitle = ''
    this.pageRoute = ''
    this.pageUrl = ''
    this.pageQuery = {}
  }
  reportMatomo(action, name) {
    if (!isNumberOrHasLength(action)) {
      logConsoleError('action must not be empty filled with whitespaces');
      return false;
    }
    if (!this.pageTitle) return logConsoleError('title must not be empty filled with whitespaces')
    var appIdRoute = ''
    if (TMAConfig && TMAConfig.appId) appIdRoute = TMAConfig.appId + "/" + this.pageRoute
    var category = this.pageTitle + '-' + (this.pageQuery.id || appIdRoute) + '-' + (this.pageQuery.pid || '')
    this.trackEvent(category, action, name)
  }
  trackPageView(pageData) {
    if (isNumberOrHasLength(pageData) || (isObject(pageData) && pageData.title)) {
      this.setPageData(pageData)
      this.logPageView()
    } else {
      logConsoleError('trackPageView: page title must not be empty filled with whitespaces')
    }
  }
  setPageData(pageData) {
    if (isDefined(getCurrentPages) && isFunction(getCurrentPages)) {
      var pageList = getCurrentPages()
      var lastPage = isArray(pageList) && pageList.length > 0 ? pageList[pageList.length - 1] : null
      if (lastPage) {
        this.pageRoute = lastPage.route || ''
        this.pageQuery = lastPage.options || {}
      }
    }
    if (isString(pageData)) this.pageTitle = pageData
    if (isObject(pageData)) {
      this.pageTitle = pageData.title || ''
      if (pageData.url) this.pageRoute = pageData.url
      if (pageData.query) this.pageQuery = pageData.query
    }
    this.pageUrl = this.getQueryUrl()
    if (!this.pageTitle) logConsoleError('trackPageView: page title must not be empty')
  }
  logPageView() {
    this.pvid = this.generateUniqueId()
    var request = this.getRequestObj({ action_name: this.pageTitle })
    this.sendXmlHttpRequest(request)
  }
  trackEvent(category, action, name, value) {
    if (!isNumberOrHasLength(category) || !isNumberOrHasLength(action)) {
      logConsoleError('logging event: Parameters `category` and `action` must not be empty or filled with whitespaces');
      return false;
    }
    var request = this.getRequestObj(this.buildEventRequest(category, action, name, value));
    this.sendXmlHttpRequest(request);
  }
  buildEventRequest(category, action, name, value) {
    var eventObj = {
      e_c: category,
      e_a: action,
      ca: 1
    }
    if (isDefined(name)) eventObj.e_n = name
    if (isDefined(value)) eventObj.e_v = value
    return eventObj
  }
  getRequestObj(request) {
    var now = new Date()
    var requestObj = {
      idsite: this.configTrackerSiteId,
      rec: 1,
      r: String(Math.random()).slice(2, 8), // keep the string to a minimum
      h: now.getHours(),
      m: now.getMinutes(),
      s: now.getSeconds(),
      url: this.pageUrl,
      _id: this.uvid,
      pv_id: this.pvid,
      send_image: 0
    }
    for (const key in request) {
      if (Object.hasOwnProperty.call(request, key)) {
        requestObj[key] = request[key];
      }
    }
    return requestObj
  }
  // 把所有参数拼接组合成url
  getQueryUrl() {
    var url = this.pageRoute.indexOf('?') > -1 ? this.pageRoute + '&' : this.pageRoute + '?'
    for (const key in this.pageQuery) {
      if (Object.hasOwnProperty.call(this.pageQuery, key)) {
        const value = this.pageQuery[key];
        url = url + key + '=' + value + '&'
      }
    }
    return url.slice(0, -1)
  }
  initVisitorId() {
    if (this.uvid) return this.uvid
    try {
      var storageUvid = this.miniType.getStorageSync(this.uvidStorageKey);
      if (storageUvid) {
        this.uvid = storageUvid
        return storageUvid
      }
    } catch (error) {
      logConsoleError('getStorageSync fail');
    }
    var randomUuid = this.generateRandomUuid()
    this.uvid = randomUuid
    this.setVisitorIdStorage(randomUuid)
    return randomUuid
  }
  setVisitorIdStorage(uuid) {
    try {
      this.miniType.setStorageSync(this.uvidStorageKey, uuid);
    } catch (error) {
      logConsoleError('setStorageSync fail');
    }
  }
  // 生成 uvid
  generateRandomUuid() {
    var browserFeatures = {}
    try {
      browserFeatures = this.miniType.getSystemInfoSync(true)
    } catch (error) {
      logConsoleError("getSystemInfoSync fail: ", error);
    }
    return sha1(
      JSON.stringify(browserFeatures) +
      (new Date()).getTime() +
      Math.random()
    ).slice(0, 16);
  }
  // 生成 pvid
  generateUniqueId() {
    var id = '';
    var chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charLen = chars.length;
    var i;
    for (i = 0; i < 6; i++) {
      id += chars.charAt(Math.floor(Math.random() * charLen));
    }
    return id;
  }
  sendXmlHttpRequest(request, callback) {
    setTimeout(() => {
      try {
        this.miniType.request({
          url: this.configTrackerUrl,
          data: request,
          method: this.configRequestMethod,
          header: {
            'content-type': this.configRequestContentType
          },
          success(res) {
            callback && callback(res)
          },
          fail(res) {
            logConsoleError('request fail', res)
          }
        })
      } catch (error) {
        logConsoleError('request catch error', error)
      }
    }, 50)
  }
}

export default function matomo(miniType, siteId) {
  if (isObjectEmpty(miniType) || !isNumberOrHasLength(siteId)) {
    logConsoleError('while init matomo，`miniType` and `siteId` must not be empty or filled with whitespaces');
    return false;
  }
  var tracker = new Tracker(miniType, siteId);
  tracker.initVisitorId()
  return tracker;
}

function logConsoleError(message) {
  var consoleType = typeof console;
  if (consoleType !== 'undefined' && console && console.error) {
    console.error(message);
  }
}
function logConsoleWran(message) {
  var consoleType = typeof console;
  if (consoleType !== 'undefined' && console && console.warn) {
    console.warn(message);
  }
}
function isDefined(property) {
  var propertyType = typeof property;

  return propertyType !== 'undefined';
}
function isFunction(property) {
  return typeof property === 'function';
}
function isObject(property) {
  return typeof property === 'object';
}
function isString(property) {
  return typeof property === 'string' || property instanceof String;
}
function isNumber(property) {
  return typeof property === 'number' || property instanceof Number;
}
function isArray(property) {
  return Object.prototype.toString.call(property).slice(8, -1) === 'Array'
}
function isNumberOrHasLength(property) {
  return isDefined(property) && (isNumber(property) || (isString(property) && property.length));
}
function isObjectEmpty(property) {
  if (!property) {
    return true;
  }

  var i;
  var isEmpty = true;
  for (i in property) {
    if (Object.prototype.hasOwnProperty.call(property, i)) {
      isEmpty = false;
    }
  }

  return isEmpty;
}
function utf8_encode(argString) {
  return decodeURIComponent(encodeURIComponent(argString))
}
function sha1(str) {
  // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
  // + namespaced by: Michael White (http://getsprink.com)
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   jslinted by: Anthon Pang (https://matomo.org)

  var
    rotate_left = function (n, s) {
      return (n << s) | (n >>> (32 - s));
    },

    cvt_hex = function (val) {
      var strout = '',
        i,
        v;

      for (i = 7; i >= 0; i--) {
        v = (val >>> (i * 4)) & 0x0f;
        strout += v.toString(16);
      }

      return strout;
    },

    blockstart,
    i,
    j,
    W = [],
    H0 = 0x67452301,
    H1 = 0xEFCDAB89,
    H2 = 0x98BADCFE,
    H3 = 0x10325476,
    H4 = 0xC3D2E1F0,
    A,
    B,
    C,
    D,
    E,
    temp,
    str_len,
    word_array = [];

  str = utf8_encode(str);
  str_len = str.length;

  for (i = 0; i < str_len - 3; i += 4) {
    j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 |
      str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
    word_array.push(j);
  }

  switch (str_len & 3) {
    case 0:
      i = 0x080000000;
      break;
    case 1:
      i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
      break;
    case 2:
      i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
      break;
    case 3:
      i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) << 8 | 0x80;
      break;
  }

  word_array.push(i);

  while ((word_array.length & 15) !== 14) {
    word_array.push(0);
  }

  word_array.push(str_len >>> 29);
  word_array.push((str_len << 3) & 0x0ffffffff);

  for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
    for (i = 0; i < 16; i++) {
      W[i] = word_array[blockstart + i];
    }

    for (i = 16; i <= 79; i++) {
      W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
    }

    A = H0;
    B = H1;
    C = H2;
    D = H3;
    E = H4;

    for (i = 0; i <= 19; i++) {
      temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    for (i = 20; i <= 39; i++) {
      temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    for (i = 40; i <= 59; i++) {
      temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    for (i = 60; i <= 79; i++) {
      temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    H0 = (H0 + A) & 0x0ffffffff;
    H1 = (H1 + B) & 0x0ffffffff;
    H2 = (H2 + C) & 0x0ffffffff;
    H3 = (H3 + D) & 0x0ffffffff;
    H4 = (H4 + E) & 0x0ffffffff;
  }

  temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

  return temp.toLowerCase();
}