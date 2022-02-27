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