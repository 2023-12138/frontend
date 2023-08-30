<template>
    <div style="width: 400px; height: 400px;">
        <vueCropper ref="cropper" :img="imgbase" centerBox="true" autoCrop="true" outputSize="1" outputType="png"
            fixedNumber="1" fixedBox="true" autoCropWidth="200" autoCropHeight="200" limitMinSize="50">
        </vueCropper>
    </div>
    <n-upload abstract :custom-request="customRequest" :default-file-list="fileList">
        <n-upload-trigger #="{ handleClick }" abstract>
            <n-button @click="handleClick">
                上传
            </n-button>
        </n-upload-trigger>
        <n-card style="margin-top: 12px" title="文件列表">
            <n-upload-file-list />
        </n-card>
    </n-upload>
    <img :src="imgbase" width="200" height="200">
</template>

<script setup lang='ts'>
import { UploadCustomRequestOptions } from 'naive-ui';
import { onMounted, reactive, ref, watch } from 'vue';
import axios from 'axios';
import { useMessengerStore } from '@/store/messengerStore';
import 'vue-cropper/dist/index.css';
import { VueCropper } from 'vue-cropper';

const imgbase = ref('');
const fileList = ref([]);
const customRequest = ({
    file
}: UploadCustomRequestOptions) => {
    const reader = new FileReader()
    reader.readAsDataURL(file.file as File);
    reader.onload = function () {
        imgbase.value = reader.result as string;
    }
}
const cropper = ref();
onMounted(() => {

})
</script>

<style scoped></style>
