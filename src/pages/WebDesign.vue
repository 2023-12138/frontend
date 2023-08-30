<template>
    <div class="parent-container">
        <iframe ref="myIframe" :src="target" frameborder="10"></iframe>
    </div>
</template>
  
<script setup lang="ts">
import { useMessage } from 'naive-ui';
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router';

const msg = useMessage()
const route = useRoute()
const preUrl = "http://101.43.224.85"
const target = ref( preUrl + "/#/" + route.params.did)

watch(() => route.params.pid, () => {
    target.value = preUrl + "/#/" + route.params.did
})

watch(() => route.params.did, () => {
    target.value = preUrl + "/#/" + route.params.did
})

onMounted(() => {
    // 在组件加载完成后，获取 iframe 元素并进行操作
    target.value = preUrl + "/#/" + route.params.did
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