import { fetch, post, patch, del } from '../http'


// 房间列表
export function getRoomList (params) {
  return fetch('room/list', params)
}

// 房间详情
export function getRoomDetail (params) {
  return fetch('room/detail', params)
}

// 房间配套设施
export function getRoomServices (params) {
  return fetch('roomFacilityServices/list', params)
}
// 查询空房
export function getVacantRoom (params) {
  return fetch('room/vacant', params)
}

// 搜索房间列表
export function getRoomList1 (params) {
  return fetch('room/list1', params)
}

