import { fetch, post, patch, del } from '../http'

// 注册
export function newUser (params) {
    return post('user/register', params)
}

// 登录
export function userLogin (params) {
    return post('user/login', params)
}

// 修改密码
export function newPass (params) {
  return fetch('user/resetPassword', params)
}

// 用户修改信息
export function userUptate (params) {
    return patch('user/update', params)
}

// 用户信息
export function getUserDate (params) {
  return fetch('user/list', params)
}

//发送短信
export function SMS (params) {
  return fetch('SMS/sendCode1', params)
}
