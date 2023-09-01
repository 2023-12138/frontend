import axios from 'axios'
import { useAxiosStore } from '@/store/axiosStore';
import { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
const axiosStore = useAxiosStore();
let header = localStorage.getItem('token')

let request = axiosStore.axiosInstance

export async function mypost(message: MessageApiInjection, url: string, props: any) {
    try {

        const res = await request.post(url, props);
        if (res.status === 200) {
            if (res.data.code === 200) {
                return res.data.data;
            } else {
                let code = res.data.code
                if (code === 400) {
                    message.warning(res.data.message)
                }
                return false;
            }
        } else {
            message.error("网络错误！");
            return false;
        }
    }
    catch {
        console.log('请求错误：' + url);
        console.log(props);
    }
}

export default request