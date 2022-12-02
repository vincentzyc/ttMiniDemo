
// class Tracker {
class Tracker {
  constructor(miniType, siteId) {
    this.miniType = miniType // 小程序类型
    this.configTrackerSiteId = siteId
    this.configTrackerUrl = '//dw-m.jetmobo.com/tj'
    this.configRequestMethod = 'GET'
    this.configRequestContentType = 'application/x-www-form-urlencoded; charset=UTF-8'
    this.uvidStorageKey = 'MatomoUvid'
    this.uvid = ''
    this.pvid = ''
  }
  /**
  * 初始化一个跟踪器
  * @param {String} siteId
  */
  initTracker(obj) {
    // obj.siteId
  }
  trackPageView() {

  }
  trackEvent(category, action, name, value) {
    // Category and Action are required parameters
    if (!isNumberOrHasLength(category) || !isNumberOrHasLength(action)) {
      logConsoleError('Error while logging event: Parameters `category` and `action` must not be empty or filled with whitespaces');
      return false;
    }
    var request = getRequest(buildEventRequest(category, action, name, value));
    sendRequest(request);
  }
  buildEventRequest(category, action, name, value) {
    return 'e_c=' + encodeURIComponent(category)
      + '&e_a=' + encodeURIComponent(action)
      + (isDefined(name) ? '&e_n=' + encodeURIComponent(name) : '')
      + (isDefined(value) ? '&e_v=' + encodeURIComponent(value) : '')
      + '&ca=1';
  }
  getRequest(request) {
    const now = new Date()
    request += '&idsite=' + configTrackerSiteId +
      '&rec=1' +
      '&r=' + String(Math.random()).slice(2, 8) + // keep the string to a minimum
      '&h=' + now.getHours() + '&m=' + now.getMinutes() + '&s=' + now.getSeconds() +
      '&url=' + getUrl(currentUrl) +
      (configReferrerUrl.length ? '&urlref=' + encodeURIComponent(purify(configReferrerUrl)) : '') +
      (isNumberOrHasLength(configUserId) ? '&uid=' + encodeURIComponent(configUserId) : '') +
      '&_id=' + cookieVisitorIdValues.uuid +

      '&_idn=' + cookieVisitorIdValues.newVisitor + // currently unused
      (campaignNameDetected.length ? '&_rcn=' + encodeURIComponent(campaignNameDetected) : '') +
      (campaignKeywordDetected.length ? '&_rck=' + encodeURIComponent(campaignKeywordDetected) : '') +
      '&_refts=' + referralTs +
      (String(referralUrl).length ? '&_ref=' + encodeURIComponent(purify(referralUrl.slice(0, referralUrlMaxLength))) : '') +
      (charSet ? '&cs=' + encodeURIComponent(charSet) : '') +
      '&send_image=0';
    return request
  }
  // 获取url，把参数拼接
  getUrl() {

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
      logConsoleError('getStorageSync调用失败');
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
      logConsoleError('setStorageSync调用失败');
    }
  }
  // 生成 uvid
  generateRandomUuid() {
    var browserFeatures = {}
    try {
      browserFeatures = this.miniType.getSystemInfoSync(true)
    } catch (error) {
      logConsoleError("获取系统信息失败: ", error);
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
            callback && callback()
          },
          fail(res) {
            logConsoleError('request fail', miniType.request)
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
    logConsoleError('初始化matomo时，小程序类型 "miniType" 、站点id "siteId" 不能为空');
    return false;
  }
  var tracker = new Tracker(miniType, siteId);
  tracker.initVisitorId()
  // asyncTrackers.push(tracker);

  // _paq = applyMethodsInOrder(_paq, applyFirst);

  // // apply the queue of actions
  // for (iterator = 0; iterator < _paq.length; iterator++) {
  //   if (_paq[iterator]) {
  //     apply(_paq[iterator]);
  //   }
  // }

  // // replace initialization array with proxy object
  // _paq = new TrackerProxy();

  // Matomo.trigger('TrackerAdded', [tracker]);
  miniType.matomo = tracker
  return tracker;
}

/*
 * Removes hash tag from the URL
 *
 * URLs are purified before being recorded in the cookie,
 * or before being sent as GET parameters
 */
function purify(url) {
  var targetPattern;
  // we need to remove this parameter here, they wouldn't be removed in Matomo tracker otherwise eg
  // for outlinks or referrers
  url = removeUrlParameter(url, configVisitorIdUrlParameter);
  if (configDiscardHashTag) {
    targetPattern = new RegExp('#.*');
    return url.replace(targetPattern, '');
  }
  return url;
}

/**
 * Logs an error in the console.
 *  Note: it does not generate a JavaScript error, so make sure to also generate an error if needed.
 * @param message
 */
function logConsoleError(message) {
  // needed to write it this way for jslint
  var consoleType = typeof console;
  if (consoleType !== 'undefined' && console && console.error) {
    console.error(message);
  }
}
/*
 * Is property defined?
 */
function isDefined(property) {
  var propertyType = typeof property;

  return propertyType !== 'undefined';
}

/*
 * Is property a function?
 */
function isFunction(property) {
  return typeof property === 'function';
}

/*
 * Is property an object?
 * @return bool Returns true if property is null, an Object, or subclass of Object (i.e., an instanceof String, Date, etc.)
 */
function isObject(property) {
  return typeof property === 'object';
}

function isString(property) {
  return typeof property === 'string' || property instanceof String;
}

function isNumber(property) {
  return typeof property === 'number' || property instanceof Number;
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