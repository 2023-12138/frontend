<template>
    <div class="container">
        <div class="parent-container">
            <iframe ref="myIframe" :src="target" frameborder="0"></iframe>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router';

const route = useRoute()
const padname = route.params.padid.toString().split('$')[1]
const groupid = route.params.padid.toString().split('$')[0]
const preUrl = "http://101.43.224.85/p/auth_session?sessionID="
const target = ref(preUrl  + route.params.sessionid + '&padName=' + padname + '&groupID=' + groupid)

onMounted(() => {
    document.cookie = `sessionID=${route.params.sessionid}`
    // 在组件加载完成后，获取 iframe 元素并进行操作
    target.value = (preUrl  + route.params.sessionid + '&padName=' + padname + '&groupID=' + groupid)
})

</script>

<style>
.container {
    display: flex;
    flex-direction: row;
    height: 100vh;
    width: 100%;
}

.parent-container {
    width: 100%;
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