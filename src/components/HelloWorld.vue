<template>
    <n-upload abstract :custom-request="customRequest" :default-file-list="fileList" ref="up">
        <n-upload-trigger #="{ handleClick }" abstract>
            <n-button @click="handleClick">
                上传
            </n-button>
        </n-upload-trigger>
        <n-card style="margin-top: 12px" title="文件列表">
      <n-upload-file-list />
    </n-card>
    </n-upload>
    <!-- <iframe name="embed_readwrite"
        src="/pad/p/123?showControls=true&showChat=true&showLineNumbers=true&useMonospaceFont=false" width="100%"
        height="600" frameborder="0"></iframe> -->
</template>

<script setup lang='ts'>
import { UploadCustomRequestOptions,UploadFileInfo } from 'naive-ui';
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios';
import { useMessengerStore } from '@/store/messengerStore';

const lists = reactive([
    { id: 1, name: '张三' },
    { id: 2, name: '李四' },
    { id: 3, name: '王五' },
])

const fileList = ref([]);
const up = ref();

const customRequest = ({
    file
}: UploadCustomRequestOptions) => { 
    const formData = new FormData();
    formData.append('key', file.name);
    formData.append('file', file.file as File);
    axios.post('http://127.0.0.1:8000/chat/savefile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then((res) => {
        console.log(res);
        console.log(fileList);
        up.value.clear();
    }).catch((err) => console.log(err));
}
const messagerStore = useMessengerStore();
onMounted(() => {
    messagerStore.registerMessage('callMe', (str: string) => {
        return "called " + str;
    })
    let ret: string = messagerStore.callMessage('callMe', 'done');
    console.log(ret);
})

</script>

<style scoped></style>
