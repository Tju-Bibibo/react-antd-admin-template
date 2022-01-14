import React, { Component } from "react";
import {
  Table,
  Tag,
  Form,
  Button,
  Input,
  Collapse,
  Pagination,
  Divider,
  message,
  Select,
  DatePicker,
  Card,
  Icon
} from "antd";
import { tableList} from "@/api/score_table";

const {Option} = Select;
const { Column } = Table;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;
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
const gradeList = [];
for (let [i,j] of gradeMap.entries()) {
  gradeList.push(<Option value={i} >{j}</Option>);
}
class TableComponent extends Component {
  _isMounted = false; // 这个变量是用来标志当前组件是否挂载
  state = {
    list: [],
    loading: false,
    total: 0,
    listQuery: {
      pageNumber: 1,
      pageSize: 10,
      exam_id: undefined,
      stu_code:"",
      grade_list:"",
    },
    currentRowData: {
      id: 0,
      exam_id:0,
      exam_name:"",
      grd_name:"",
      cls_name:0,
      stu_name:"",
      stu_code:0,
      s_yuwen:0,
      s_shuxue:0,
      s_yingyu:0,
      s_wuli:0,
      s_huaxue:0,
      s_shengwu:0,
      s_zhengzhi:0,
      s_lishi:0,
      s_dili:0,
      s_kexue:0,
      s_shehui:0,
      extra:"",
    }
  };
  fetchData = () => {
    this.setState({ loading: true });
    console.log(this.state.listQuery);
    tableList(this.state.listQuery).then((response) => {
      this.setState({ loading: false });
      const list = response.data.data.items;
      const total = response.data.data.total;
      if (this._isMounted) {
        this.setState({ list, total });
      }
    });
  };
  componentDidMount() {
    this._isMounted = true;
    if (this.props.location.state !== undefined){
      console.log(this.props.location.state.exam_id);
      let value = this.props.location.state.exam_id;
      this.setState((state) => ({
        listQuery: {
          ...state.listQuery,
          exam_id:value,
        }
      }),
      () => {
        this.fetchData();
      }
      );
    }else{
      this.fetchData();
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  filterExamIdChange = (e) => {
    let value = e.target.value
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        exam_id:Number(value),
      }
    }));
  };
  filterStuCodeChange = (e) => {
    let value = e.target.value
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        stu_code:value,
      }
    }));
  };
  filterGrdIdChange = (e) => {
    console.log(e);
    let value = e.join(",")
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        grade_list:value,
      }
    }));
  };
  changePage = (pageNumber, pageSize) => {
    this.setState(
      (state) => ({
        listQuery: {
          ...state.listQuery,
          pageNumber,
        },
      }),
      () => {
        this.fetchData();
      }
    );
  };
  changePageSize = (current, pageSize) => {
    this.setState(
      (state) => ({
        listQuery: {
          ...state.listQuery,
          pageNumber: 1,
          pageSize,
        },
      }),
      () => {
        this.fetchData();
      }
    );
  };

  render() {
    return (
      <div className="app-container">
        <Collapse defaultActiveKey={["1"]}>
          <Panel header="筛选" key="1">
            <Form layout="inline">
              <Form.Item label="考试id:" >
                <Input onChange={this.filterExamIdChange} value={this.state.listQuery.exam_id} />
              </Form.Item>
              <Form.Item label="学生身份证号:">
                <Input  onChange={this.filterStuCodeChange} />
              </Form.Item>
              <Form.Item label="年级" >
                <Select
                mode="multiple"
                allowClear
                style={{ width: 150 }}
                placeholder="请选择年级列表"
                // defaultValue={gradeChList}d
                onChange={this.filterGrdIdChange}
                >
                {gradeList}
              </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" icon="search" onClick={this.fetchData}>
                  搜索
                </Button>
              </Form.Item>
            </Form>
          </Panel>
        </Collapse>
        <br />
        <Card>
        <Table
          bordered
          rowKey={(record) => record.id}
          dataSource={this.state.list}
          loading={this.state.loading}
          pagination={false}
          scroll={{ x: true }}
        >
          <Column title="序号" dataIndex="id" key="id" width={100} align="center" sorter={(a, b) => a.id - b.id}/>
          <Column title="学生身份证号" dataIndex="stu_code" key="stu_code" width={200} align="center"/>
          <Column title="学生名称" dataIndex="stu_name" key="stu_name" width={100} align="center"/>
          <Column title="考试id" dataIndex="exam_id" key="exam_id" width={100} align="center"/>
          <Column title="考试名称" dataIndex="exam_name" key="exam_name" width={200} align="center"/>

          <Column title="年级" dataIndex="grd_name" key="grd_name" width={100} align="center"/>
          <Column title="班级" dataIndex="cls_name" key="cls_name" width={100} align="center"/>
          <Column title="语文" dataIndex="s_yuwen" key="s_yuwen" width={100} align="center"/>
          <Column title="数学" dataIndex="s_shuxue" key="s_shuxue" width={100} align="center"/>
          <Column title="英语" dataIndex="s_yingyu" key="s_yingyu" width={100} align="center"/>
          <Column title="物理" dataIndex="s_wuli" key="s_wuli" width={100} align="center"/>
          <Column title="化学" dataIndex="s_huaxue" key="s_huaxue" width={100} align="center"/>
          <Column title="生物" dataIndex="s_shengwu" key="s_shengwu" width={100} align="center"/>
          <Column title="政治" dataIndex="s_zhengzhi" key="s_zhengzhi" width={100} align="center"/>
          <Column title="历史" dataIndex="s_lishi" key="s_lishi" width={100} align="center"/>
          <Column title="科学" dataIndex="s_kexue" key="s_kexue" width={100} align="center"/>
          <Column title="社会" dataIndex="s_shehui" key="s_shehui" width={100} align="center"/>
          <Column title="备注" dataIndex="extra" key="extra" width={300} align="center"/>
          {/* <Column title="操作" key="action" width={195} align="center"render={(text, row) => (
            <span>
              <Button type="primary" shape="circle" icon="eye" title="查看分数" onClick={this.handleUploadScore.bind(null,row)}/>
              <Divider type="vertical" />
            </span>
          )}/> */}
        </Table>
        <br />
        <Pagination
          total={this.state.total}
          pageSizeOptions={["10", "20", "40"]}
          showTotal={(total) => `共${total}条数据`}
          onChange={this.changePage}
          current={this.state.listQuery.pageNumber}
          onShowSizeChange={this.changePageSize}
          showSizeChanger
          showQuickJumper
          hideOnSinglePage={true}
        />
        </Card>
      </div>
    );
  }
}

export default TableComponent;
