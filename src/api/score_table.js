import request from '@/utils/request'
export function tableList(data) {
  return request({
    url: '/jiaYinAdmin/score/getScoreList',
    method: 'get',
    params:data
  })
}

// export function deleteItem(data) {
//   return request({
//     url: '/exam_table/delete',
//     method: 'post',
//     data
//   })
// }
// export function editItem(data) {
//   return request({
//     url: '/exam_table/edit',
//     method: 'post',
//     data
//   })
// }
// export function newItem(data) {
//   return request({
//     url: '/exam_table/new',
//     method: 'post',
//     data
//   })
// }

// export function uploadScore(data) {
//   return request({
//     url: '/exam_table/upload',
//     method: 'post',
//     data
//   })
// }