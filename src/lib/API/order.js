import { fetch, post, patch, del } from '../http'

// 订单列表
export function getOrderList (params) {
    return fetch('orderList/', params)
}

// 房间订单详情
export function getRoomOrderDetail (params) {
    return fetch('roomOrder/detail', params)
}

// 会议室订单详情
export function getMeetingOrderList (params) {
    return fetch('meetingRoomOrder/detail', params)
}

//删除房间订单
export function delRoomOrder (params) {
    return del('roomOrder/del', params)
}

//删除会议室订单
export function delMeetingOrder (params) {
    return del('meetingRoomOrder/del', params)
}

//更改房间订单状态
export function updataRoomOrder (params) {
    return patch('roomOrder/update', params)
}

//更改会议室订单状态
export function updataMeetingOrder (params) {
    return patch('meetingRoomOrder/updata', params)
}
