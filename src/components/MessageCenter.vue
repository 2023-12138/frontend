<template>
    <n-popover :overlap="overlap" placement="bottom" trigger="click" style="border-radius: 6px;">
        <template #trigger>
            <div class="bellIcon">
                <n-icon size="25" :component="BellRegular" />
            </div>
        </template>
        <div class="content">
            <div class="readSelect">
                <n-select v-model:value="readValue" size="tiny" :options="readOptions"/>
            </div>
            <n-tabs 
                :bar-width="100"
                type="line" 
                :tab-style="tabStyle"
                pane-class="paneStyle"
                pane-wrapper-class="paneContainer"
                tabs-padding="20"
                animated
                :value="currentTab"
            >
                <n-tab-pane name="chat" tab="群&nbsp;聊" :tab-props="TabProp('chat')">
                    <div class="messagePane">
                        <n-scrollbar style="max-height: 330px">
                            <MessageItems v-model:messages="chatMessages" :read="readValue" tab="chat"/>
                        </n-scrollbar>
                    </div>
                </n-tab-pane>
                <n-tab-pane name="doc" tab="文&nbsp;档" :tab-props="TabProp('doc')">
                    <div class="messagePane">
                        <n-scrollbar style="max-height: 330px">
                            <MessageItems v-model:messages="docMessages" :read="readValue" tab="doc"/>
                        </n-scrollbar>
                    </div>
                </n-tab-pane>
                <!-- <n-tab-pane name="teamNotice" tab="通&nbsp;知" @click="switchTab('teamNotice')">
                    <div class="messagePane">
                        <MessageItems v-model:messages="teamNoticeMessages" :read="readValue" tab="teamNotice"/>
                    </div>
                </n-tab-pane> -->
            </n-tabs>
        </div>
        <div class="divider"></div>
        <div class="footer">
            <n-button quaternary :disabled="isAllRead" round type="info" @click="readAll">
                <template #icon>
                    <n-icon><click-icon /></n-icon>
                </template>
                全部标记为已读
            </n-button>
            <n-button quaternary type="error" round @click="deleteAll">
                删除全部
            </n-button>
        </div>
    </n-popover>
</template>

<script setup lang='ts'>
import { ref, Ref,onMounted } from 'vue';
import { mypost } from '@/axios/axios';
import { useMessage } from 'naive-ui';

import { BellRegular } from '@vicons/fa';
import { AdsClickRound as ClickIcon } from '@vicons/material';

import MessageItems from '@/components/MessageItems.vue';

type ChatMessages = {
    noticeId: number,
    uid: number,
    rid: number,
    tid: number,
    docId: number | null,
    type: string,
    read: number,
    is_active: boolean
}[]

type DocMessages = {
    noticeId: number,
    uid: number,
    rid: number,
    tid: number,
    docId: number | null,
    type: string,
    read: number,
    is_active: boolean
}[]

type Messages = ChatMessages | DocMessages;

const giveMessage = useMessage()

//顶部消息通知功能
    //tab控件
let currentTab = ref('chat')

const TabProp = (tab:string) => ({
    onClick:async () => {
        currentTab.value = tab;

        let res = await mypost(giveMessage,'/notice/getnotice',{'type':tab});
        if(!res){
            return;
        }
        console.log(res);
        let messageList = res.notice_list;
        if(tab == 'chat'){
            chatMessages.value = messageList.map((x:any) => x);
            console.log(chatMessages);
            
        }else{
            docMessages.value = messageList.map((x:any) => x);
        }
        
        let readMessages = currentTab.value === 'chat' ? chatMessages : docMessages;
        isAllRead.value = true;
        for (let message of readMessages.value) {
            if(message.read == 0){
                isAllRead.value = false;
                break;
            }
        }
    }
})

onMounted(async () => {
    let res = await mypost(giveMessage,'/notice/getnotice',{'type':'chat'});
    chatMessages.value = res.notice_list.map((x:any) => x);
    console.log(chatMessages.value);
    
})

//底部控件
    //全读消息
const isAllRead = ref(false)

const readAll = async () => {
    const res = await mypost(giveMessage,'/notice/allread',{type:currentTab.value});
    if(!res){
        return;
    }
    let readMessages = currentTab.value === 'chat' ? chatMessages : docMessages;
    for (let message of readMessages.value) {
        message.read = 1;
    }
    isAllRead.value = true;
}
    //一键删除消息
const deleteAll = async () => {
    const res = await mypost(giveMessage,'/notice/alldelete',{type:currentTab.value});
    if(!res){
        return;
    }
    let readMessages = currentTab.value === 'chat' ? chatMessages : docMessages;
    readMessages.value.splice(0);
}

//聊天消息数据
const chatMessages:Ref<Messages> = ref([]);

//文档消息数据
const docMessages:Ref<Messages> = ref([]);

//已读未读筛选框

let readValue:Ref<number> = ref(0)
const readOptions = [
    {
        label: '未读消息',
        value: 0
    },
    {
        label: '全部消息',
        value: 1
    },
]

const overlap:Ref<Boolean> = ref(false)

let tabStyle:Object = {
    height:'50px',
    fontSize:'15px',
}

</script>

<style scoped>

.bellIcon {
    height: 40px;
    width: 40px;
    display: flex;
    justify-content:center;
    align-items:center ;
    margin-right: 20px;
}

.content {
    height: 400px;
    width: 350px;
    position: relative;
}

.readSelect {
    width: 100px;
    position: absolute;
    z-index: 2000;
    right: 0;
    top: 3%;
}

.paneContainer {

}

.paneStyle {
    display: flex;
}

.messagePane {
    height: 440px;
    width: 100%;
    display: flex;
    flex-direction: column;
}

/* 底部选项 */

.divider {
    height: 1px;
    width: 100%;
    margin: 6px 0;
    background-color: var(--primary-color);
}
.footer {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
