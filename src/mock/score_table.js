import Mock from "mockjs";
let List = [];
const count = 100;

var gradeMap = new Map([
  [6,"六年级"],
  [7,"七年级"],
  [8,"八年级"],
  [9,"九年级"],
  [56,"五升六"],
  [67,"六升七"],
  [78,"七升八"],
  [89,"八升九"],
]);
for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: i,
      exam_id:"@integer(9,8)",
      exam_name:"@ctitle(5,10)",
      grd_name:"六年级",
      cls_name:"@integer(10,99)",
      stu_name:"@ctitle(2,3)",
      stu_code:"@integer(10,100)",
      s_yuwen:"@integer(0,100)",
      s_shuxue:"@integer(0,100)",
      s_yingyu:"@integer(0,100)",
      s_wuli:"@integer(0,100)",
      s_huaxue:"@integer(0,100)",
      s_shengwu:"@integer(0,100)",
      s_zhengzhi:"@integer(0,100)",
      s_lishi:"@integer(0,100)",
      s_dili:"@integer(0,100)",
      s_kexue:"@integer(0,100)",
      s_shehui:"@integer(0,100)",
      extra:"@ctitle(20,40)",
    })
  );
}
export default {
  tableList: (config) => {
    const { pageNumber, pageSize, exam_id, stu_code, grade_list } = JSON.parse(
      config.body
    );
    let start = (pageNumber - 1) * pageSize;
    let end = pageNumber * pageSize;
    var gradeChMap = new Map()
    var gradeNumList = grade_list.split(",")
    for (let item of gradeNumList){
      console.log(gradeMap.get(Number(item)));
      gradeChMap.set(gradeMap.get(Number(item)),true)
    }
    let mockList = List.filter((item) => {
      if (exam_id && item.exam_id !== exam_id) return false;
      if (stu_code && item.stu_code !== stu_code) return false;
      if (grade_list && gradeChMap.get(item.grd_name) === undefined ) return false;
      // if (grd_id && item.grd_name !== gradeMap.get(grd_id)) return false;
      // if (end_time&&begin_time &&(item.exam_date > end_time || item.exam_date <begin_time)) return false;
      return true;
    });
    let pageList = mockList.slice(start, end);
    return {
      code: 20000,
      data: {
        total: mockList.length,
        items: pageList,
      },
    };
  },
  // deleteItem: (config) => {
  //   const { id } = JSON.parse(config.body);
  //   const item = List.filter((item) => item.id === id);
  //   const index = List.indexOf(item[0]);
  //   List.splice(index, 1);
  //   return {
  //     code: 20000,
  //   };
  // },
  // editItem: (config) => {
  //   const data = JSON.parse(config.body);
  //   const { id } = data;
  //   const item = List.filter((item) => item.id === id);
  //   const index = List.indexOf(item[0]);
  //   List.splice(index, 1, data);
  //   return {
  //     code: 20000,
  //   };
  // },
  // newItem: (config) => {
  //   const data = JSON.parse(config.body);
  //   const { id } = data;
  //   data.id = 0
  //   const item = List.filter((item) => item.id === 0);
  //   const index = List.indexOf(item[0]);
  //   List.splice(index, 1, data);
  //   return {
  //     code: 20000,
  //   };
  // },
  // uploadScore: (config) => {
  //   return {
  //     code: 20000,
  //   };
  // },
};
