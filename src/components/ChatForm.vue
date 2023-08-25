<template>
    <div class="parentContainer">
        <n-space vertical>
            <n-tabs class="leftContainer" type="line" animated placement="left">
                <n-tab-pane name="oasis" tab="消息">
                    <div class="recentMsgContainer" />
                </n-tab-pane>
                <n-tab-pane name="the beatles" tab="联系人">
                    <div class="recentMsgContainer" />
                </n-tab-pane>
            </n-tabs>
        </n-space>
        <div class="rightChatRoomContainer">
            <div class="targetUserContainer">
                <n-h3 class="targetUser">User</n-h3>
            </div>
            <div class="rightChatContentContainer">
                <n-layout class="chatContentLayout">
                    <n-layout-content class="chatContent" content-style="padding: 24px;">
                        <n-card v-for="_ in msgList" title="卡片">
                            卡片内容
                        </n-card>
                    </n-layout-content>
                    <n-layout-footer class="chatToolFooter">
                        <div class="chatToolContainer">
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
                            <n-form @submit="onMsgboxSubmitted" class="msgBoxForm">
                                <n-input default-value="" placeholder="Message" show-count clearable class="msgBox" />
                            </n-form>
                        </div>
                    </n-layout-footer>
                </n-layout>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, } from 'vue'
import { ImageOutline } from '@vicons/ionicons5'
import { useChatContainer } from '@/store/store'
import { storeToRefs } from 'pinia';
const container = useChatContainer();
const { userList, recentChatList, msgList, webSocket } = storeToRefs(container);


onMounted(() => {
    console.log("on mounted");

})
onUnmounted(() => {
    console.log("on unmounted");

})
function onMsgboxSubmitted(e: SubmitEvent) {
    e.preventDefault();
    msgList.value.push({
        userName: 'Hello',
        msg: 'world'
    });
}

</script>
<style scoped>
.msg_tool_button {
    height: 40px;
    width: 40px;
    margin-top: 13px;
    margin-left: 10px;
}

.parentContainer {
    display: flex;
    background-color: antiquewhite;
    height: 100%;
}

.leftContainer {
    height: 100%;
}

.recentMsgContainer {
    width: 110px;
}

.rightChatRoomContainer {
    width: 100%;
    height: 100%;
    background-color: blue;
    display: flex;
    flex-flow: column;
}

.targetUserContainer {
    height: 70px;
    background-color: #ccc;
    display: flex;
}

.targetUser {
    width: fit-content;
    margin: 20px;
}

.rightChatContentContainer {
    background-color: blue;
    height: calc(100% - 70px);
    width: 100%;
}

.chatContentLayout {
    background-color: beige;
    height: 100%;
}

.chatContent {
    height: calc(100% - 70px);
}

.chatToolFooter {
    height: 70px;
}

.chatToolContainer {
    display: flex;
    line-height: 70px;
    background-color: #ccc;
    width: 100%;
    height: 70px;
}

.msgBoxForm {
    width: 100%;
}

.msgBox {
    font-size: 20px;
    margin-left: 20px;
    text-align: left;
    width: calc(100% - 30px)
}
</style>