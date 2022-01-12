import React, { Component } from "react";
import { Form, Input, DatePicker, Select, Rate, Modal,Radio } from "antd";
import moment from "moment";
import "moment/locale/zh-cn";
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
class NewExamForm extends Component {
  render() {
    const {
      visible,
      onCancel,
      onOk,
      form,
      confirmLoading,
      currentRowData,
    } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    const gradeList = [];
    //var gradeChList = []
    // var gradeNumList = grade_list.split(",")
    // for (let item of gradeNumList){
    //   console.log(gradeMap.get(Number(item)));
    //   gradeChList.push(Number(item))
    // }
    // console.log(gradeChList);
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
        title="编辑"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          {/* <Form.Item label="序号:">
            {getFieldDecorator("id", {
              initialValue: id,
            })(<Input disabled />)}
          </Form.Item> */}
          <Form.Item label="考试名称:">
            {getFieldDecorator("exam_name", {
              rules: [{ required: true, message: "请输入考试名称!" }],
              //initialValue: exam_name,
            })(<Input placeholder="考试名称" />)}
          </Form.Item>
          <Form.Item label="考试日期:">
            {getFieldDecorator("exam_date", {
              rules: [{ type: 'object', required: true, message: '请选择考试日期!' }],
              initialValue: moment(today),
            })(<DatePicker showTime format="YYYY-MM-DD" />)}
          </Form.Item>
          <Form.Item label="考试说明:">
            {getFieldDecorator("exam_desc", {
              rules: [{ required: true, message: "请输入考试说明!" }],
              //initialValue: "",
            })(<Input placeholder="考试说明" />)}
          </Form.Item>
          <Form.Item label="是否展示排名:">
            {getFieldDecorator("is_show_rank", {
              initialValue: 0,
            })(            
              <Radio.Group>
              <Radio value={0}>否</Radio>
              <Radio value={1}>是</Radio>
            </Radio.Group>)}
          </Form.Item>
          <Form.Item label="是否展示说明:">
            {getFieldDecorator("is_show_desc", {
              initialValue: 0,
            })(            
              <Radio.Group >
              <Radio value={0}>否</Radio>
              <Radio value={1}>是</Radio>
            </Radio.Group>)}
          </Form.Item>
          <Form.Item label="年级列表:">
            {getFieldDecorator("grade_list", {
              //initialValue: gradeChList,
            })(
              <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="请选择年级列表"
              // defaultValue={gradeChList}d
              onChange={handleChange}
              >
              {gradeList}
            </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "NewExamForm" })(NewExamForm);
