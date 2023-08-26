<template>
    <div class="topNav">
        <div class="topNavLeft">
            <Logo></Logo>
            <span>融创云开发</span>
        </div>
        <div class="topNavRight">
            <!-- <n-input 
                placeholder="搜索" 
                class="search" 
                size="large"
                round
                >
                    <template #prefix>
                        <n-icon :component="FlashOutline" />
                    </template>
                </n-input> -->

            <!-- 聊天 -->
            <div class="topNavRightIcon" @click="chatShowModal = true">
                <n-icon size="25" :component="MessageCircle" />
            </div>
            <n-modal v-model:show="chatShowModal" class="custom-card" preset="card" style="width: 60vw;height: 85vh;"
                title="聊天室" size="huge" :bordered="false" header-style="padding:20px" content-style="height:70%">
                <ChatForm />
            </n-modal>

            <!-- 消息通知 -->

            <MessageCenter />

            <!-- 头像 -->
            <div class="avatar">
                <n-config-provider :theme-overrides="avatarDropdownThemeOverrides">
                    <n-dropdown trigger="click" :options="avatarOptions" :show-arrow="true" size="huge"
                        @select="avatarHandleSelect" style="border-radius: 9px;width: 200px;">
                        <n-avatar round :size="40" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
                    </n-dropdown>
                </n-config-provider>
            </div>

            <!-- 创建团队Modal -->
            <n-modal v-model:show="createTeamModal" class="custom-card" preset="card" style="width: 60vw;height: 85vh;"
                title="创建团队" size="huge" :bordered="false" header-style="padding:20px" content-style="height:70%">
                <CreateTeamForm></CreateTeamForm>
            </n-modal>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, h } from 'vue';
import { NIcon, useMessage, NAvatar, NText, NConfigProvider } from 'naive-ui'

import { MessageCircle } from '@vicons/tabler'

import Logo from '@/components/Logo.vue';
import ChatForm from '@/components/ChatForm.vue'
import MessageCenter from './MessageCenter.vue';
import CreateTeamForm from '@/components/CreateTeamForm.vue'

//顶部头像下拉框功能
function renderCustomHeader() {
    return h(
        'div',
        {
            style: 'display: flex; align-items: center; padding: 8px 12px;'
        },
        [
            h(NAvatar, {
                round: true,
                style: 'margin-right: 12px;',
                src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/demo1.JPG'
            }),
            h('div', null, [
                h('div', null, [h(NText, { depth: 2 }, { default: () => '用户名' })]),
                h('div', { style: 'font-size: 12px;' }, [
                    h(
                        NText,
                        { depth: 3 },
                        { default: () => '当前所在团队' }
                    )
                ])
            ])
        ]
    )
}

const avatarOptions = [
    {
        key: 'header',
        type: 'render',
        render: renderCustomHeader
    },
    {
        key: 'header-divider',
        type: 'divider'
    },
    {
        label: '个人信息',
        key: 'self-info'
    },
    {
        label: '切换团队',
        key: 'stmt4',
        children: [
            {
                label: '个人空间',
                key: 'private'
            },
            {
                key: 'child-divider',
                type: 'divider'
            },
            {
                label: '团队1',
                key: 'team1'
            },
            {
                label: '创建团队',
                key: 'create-team'
            },
        ]
    },
    {
        key: 'bottom-divider',
        type: 'divider'
    },
    {
        label: '退出登录',
        key: 'logout'
    },
]

const message = useMessage()

function avatarHandleSelect(key: string | number) {
    message.info(String(key))
    if (key === 'create-team') {
        createTeamModal.value = true 
    }
}

const avatarDropdownThemeOverrides = {
    "Dropdown": {
        "borderRadius": "9px"
    }
}

//聊天

let chatShowModal = ref(false)
let createTeamModal = ref(false)

</script>

<style scoped>
/* 顶部导航 */
.topNav {
    /* width: 100%; */
    height: 100px;
    background-color: #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;

    ::v-deep(.n-input-wrapper) {
        width: 500px;
    }
}

.topNavLeft {
    /* background-color: red; */
    width: 15%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.topNavLeft span {
    margin-left: 15px;
    letter-spacing: 3px;
    font-family: '宋体', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-weight: bolder;
    font-size: 20px;
}

.topNavRight {
    width: 85%;
    height: 100%;
    /* background-color: blue; */
    display: flex;
    justify-content: end;
    align-items: center;
}

.topNavRightIcon {
    height: 40px;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
}

.search {
    margin-left: 3%;
    width: 50%;
}

.avatar {
    margin-right: 1.5%;
}
</style>
