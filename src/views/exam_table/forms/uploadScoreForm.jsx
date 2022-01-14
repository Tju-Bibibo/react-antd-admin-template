import React, { Component } from "react";
import { Form, Input, DatePicker, Select, Rate, Modal,Radio ,Upload,message,Button,Icon} from "antd";
import moment from "moment";
import "moment/locale/zh-cn";
import UploadExcelComponent from "@/components/UploadExcel";
moment.locale("zh-cn");
const { Option } = Select;

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
class UploadScoreForm extends Component {
  state = {
    fileList: [],
  };
  render() {
    const {fileList} = this.state;
    const {
      visible,
      onCancel,
      onOk,
      form,
      confirmLoading,
      currentRowData,
    } = this.props;
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      onChange : file => {
        this.setState(state => ({
          fileList: state.fileList.slice(-1),
        }));
        return false;
      },
        fileList,
    };
    const { getFieldDecorator } = form;
    const { id, exam_name, grade_list} = currentRowData;
    const formItemLayout = {
      labelCol: {
        sm: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    const gradeList = [];
    var gradeChList = []
    var gradeNumList = grade_list.split(",")
    for (let item of gradeNumList){
      console.log(gradeMap.get(Number(item)));
      gradeChList.push(Number(item))
    }
    console.log(gradeChList);
    for (let [i,j] of gradeMap.entries()) {
      gradeList.push(<Option value={i} >{j}</Option>);
    }
    function handleChange(value) {
      console.log(`selected ${value}`);
    }
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    //alert(today.toISOString().slice(0, 10));
    return (
      <Modal
        title="上传文件"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="考试id:">
            {getFieldDecorator("exam_id", {
              //rules: [{ required: true, message: "请输入考试id!" }],
              initialValue: id,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="考试名称:">
            {getFieldDecorator("exam_name", {
              //rules: [{ required: true, message: "请输入考试名称!" }],
              initialValue: exam_name,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="上传年级:">
            {getFieldDecorator("grade_list", {
              rules: [{ required: true, message: "请选择年级!" }],
              //initialValue: gradeChList,
            })(
              <Select
              mode="tag"
              allowClear
              style={{ width: '100%' }}
              placeholder="请选择上传年级"
              // defaultValue={gradeChList}d
              onChange={handleChange}
              >
              {gradeList}
            </Select>
            )}
          </Form.Item>
          <Form.Item label="上传文件:">
            {getFieldDecorator("file", {
              rules: [{ required: true, message: "请上传文件!" }],
              //initialValue: exam_name,
            })(
            <div key={Math.random()}>
            <Upload {...props}>
              <Button>
                <Icon type="upload" /> Click to Upload
              </Button>
            </Upload>
            </div>)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "UploadScoreForm" })(UploadScoreForm);
