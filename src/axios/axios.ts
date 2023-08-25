import axios from 'axios'

let header = localStorage.getItem('token')

let request = axios.create({
    baseURL:'http://127.0.0.1:8000/',
    headers:{
        'Authorization':header
    },
    timeout:5000
})

export default request