import Mock from "mockjs";
let List = [];
const count = 100;

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: i,
      exam_name:"@ctitle(5,10)",
      exam_date:"@date",
      exam_desc:"@ctitle(5,10)",
      grade_list:"6,7,8",
      is_show_rank:"@integer(0,1)",
      is_show_desc:"@integer(0,1)",
    })
  );
}
export default {
  tableList: (config) => {
    const { pageNumber, pageSize, begin_time, end_time, exam_name } = JSON.parse(
      config.body
    );
    let start = (pageNumber - 1) * pageSize;
    let end = pageNumber * pageSize;
    console.log(begin_time);
    let mockList = List.filter((item) => {
      if (exam_name && item.exam_name.indexOf(exam_name) < 0) return false;
      if (end_time&&begin_time &&(item.exam_date > end_time || item.exam_date <begin_time)) return false;
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
  deleteItem: (config) => {
    const { id } = JSON.parse(config.body);
    const item = List.filter((item) => item.id === id);
    const index = List.indexOf(item[0]);
    List.splice(index, 1);
    return {
      code: 20000,
    };
  },
  editItem: (config) => {
    const data = JSON.parse(config.body);
    const { id } = data;
    const item = List.filter((item) => item.id === id);
    const index = List.indexOf(item[0]);
    List.splice(index, 1, data);
    return {
      code: 20000,
    };
  },
  newItem: (config) => {
    const data = JSON.parse(config.body);
    const { id } = data;
    data.id = 0
    const item = List.filter((item) => item.id === 0);
    const index = List.indexOf(item[0]);
    List.splice(index, 1, data);
    return {
      code: 20000,
    };
  },
};
