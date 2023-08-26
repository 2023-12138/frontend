<template>
    <div 
        class="message" 
        :class="{read:message.read}"
        v-for="(message,index) in messages" 
        :key="message.id" 
        v-show="read>=message.read" 
        @click="readMessage(index)"
    >
        <div class="messageAvatar">
            <n-icon size="30" :component="avatar" :color="color"/>
        </div>
        <div class="dividerVertical"></div>
        <div class="messageContent">
            <div class="messageTitle">
                在群聊中{{ message.tid }}提到了你
            </div>
        </div>
        <div class="selectMore">
            <!-- <div class="selectMoreIcon">
                <n-icon class="selectMoreRegular" size="30" :component="MoreHorizontal20Regular" color="#82cefd"/>
            </div> -->
            <n-button quaternary type="error" round @click.stop="deleteMessage(index)">
                删除
            </n-button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref,onMounted } from 'vue';

import { useMessage } from 'naive-ui';

import { MessageCircle } from '@vicons/tabler'
import { Document } from '@vicons/carbon';
import { BuildingHome20Filled } from '@vicons/fluent'
import { mypost } from '@/axios/axios';

let props = defineProps<{
    messages:any[],
    read:number,
    tab:string
}>();

const giveMessage = useMessage();

//图标
let color= ref('#82cefd');
let avatar = ref(MessageCircle); 

const avatarIcons = (tab:string) => {
    if(tab == 'doc'){
        color.value = '#82cefd';
        avatar.value = Document;
    }else if(tab == 'teamNotice'){
        color.value = '#82cefd';
        avatar.value = BuildingHome20Filled;
    }
}

//读消息
const readMessage = (index:number) => {
    props.messages[index].read=true
}

onMounted(() => {
    avatarIcons(props.tab); 
})

//删除单个消息控件

const deleteMessage = async (index:number) => {
    const res = await mypost(giveMessage,'/notice/onedelete',{nid:props.messages[index].noticeId})
    if(!res){
        return;
    }
    props.messages.splice(index,1);
}

</script>

<style scoped>

.message {
    height: 4.5rem;
    width: 100%;
    /* border: 1px black solid; */
    border-radius: 7px;
    display: flex;
    /* justify-content: flex-end; */
    align-items: center;
}

.read {
    opacity: 0.45;
}

.message:not(:first-child){
    margin-top: 5px;
}

.message:hover {
    cursor: pointer;
    background-color: #eee;
}

.messageAvatar{
    margin-left: 10px;
    font-size: 0;
}

.dividerVertical {
    height: 90%;
    width: 1px;
    background-color: var(--primary-color);
    margin: 0 8px;
}

.messageContent {
    height: 100%;
    width: 66%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}

.messageTitle {
    font-size: 16px;
    font-weight: 666;
}

.selectMore {
    width: 20%;
    height: 50%;
    /* background-color: red; */
    border-radius: 7px;
}

.selectMoreIcon {
    width: 30px;
    height: 30px;
    font-size: 0;
    border-radius: 50%;
}

.selectMoreIcon:hover {
    background-color: red;
}
</style>
