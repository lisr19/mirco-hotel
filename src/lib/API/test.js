import { fetch, post, patch, del } from '../http'


// 列表
export function getList (params) {
  return fetch('user/list', params)
}

export function Add (params) {
  return post('user/add', params)
}

export function Del (params) {
  return post('user/del', params)
}
export function update (params) {
  return post('user/update', params)
}

