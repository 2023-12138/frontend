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
    <n-button>确定</n-button>
    <img :src="imgres" width="200" height="200">
</template>

<script setup lang='ts'>
import { UploadCustomRequestOptions } from 'naive-ui';
import { onMounted, ref, nextTick } from 'vue';
import 'vue-cropper/dist/index.css';
import intro from "@/intro/introConfig";

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

onMounted(() => {
    nextTick(() => {
        intro.setOptions({
            steps: [
              {
                element: document.querySelector('#step1') as HTMLElement, // 定位到相应的元素位置，如果不设置element，则默认展示在屏幕中央
                title: 'Welcome', // 标题
                intro: 'Hello World! 👋' // 内容
              },
              {
                element: document.querySelector('#step2') as HTMLElement,
                intro: '有关如何配置/自定义该项目的指南和方法，请查看vue-cli文档。'
              },
              {
                element: document.querySelector('#step3') as HTMLElement,
                intro: '已安装的cli插件'
              },
              {
                title: "开始体验吧！",
                intro: `<img src="interesting.GIF" alt="" style="width: 100%;margin: auto" class="specialImg"/>`
              },
            ]
      });
      nextTick(() => {
        intro.start();
      })
    })
})
</script>

<style scoped></style>
