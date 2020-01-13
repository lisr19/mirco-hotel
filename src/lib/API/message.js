import { fetch, post, patch, del } from '../http'

// 信息列表
export function getChatList (params) {
    return fetch('pushMessage/list', params)
}

//获取与某人的聊天记录
export function getChatBySomeone (params) {
  return fetch('pushMessage/listChatWithUser', params)
}

//消息列表
export function getMsgList (params) {
  return fetch('pushMessage/chatList', params)
}
