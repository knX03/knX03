import axios from "axios";
import {store} from "xijs";
import router from "@/router";
export const baseURL = "http://localhost:80";
const Service = axios.create({
    //axios 配置 ： baseURL timeout
    baseURL,
    //timeout: 5000, //5S超时
    withCredentials: true // 允许携带cookie
});
//请求拦截
//store:js工具库所封装的localStorage（可实现过期时间）
let token = store.get('access_token').value

let singerToken = store.get('access_singer_token').value

Service.interceptors.request.use(
    config => {
        if (token) {
            config.headers["authorization"] = token;
        }
        if (singerToken) {
            config.headers["authorization-singer"] = singerToken;
        }
        return config
    }, error => {
        Modal.confirm({
            title: '提示',
            content: '请求超时!',
        });
        return Promise.reject(error)
    }
);


export default Service;
