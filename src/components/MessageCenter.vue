<template>
    <n-popover :overlap="overlap" placement="bottom-end" trigger="click" style="border-radius: 6px;">
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
            >
                <n-tab-pane name="chat" tab="群&nbsp;聊">
                    <div class="messagePane">
                        <MessageItems v-model:messages="chatMessages" :read="readValue"/>
                    </div>
                </n-tab-pane>
                <n-tab-pane name="doc" tab="文&nbsp;档">
                    <div class="messagePane">
                        
                    </div>
                </n-tab-pane>
                <n-tab-pane name="notice" tab="通&nbsp;知">
                    <div class="messagePane">
                        
                    </div>
                </n-tab-pane>
            </n-tabs>
        </div>
    </n-popover>
</template>

<script setup lang='ts'>
import { ref, Ref } from 'vue';

import { BellRegular } from '@vicons/fa'

import MessageItems from '@/components/MessageItems.vue'

// type ChatMessages = {

//     avatar:string,

// }

//顶部消息通知功能
//聊天消息数据
let chatMessages = ref([
    {
        avatar:'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
        id:'消息id1',
        from:'谁',
        teamChat:false,
        read:0,
        text:'消息是啥'
    },
    {
        avatar:'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
        id:'消息id2',
        from:'谁2',
        teamChat:true,
        read:0,
        text:'消息是啥嘞'
    },
    {
        avatar:'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
        id:'消息id2',
        from:'谁2',
        teamChat:true,
        read:1,
        text:'这个消息已读'
    }
])

//文档消息数据

//团队通知数据

//已读未读选择
let readValue = ref(0)
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

//读消息

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
    height: 500px;
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
}

</style>
