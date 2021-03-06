import axios from "axios";
import '../mock'
//获取停车场编码
const config = {
    timeout: 5000
}
const API = {
    get: (url,params) => {
        return new Promise((resolve, reject) => {
            axios.get(url,{params}).then(res => {  
                resolve(res.data)

            }).catch(e => {
                reject(e)
            })
        })
    },
    post: (url, params) => {
        return new Promise((resolve, reject) => {    
            axios.post(url, params, config).then(({ data }) => {
                if (!data) return
                resolve(data)
            }).catch(e => {
                reject(e)
            })
        })
    }
}

//获取抓拍机编码
export default API
