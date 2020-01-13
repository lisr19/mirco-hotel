import { fetch, post, patch, del } from '../http'

// 添加评价
export function postNewCommen (params) {
    return post('evaluation/add', params)
}

// 评价列表
export function getCommentList (params) {
    return fetch('evaluation/list', params)
}
// 酒店所有评价列表
export function getEvaluationsList (params) {
  return fetch('hotel/listEvaluations', params)
}

// 民宿所有评价列表
export function getEvalListByHome (params) {
  return fetch('homeStay/listEvaluations', params)
}

// 删除评价
export function delComment (params) {
    return del('evaluation/del', params)
}

// 修改评价
export function updataComment (params) {
    return patch('evaluation/update', params)
}

// 添加收藏
export function addCollect (params) {
  return post('userCollection/add', params)
}

// 取消收藏
export function delCollect (params) {
  return del('userCollection/del', params)
}

// 查询当前酒店或民宿是否收藏
export function userCollection (params) {
  return fetch('userCollection/getId', params)
}

// 下订单
export function addOrder (params) {
  return post('roomOrder/add', params)
}

// 下订单
export function getSliderList (params) {
  return fetch('slider/list', params)
}


