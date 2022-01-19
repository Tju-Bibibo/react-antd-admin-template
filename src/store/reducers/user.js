import * as types from "../action-types";
import { getToken } from "@/utils/auth";
const initUserInfo = {
  user_id: "",
  user_type: "",
  user_name:"",
  avatar:"",
  token: getToken(),
};
console.log(initUserInfo);
export default function user(state = initUserInfo, action) {
  switch (action.type) {
    case types.USER_SET_USER_TOKEN:
      return {
        ...state,
        token: action.token
      };
    case types.USER_SET_USER_INFO:
      return {
        ...state,
        user_name: action.user_name,
        user_type: action.user_type,
        user_id: action.user_id,
        avatar: action.avatar,
      };
    case types.USER_RESET_USER:
      return {};
    default:
      return state;
  }
}
