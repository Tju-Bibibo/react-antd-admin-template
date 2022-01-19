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
import { tableList, deleteItem,editItem,newItem,uploadScore } from "@/api/exam_table";
import EditExamForm from "./forms/editExamForm"
import NewExamForm from "./forms/newExamForm";
import UploadScoreForm from "./forms/uploadScoreForm";
import { Link, Router } from "react-router-dom";
import { logRoles } from "@testing-library/react";
import { gradeMap} from "@/utils/global";
const { Column } = Table;
const { Panel } = Collapse
const { RangePicker } = DatePicker;
class TableComponent extends Component {
  _isMounted = false; // 这个变量是用来标志当前组件是否挂载
  state = {
    list: [],
    loading: false,
    total: 0,
    listQuery: {
      pageNumber: 1,
      pageSize: 10,
      exam_name: "", //模糊查询名称
      begin_time: "",
      end_time: ""
    },
    examEditModalVisible: false,
    examEditModalLoading: false,
    examNewModalVisible: false,
    examNewModalLoading: false,
    scoreUploadModalVisible: false,
    scoreUploadModalLoading: false,
    currentRowData: {
      id: 0,
      exam_name: "",
      exam_date:"",
      exam_desc:"",
      grade_list:"",
      is_show_rank:0,
      is_show_desc:0
    }
  };
  
  fetchData = () => {
    this.setState({ loading: true });
    console.log(this.state.listQuery);
    tableList(this.state.listQuery).then((response) => {
      this.setState({ loading: false });
      console.log(response.data);
      const list = response.data.data.data;
      const total = response.data.data.total;
      if (this._isMounted) {
        this.setState({ list, total });
      }
    });
  };
  componentDidMount() {
    this._isMounted = true;
    this.fetchData();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  filterExamNameChange = (e) => {
    let value = e.target.value
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        exam_name:value,
      }
    }));
  };
  onPickerChange=(date, dateString)=>{
    console.log("data",date,"dateString",dateString);
    //这两个参数值antd自带的参数
    console.log("dateString",dateString[0],"dateString",dateString[1]);
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        begin_time:dateString[0],
        end_time:dateString[1],
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
  handleDeleteExam = (row) => {
    deleteItem({id:row.id}).then(res => {
      message.success("删除成功")
      this.fetchData();
    })
  }
  handleEditExam = (row) => {
    this.setState({
      currentRowData:Object.assign({}, row),
      examEditModalVisible: true,
    });
  };
  handleNewExam = () => {
    this.setState({
      examNewModalVisible: true,
    });
  }
  handleUploadScore = (row) => {
    this.setState({
      currentRowData:Object.assign({}, row),
      scoreUploadModalVisible: true,
    });
  }
  handleViemScore = (id) => {
    console.log(id);
    this.props.history.push({pathname:'/score_table', state:{exam_id:id}});
  }


  handleEditExamOk = _ => {
    const { form } = this.editExamFormRef.props;
    console.log(form);
    form.validateFields((err, fieldsValue) => {
      if (err) {
        console.log(err)
        return;
      }
      const values = {
        ...fieldsValue,
        // 'star': "".padStart(fieldsValue['star'], '★'),
        'exam_date': fieldsValue['exam_date'].format('YYYY-MM-DD'),
        'grade_list':fieldsValue['grade_list'].join(",")
      };
      this.setState({ examEditModalLoading: true, });
      editItem(values).then((response) => {
        form.resetFields();
        this.setState({ examEditModalVisible: false, examEditModalLoading: false });
        message.success("编辑成功!")
        this.fetchData()
      }).catch(e => {
        message.success("编辑失败,请重试!")
      })
      
    });
  };

  handleEditExamCancel = _ => {
    this.setState({
      examEditModalVisible: false,
    });
  };

  handleNewExamOk = _ => {
    const { form } = this.newExamFormRef.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = {
        ...fieldsValue,
        // 'star': "".padStart(fieldsValue['star'], '★'),
        'exam_date': fieldsValue['exam_date'].format('YYYY-MM-DD'),
        'grade_list':fieldsValue['grade_list'].join(",")
      };
      this.setState({ examNewModalLoading: true, });
      newItem(values).then((response) => {
        form.resetFields();
        this.setState({ examNewModalVisible: false, examNewModalLoading: false });
        message.success("新建成功!")
        this.fetchData()
      }).catch(e => {
        message.success("新建失败,请重试!")
      })
      
    });
  };

  handleNewExamCancel = _ => {
    this.setState({
      examNewModalVisible: false,
    });
  };
  handleUploadScoreOk = _ => {
    const { form } = this.uploadScoreFormRef.props;
    console.log(form);
    const { fileList } = this.uploadScoreFormRef.state;
    console.log(fileList);
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      let formdata = new FormData()
      formdata.append('file', fileList[0])
      formdata.append('exam_id',fieldsValue['exam_id'])
      formdata.append('grade_id',fieldsValue['grade_list'])
      
      console.log(formdata)
      this.setState({ scoreUploadModalLoading: true, });
      uploadScore(formdata).then((response) => {
        form.resetFields();
        this.setState({ scoreUploadModalVisible: false, scoreUploadModalLoading: false });
        message.success("上传成功!")
        // this.fetchData()
      }).catch(e => {
        message.success("上传失败,请重试!")
      })
      
    });
    this.uploadScoreFormRef.setState({
      fileList:[]
    })
  };

  handleUploadScoreCancel = _ => {
    this.setState({
      scoreUploadModalVisible: false,
    });
  };
  render() {
    const title = (
      <span>
        <Button type='primary' onClick={this.handleNewExam}>添加考试</Button>
      </span>
    )
    return (
      <div className="app-container">
        <Collapse defaultActiveKey={["1"]}>
          <Panel header="筛选" key="1">
            <Form layout="inline">
              <Form.Item label="考试名称:">
                <Input onChange={this.filterExamNameChange} />
              </Form.Item>
              <Form.Item label="日期范围:" width={100}>
                <RangePicker  onChange={this.onPickerChange} />
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
        <Card title={title}>
        <Table
          bordered
          rowKey={(record) => record.id}
          dataSource={this.state.list}
          loading={this.state.loading}
          pagination={false}
        >
          <Column title="序号" dataIndex="id" key="id" width={50} align="center" sorter={(a, b) => a.id - b.id}/>
          <Column title="考试名称" dataIndex="exam_name" key="exam_name" width={200} align="center"/>
          <Column title="考试日期" dataIndex="exam_date" key="exam_date" width={100} align="center"/>
          <Column title="考试说明" dataIndex="exam_desc" key="exam_desc" width={200} align="center"/>
          <Column title="年级列表" dataIndex="grade_list" key="grade_list" width={200} align="center" render={(grade_list) =>{
                    var gradeNumList = grade_list.split(",")
                    var gradeChlist = []
                    for (let i of gradeNumList){
                      gradeChlist.push(gradeMap.get(Number(i)))
                    }
                    return gradeChlist.join(",")
          }}/>
          <Column title="是否展示排名" dataIndex="is_show_rank" key="is_show_rank" width={100} align="center" render={(is_show_rank) =>{
              if (is_show_rank === 0){
                return "否"
              }else{
                return "是"
              }
          }}/>
          <Column title="是否展示说明" dataIndex="is_show_desc" key="is_show_desc" width={100} align="center" render={(is_show_desc) =>{
              if (is_show_desc === 0){
                return "否"
              }else{
                return "是"
              }
          }}/>
            {/* //render={(status) => {
            // let color =
            //   status === "published" ? "green" : status === "deleted" ? "red" : "";

            // return (
            //   <Tag color={color} key={status}>
            //     {status}
            //   </Tag>
            // );
          // }}/> */}
          <Column title="操作" key="action" width={195} align="center"render={(text, row) => (
            <span>
              <Button type="primary" shape="circle" icon="eye" title="查看分数" onClick={this.handleViemScore.bind(null,row.id)}/>
              <Divider type="vertical" />
              <Button type="primary" shape="circle" icon="upload" title="上传分数" onClick={this.handleUploadScore.bind(null,row)}/>
              <Divider type="vertical" />
              <Button type="primary" shape="circle" icon="edit" title="编辑" onClick={this.handleEditExam.bind(null,row)}/>
              <Divider type="vertical" />
              <Button type="primary" shape="circle" icon="delete" title="删除" onClick={this.handleDeleteExam.bind(null,row)}/>
            </span>
          )}/>
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
        <EditExamForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={formRef => this.editExamFormRef = formRef}
          visible={this.state.examEditModalVisible}
          confirmLoading={this.state.examEditModalLoading}
          onCancel={this.handleEditExamCancel}
          onOk={this.handleEditExamOk}
        />  
        <NewExamForm
          //currentRowData={this.state.currentRowData}
          wrappedComponentRef={formRef => this.newExamFormRef = formRef}
          visible={this.state.examNewModalVisible}
          confirmLoading={this.state.examNewModalLoading}
          onCancel={this.handleNewExamCancel}
          onOk={this.handleNewExamOk}
        />  
        <UploadScoreForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={formRef => this.uploadScoreFormRef = formRef}
          visible={this.state.scoreUploadModalVisible}
          confirmLoading={this.state.scoreUploadModalLoading}
          onCancel={this.handleUploadScoreCancel}
          onOk={this.handleUploadScoreOk}
        />  
      </div>
    );
  }
}

export default TableComponent;
