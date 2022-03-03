export function localGet(key: string) {
  const value = window.localStorage.getItem(key)
  try {
    const text = window.localStorage.getItem(key)
    return text ? JSON.parse(text) : null
  } catch (error) {
    return value
  }
}

export function localSet(key: string, value: any) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function localRemove(key: string) {
  window.localStorage.removeItem(key)
}

/**
 * 单张图片上传
 */
export const uploadImgServer = 'http://backend-api-02.newbee.ltd/manage-api/v1/upload/file'

/**
 * 多张图片上传
 */
export const uploadImgsServer = 'http://backend-api-02.newbee.ltd/manage-api/v1/upload/files'

/**
 * 返回图片路径
 * @param url 图片路径
 * @returns 真实路径
 */
export function prefix(url: string) {
  if (url && url.startsWith('http')) {
    // 当 url 以 http 开头时候，我们返回原路径
    return url
  }
  // 否则，我们给路径添加 host，如下
  return `http://backend-api-02.newbee.ltd${url}`
}

/**
 * 返回顶部
 */
export function goTop() {
  const main = document.querySelector('.main') as Element
  main.scrollTop = 0
}
