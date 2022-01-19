import axios from "axios";
import store from "@/store";
import { Modal,Message  } from "antd";
import { getToken ,removeToken} from "@/utils/auth";
import { logout } from "@/store/actions";
//创建一个axios示例
axios.defaults.withCredentials = true;
const service = axios.create({
  baseURL: "http://127.0.0.1:8080", // api 的 base_url
  timeout: 5000, // request timeout
  //headers: {'X-Requested-With': 'XMLHttpRequest'},
  withCredentials:true,
  //headers:{'Authorization':'1'},
});
// 请求拦截器
service.interceptors.request.use(
  (config) => {
    //Do something before request is sent
    console.log(store.getState().user.token);
    config.withCredentials=true;
    if (store.getState().user.token) {
      // 让每个请求携带token-- ['Authorization']为自定义key 请根据实际情况自行修改
      // console.log("???");
      // console.log(store.getState().user.token);
      config.headers.Authorization=getToken();
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
  (response) =>{
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  const res = response.data;
  if(res.code === 0)
  {
    return response;
  }else if(res.code === 1003){
    // 10000假设是未登录状态码        
    Message.warning(res.message);
    // 也可使用router进行跳转        
    removeToken();
    window.location.href = '/#/login';
    return response;
  }else{
    // 错误显示可在service中控制，因为某些场景我们不想要展示错误        
    Message.error(res.message);
    return response;
  }
  },()=>{
    Message.error('网络请求异常，请稍后重试!');
},
(error)=>{
  return Promise.reject(error);
});

export default service;
