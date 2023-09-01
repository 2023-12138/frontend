<template>
    <div class="container">
        <div class="left">
            <n-menu :options="menuOptions" @update:value="handleUpdateValue" />
        </div>
        <div class="parent-container">
            <iframe ref="myIframe" :src="target" frameborder="0"></iframe>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router';

const route = useRoute()
const preUrl = "http://127.0.0.1:8080"
const target = ref(preUrl + "/#/" + route.params.did + '/' + route.params.token + '/false')

watch(() => route.params.pid, () => {
    target.value = preUrl + "/#/" + route.params.did + '/' + route.params.token + '/false'
    getProto()
})

watch(() => route.params.did, () => {
    target.value = preUrl + "/#/" + route.params.did + '/' + route.params.token + '/false'
    console.log(target.value)
})

const getProto = () => {
    axios.post('project/getProto',{
        pid : route.params.pid
    }).then(res => {
        if (res.data.code === 200) {
            if (res.data.data.protolist) {
                menuOptions.value = res.data.data.protolist.map((item: any) => {
                    return {    
                        label: item.protoname,
                        key: item.protoid
                    }
                })
            }
        } else {
            message.warning(res.data.code)
        }
    })
}

onMounted(() => {
    // 在组件加载完成后，获取 iframe 元素并进行操作
    target.value = preUrl + "/#/" + route.params.did + '/' + route.params.token + '/false'
    getProto()
})

import { useMessage } from 'naive-ui'
import axios from '@/axios/axios';
import router from '@/routes';

const message = useMessage()
function handleUpdateValue(key: string) {
    router.push('/team/' + route.params.tid + '/project/' + route.params.pid + '/protopreview/' + key
                + '/' + route.params.token + '/key')
}
const menuOptions = ref([])

</script>

<style>
.container {
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
}

.left {
    width: 15%;
    height: 100%;
}

.parent-container {
    width: 85%;
    height: 100%;
    /* 或其他适当的宽度 */
}

.parent-container iframe {
    width: 100%;
    height: 100%;
    border: none;
    /* 去掉边框 */
}
</style>