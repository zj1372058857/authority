import request from '@/utils/request'

export function initData(url, data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}
// export function initData(url, params) {
//   return request({
//     url: url,
//     method: 'get',
//     params
//   })
// }
