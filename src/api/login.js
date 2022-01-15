import request from '@/utils/request'

export function reqLogin(data) {
  return request({
    url: '/jiaYinAdmin/auth/login',
    method: 'post',
    data
  })
}

export function reqLogout(data) {
  return request({
    url: '/jiaYinAdmin/auth/logout',
    method: 'post',
    data
  })
}