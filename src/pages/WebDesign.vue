<template>
    <div class="container">
        <div class="header">
            <div class="headerContainer">
                <div class="headerLeft">
                    <div class="back" @click="$router.push('/team/' + $route.params.tid + '/project/' + $route.params.pid)">
                        <n-icon size="29" :component="ArrowBackSharp" />
                    </div>
                    <div class="title">
                        原型设计
                    </div>
                    <div class="export">
                        <n-button @click="exportPreview">导出预览</n-button>
                        <n-modal v-model:show="showExportModal">
                            <n-card style="width: 600px" title="生成链接" :bordered="false" size="huge" role="dialog"
                                aria-modal="true">
                                {{ link }}          
                            </n-card>
                        </n-modal>
                    </div>
                </div>
            </div>
        </div>
        <div class="parent-container">
            <iframe ref="myIframe" :src="target" frameborder="0"></iframe>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import axios from '@/axios/axios';
import { ArrowBackSharp } from '@vicons/ionicons5';
import { useMessage } from 'naive-ui';
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router';

const route = useRoute()
const preUrl = "http://127.0.0.1:8080"
const target = ref(preUrl + "/#/" + route.params.did + '/' + localStorage.getItem('token') + '/true')
const showExportModal = ref(false)
const message = useMessage()
const link = ref('')
const exportPreview = () => {
    axios.post('project/makelink', {
    }).then(res => {
        if (res.data.code === 200) {
            link.value = 'http://127.0.0.1:5173/team/' + route.params.tid + '/project/' + route.params.pid + '/protopreview/' 
            + route.params.did + '/' + res.data.data.token + '/key'
            showExportModal.value = true
        } else {
            message.warning(res.data.message)
        }
    })
}
watch(() => route.params.pid, () => {
    target.value = preUrl + "/#/" + route.params.did + '/' + localStorage.getItem('token') + '/true'
})

watch(() => route.params.did, () => {
    target.value = preUrl + "/#/" + route.params.did + '/' + localStorage.getItem('token') + '/true'
})

onMounted(() => {
    // 在组件加载完成后，获取 iframe 元素并进行操作
    target.value = preUrl + "/#/" + route.params.did + '/' + localStorage.getItem('token') + '/true'
})

</script>

<style>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.header {
    width: 100%;
    height: 50px;
    background-color: #ddd;
    display: flex;
    justify-content: center;
}

.headerContainer {
    width: 100%;
    height: 100%;
    display: flex;
}

.headerLeft {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.back {
    font-size: 0;
    margin-left: 10px;
}

.back:hover {
    cursor: pointer;
}

.title {
    font-size: 20px;
    font-weight: 666;
    margin-left: 10px;
}

.export {
    display: flex-end;
    margin-right: 10px;
}

.editTitle {
    font-size: 0;
    margin-left: 4px;
    opacity: 0.5;
}

.editTitle:hover {
    cursor: pointer;
    opacity: 1;
    transition: 0.1s opacity linear
}

.headerRight {
    height: 100%;
    width: 50%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.headerRight>* {
    margin-right: 10px;
}

.parent-container {
    width: 100%;
    height: calc(100% - 50px);
    /* 或其他适当的宽度 */
    overflow: hidden;
}

.parent-container iframe {
    width: 100%;
    height: 100%;
    border: none;
    /* 去掉边框 */
}
</style>