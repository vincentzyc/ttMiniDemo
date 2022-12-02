
class Matomo {
  constructor(miniType) {
    this.miniType = miniType || tt // 小程序类型
    this.configTrackerUrl = 'https://dw-m.jetmobo.com/tj'
    this.configRequestMethod = 'GET'
    this.configRequestContentType = 'application/x-www-form-urlencoded; charset=UTF-8'
    this.browserFeatures = {}
  }
  /**
   * 初始化一个跟踪器
   * @param {String} siteId
   */
  initTracker(siteId) {

  }
  // 生成 uvid
  generateRandomUuid() {
    var browserFeatures = this.miniType.getSystemInfoSync()
    return hash(
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
            console.log('request fail', miniType.request)
          }
        })
      } catch (error) {
        console.log('request catch error', error)
      }
    }, 50)
  }
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