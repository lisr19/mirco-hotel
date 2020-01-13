import { fetch, post, patch, del } from '../http'


// 酒店列表
export function getHotelList (params) {
  return fetch('hotel/list', params)
}
// 民宿列表
export function getHomeStayList (params) {
  return fetch('homeStay/list', params)
}

// 酒店详情
export function getHotelDetail (params) {
  return fetch('hotel/detail', params)
}

// 民宿详情
export function getHomeStarDetail (params) {
  return fetch('homeStay/detail', params)
}

// 收藏酒店
export function getColletList (params) {
  return fetch('userCollection/list', params)
}

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

// 获取酒店标签
export function getlistLabels (params) {
  return fetch('hotel/listLabels', params)
}
// 获取民宿标签
export function getHomeListLabels (params) {
  return fetch('homeStay/listLabels', params)
}
