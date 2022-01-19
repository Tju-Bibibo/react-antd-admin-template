import request from '@/utils/request'
export function tableList(data) {
  return request({
    url: '/jiaYinAdmin/exam/getExamList',
    method: 'get',
    params:data,
  })
}

export function deleteItem(data) {
  return request({
    url: '/jiaYinAdmin/exam/deleteExam',
    method: 'post',
    data
  })
}
export function editItem(data) {
  return request({
    url: '/jiaYinAdmin/exam/updateExam',
    method: 'post',
    data
  })
}
export function newItem(data) {
  return request({
    url: '/jiaYinAdmin/exam/createExam',
    method: 'post',
    data
  })
}

export function uploadScore(data) {
  return request({
    url: '/jiaYinAdmin/score/uploadScore',
    //headers:{'Content-Type':'multipart/form-data;charset=UTF-8'},
    method: 'post',
    data
  })
}