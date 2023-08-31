<template>
    <div style="width: 400px; height: 400px;">
        <vueCropper ref="cropper" :img="imgbase" centerBox="true" autoCrop="true" outputSize="1" outputType="png"
            fixedNumber="1" fixedBox="true" autoCropWidth="200" autoCropHeight="200" limitMinSize="50">
        </vueCropper>
    </div>
    <n-upload ref="avatarUpload" abstract :custom-request="customRequest" :default-file-list="fileList">
        <n-upload-trigger #="{ handleClick }" abstract>
            <n-button @click="handleClick">
                上传
            </n-button>
        </n-upload-trigger>
    </n-upload>
    <n-button @click="confirm">确定</n-button>
    <img :src="imgres" width="200" height="200">
</template>

<script setup lang='ts'>
import { UploadCustomRequestOptions } from 'naive-ui';
import { onMounted, reactive, ref, watch } from 'vue';
import axios from 'axios';
import { useMessengerStore } from '@/store/messengerStore';
import 'vue-cropper/dist/index.css';
import { VueCropper } from 'vue-cropper';

const imgbase = ref('');
const imgres = ref('');
const fileList = ref([]);
const avatarUpload = ref();
const cropper = ref();
const customRequest = ({
    file
}: UploadCustomRequestOptions) => {
    const reader = new FileReader()
    reader.readAsDataURL(file.file as File);
    reader.onload = function () {
        imgbase.value = reader.result as string;
    }
    avatarUpload.value.clear();
}

const confirm = () => {
    cropper.value.getCropData(data => {
        console.log(data);
        
        imgres.value = data
    })
}
</script>

<style scoped></style>
