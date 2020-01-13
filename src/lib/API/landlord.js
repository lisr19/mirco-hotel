import { fetch, post, patch, del } from '../http'


// 房东订单列表
export function getRoomOrderByUser (params) {
  return fetch('orderList/owner', params)
}
// 房东订单详情
export function getOrderDetails (params) {
  return fetch('roomOrder/detail', params)
}

// 房东房源列表
export function getHomeList (params) {
  return fetch('homeStay/listByUser', params)
}

// 房东房源下房间列表
export function getRoomList (params) {
  return fetch('room/list', params)
}
// 添加民宿
export function addHomeStay (params) {
  return post('homeStay/add', params)
}
// 民宿详情
export function getHomeDetail (params) {
  return fetch('homeStay/detail', params)
}

// 房间详情
export function getRoomDetail (params) {
  return fetch('room/detail', params)
}

// 删除民宿
export function delHomeStay (params) {
  return del('homeStay/del', params)
}
// 删除民宿房间
export function delRoom (params) {
  return del('room/del', params)
}

// 修改民宿信息
export function upHomeStay (params) {
  return patch('homeStay/update', params)
}

// 主题列表
export function subjectList (params) {
  return fetch('subject/list', params)
}

// 配套设施类型
export function faciTypeList (params) {
  return fetch('facilityServiceType/list', params)
}

// 配套设施服务
export function faciList (params) {
  return fetch('facilityServices/list', params)
}
// 添加配套设施
export function addFaciServices (params) {
  return post('hotelFacilityServices/add', params)
}

// 批量添加配套设施
export function addManyFaciServices (params) {
  return post('hotelFacilityServices/addMany', params)
}

// 批量删除配套设施
export function delManyFaciServices (params) {
  return del('hotelFacilityServices/deleteMany', params)
}


// 添加民宿房间
export function addRoom (params) {
  return post('room/add', params)
}

// 编辑民宿房间
export function editRoom (params) {
  return patch('room/update', params)
}

// 添加民宿房间配套设施
export function addRoomFaci (params) {
  return post('roomFacilityServices/add', params)
}

// 添加民宿房间规则
export function addRoomRules(params) {
  return post('roomRules/add', params)
}
// 修改民宿房间规则
export function updateRoomRules(params) {
  return patch('roomRules/update', params)
}




