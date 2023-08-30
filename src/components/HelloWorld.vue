<template>
    <n-upload abstract :custom-request="customRequest" :default-file-list="fileList">
        <n-upload-trigger #="{ handleClick }" abstract>
            <n-button @click="handleClick">
                上传
            </n-button>
        </n-upload-trigger>
        <n-h3>fuck</n-h3>
    </n-upload>
    <iframe name="embed_readwrite"
        src="/pad/p/123?showControls=true&showChat=true&showLineNumbers=true&useMonospaceFont=false" width="100%"
        height="600" frameborder="0"></iframe>

    <n-modal>
        
    </n-modal>
</template>

<script setup lang='ts'>
import { UploadCustomRequestOptions } from 'naive-ui';
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios';
import { useMessengerStore } from '@/store/messengerStore';

const lists = reactive([
    { id: 1, name: '张三' },
    { id: 2, name: '李四' },
    { id: 3, name: '王五' },
])

const fileList = ref([]);

const customRequest = ({
    file
}: UploadCustomRequestOptions) => {
    const formData = new FormData();
    formData.append('key', file.name);
    formData.append('file', file.file as File);
    axios.post('http://101.43.202.84:7002/chat/savefile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then((res) => {
        console.log(res);
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
