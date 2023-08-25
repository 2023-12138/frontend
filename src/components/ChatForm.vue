<template>
    <div style="display: flex;background-color: antiquewhite; height: 100%;">
        <n-space vertical>
            <n-tabs type="line" animated placement="left" style="height: 100%;">
                <n-tab-pane name="oasis" tab="消息">
                    <div style="width: 150px;" />
                </n-tab-pane>
                <n-tab-pane name="the beatles" tab="联系人">
                    <div style="width: 150px;" />
                </n-tab-pane>
            </n-tabs>
        </n-space>
        <div style="width: 100%;height: 100%; background-color: blue;display: flex;flex-flow: column;">
            <div style="height: 70px; background-color: #ccc;display: flex;">
                <n-h3 style=" width: fit-content;margin: 20px;">User</n-h3>
            </div>
            <div style="background-color: blue;height:calc(100% - 70px); width: 100%;">
                <n-layout style="background-color: beige; height:100%;">
                    <n-layout-content style="height: calc(100% - 70px);" content-style="padding: 24px;">
                        <n-card v-for="_ in msgList" title="卡片">
                            卡片内容
                        </n-card>
                    </n-layout-content>
                    <n-layout-footer style="height:70px;">
                        <div style="display: flex; line-height: 70px; background-color: #ccc;width: 100%; height: 70px;">
                            <n-button strong secondary circle type="primary" class="msg_tool_button">
                                <template #icon>
                                    <n-icon>
                                        <ImageOutline />
                                    </n-icon>
                                </template>
                            </n-button>
                            <n-button strong secondary circle type="primary" class="msg_tool_button">
                                <template #icon>
                                    <n-icon>
                                        <ImageOutline />
                                    </n-icon>
                                </template>
                            </n-button>
                            <n-form @submit="onMsgboxSubmitted" style="width: 100%;">
                                <n-input default-value="" placeholder="Message" show-count clearable
                                    style="font-size: 20px; margin-left: 20px; text-align: left; width: calc(100% - 30px)" />
                            </n-form>
                        </div>
                    </n-layout-footer>
                </n-layout>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ImageOutline } from '@vicons/ionicons5'

const userList = ref([{ userName: 'Freeman', id: 0 }]);
const recentChatList = ref([{ userName: 'Freeman', id: 0 }]);
const msgList = ref([{
    userName: 'Freeman',
    msg: 'Hello'
}, {
    userName: 'Freeman',
    msg: 'Hello'
}, {
    userName: 'Freeman',
    msg: 'Hello'
}, {
    userName: 'Freeman',
    msg: 'Hello'
}]);

function onMsgboxSubmitted(e: SubmitEvent) {
    e.preventDefault();
    alert("clicked");
}
</script>
<style scoped>
.msg_tool_button {
    height: 40px;
    width: 40px;
    margin-top: 13px;
    margin-left: 10px;
}

</style>