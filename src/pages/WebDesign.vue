<template>
    <div class="parent-container">
        <iframe ref="myIframe" :src="target" frameborder="10"></iframe>
    </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router';

const route = useRoute()
const preUrl = "http://127.0.0.1:8080"
const target = ref( preUrl + "/#/" + route.params.did + '/' + localStorage.getItem('token'))

watch(() => route.params.pid, () => {
    target.value = preUrl + "/#/" + route.params.did + '/' + localStorage.getItem('token')
})

watch(() => route.params.did, () => {
    target.value = preUrl + "/#/" + route.params.did + '/' + localStorage.getItem('token')
})

onMounted(() => {
    // 在组件加载完成后，获取 iframe 元素并进行操作
    target.value = preUrl + "/#/" + route.params.did + '/' + localStorage.getItem('token')
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