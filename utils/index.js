// this.data.form['templateUrl'] = objParam2Str(app.getGlobal('query'), 'pages/index/index')

export function objParam2Str(obj, defaultStr = '') {
  if (typeof obj !== 'object') return defaultStr
  let str = ''
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      str += `${key}=${value}&`
    }
  }
  str = str.slice(0, -1)
  return defaultStr.includes('?') ? defaultStr + '&' + str : defaultStr + '?' + str
}

export function changeRpx(str = "") {
  if (typeof str !== 'string') str = str.toString();
  let nospace = str.trim();
  return nospace.replace(/(-?\d+)(px)/g, (a, b) => b * 2 + 'rpx')
}

export function getKebabCase(str) {
  return str.replace(/[A-Z]/g, function (item) {
    return '-' + item.toLowerCase()
  })
}

export function objStyle2Str(obj) {
  let str = ''
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const value = changeRpx(obj[key]);
      str = str + getKebabCase(key) + ':' + value + ';'
    }
  }
  return str
}

export function isLink(val) {
  if (typeof val !== 'string') return false
  let pattern = /^((https:|http:|:)?\/\/)(?:[\da-z.-]+)\.(?:[a-z.]{2,6})(?:\/\w\.-]*)*\/?/;
  let isLink = pattern.test(val);
  return isLink;
}