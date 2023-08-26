import axios from 'axios'
import { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'

let header = localStorage.getItem('token')

let request = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    headers: {
        'Authorization': header
    },
    timeout: 5000
})

export async function mypost(message: MessageApiInjection, url: string, props: any) {
    const res = await request.post(url, props);
    if (res.status === 200) {
        if (res.data.code === 200) {
            return res.data.data;
        } else {
            let code = res.data.code
            if(code === 400){
                message.warning(res.data.message)
            }
            return false;
        }
    } else {
        message.error("网络错误！");
        return false;
    }
}

export default request