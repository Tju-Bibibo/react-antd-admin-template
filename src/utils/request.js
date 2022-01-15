import axios from "axios";
import store from "@/store";
import { Modal } from "antd";
import { getToken } from "@/utils/auth";
import { logout } from "@/store/actions";
//创建一个axios示例
const service = axios.create({
  baseURL: "http://127.0.0.1:8080", // api 的 base_url
  timeout: 5000, // request timeout
  withCredentials:true,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    // console.log(store.getState().user.token);
    if (store.getState().user.token) {
      // 让每个请求携带token-- ['Authorization']为自定义key 请根据实际情况自行修改
      console.log("???");
      console.log(store.getState().user.token);
      config.headers = {'Cookie':getToken()};
      return config;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    // const res = response.data
    // if (res.code && res.code !== 0) {
    //   // Modal.confirm({
    //   //   title: "确定登出?",
    //   //   content:
    //   //     "由于长时间未操作，您已被登出，可以取消继续留在该页面，或者重新登录",
    //   //   okText: "重新登录",
    //   //   cancelText: "取消",
    //   //   onOk() {
    //   //     let token = store.getState().user.token;
    //   //     store.dispatch(logout(token));
    //   //   },
    //   //   onCancel() {
    //   //     console.log("Cancel");
    //   //   },
    //   // });
    //   // window.location.reload();
    // } else {
    //   return response.data
    // }
    return response;
  },
  (error) => {
    console.log("err" + error); // for debug
    const { status } = error.response;
    if (status === 403) {
      Modal.confirm({
        title: "确定登出?",
        content:
          "由于长时间未操作，您已被登出，可以取消继续留在该页面，或者重新登录",
        okText: "重新登录",
        cancelText: "取消",
        onOk() {
          let token = store.getState().user.token;
          store.dispatch(logout(token));
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    }
    return Promise.reject(error);
  }
);

export default service;
