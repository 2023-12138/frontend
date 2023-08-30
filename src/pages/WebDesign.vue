<template>
    <div class="parent-container">
        <iframe ref="myIframe" src="http://127.0.0.1:8080" frameborder="0"></iframe>
    </div>
</template>
  
<script setup lang="ts">
import { useMessage } from 'naive-ui';
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router';

const msg = useMessage()


const route = useRoute()
const isChildMounted = ref(false)
window.addEventListener('message', (event) => {
    // if (event.origin !== 'http://127.0.0.1:5173') {
    //     return // 避免来自未知源的消息
    // }
    const receivedMessage = event.data // 接收消息内容
    msg.info(receivedMessage)
    isChildMounted.value = true
})

watch(isChildMounted, () => {
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(route.params.did, '*');
    }
});

watch(() => route.params.did, () => {
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(route.params.did, '*');
    }
})

onMounted(() => {
    // 在组件加载完成后，获取 iframe 元素并进行操作
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(route.params.did, '*');
    }
})

</script>

<style>
.parent-container {
    position: relative;
    width: 100%;
    /* 或其他适当的宽度 */
    height: 0;
    padding-bottom: 56.25%;
    /* 16:9 宽高比的占比，可以根据需要进行调整 */
    overflow: hidden;
}

.parent-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    /* 去掉边框 */
}
</style>