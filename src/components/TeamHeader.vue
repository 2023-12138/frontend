<template>
    <div class="topNav">
        <div class="topNavLeft">
            <Logo></Logo>
            <span>融创云开发</span>
        </div>
        <div class="topNavRight">
            <!-- 聊天 -->
            <div class="topNavRightIcon" @click="chatShowModal = true">
                <n-icon size="25" :component="MessageCircle" />
            </div>
            <n-modal v-model:show="chatShowModal" class="custom-card" preset="card" style="width: 60vw;height: 85vh;"
                title="聊天室" size="huge" :bordered="false" header-style="padding:20px"
                content-style="height:70%;padding : 10px">
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
            <n-modal v-model:show="createTeamModal" class="custom-card" preset="card" style="width: 60vw;height: 50vh;"
                title="创建团队" size="huge" :bordered="false" header-style="padding:20px" content-style="height:70%">
                <CreateTeamForm v-model:avatarOptions="avatarOptions" @updateModalStatus="updateModalStatus">
                </CreateTeamForm>
            </n-modal>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, h, onMounted } from 'vue';

import { useChatContainer } from '@/store/store'
import { NIcon, NButton, NAvatar, NText, NConfigProvider, useMessage, useNotification } from 'naive-ui'
import { storeToRefs } from 'pinia'; 
import { useTeamStore } from '@/store/teamStore'
import { MessageCircle } from '@vicons/tabler'

import Logo from '@/components/Logo.vue';
import ChatForm from '@/components/ChatForm.vue'
import MessageCenter from './MessageCenter.vue';
import CreateTeamForm from '@/components/CreateTeamForm.vue'
import router from '@/routes';
import axios from '@/axios/axios';

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

const teamStore = useTeamStore();
const teamstore = storeToRefs(teamStore);

onMounted(() => {
    axios.post('team/viewTeam', {
    }).then(res => {
        console.log(res)
        if (res.status === 200) {
            if (res.data.code === 200) {
                const privateTid = res.data.data.privateTid
                avatarOptions.value[3].children![0] = {
                    label: '个人空间',
                    key: 'team.private' + privateTid
                }
                const teamlist = res.data.data.teamlist.filter((item: any) => item.tid !== privateTid)
                teamlist.forEach((item: any, index: number) => {
                    avatarOptions.value[3].children![index + 2] = {
                        label: item.teamname,
                        key: 'team.' + item.tid
                    }
                })
                avatarOptions.value[3].children!.push({
                    label: '创建团队',
                    key: 'create-team'
                })
            } else {
                message.warning(res.data.message)
            }
        } else {
            message.error('服务器错误')
        }
    })
})

const avatarOptions = ref([
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
        key: 'switch-team',
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
])

const message = useMessage()

function avatarHandleSelect(key: string) {
    // message.info(key)
    if (key === 'create-team') {
        createTeamModal.value = true
    } else if (key === 'logout') {
        localStorage.removeItem('token')
        router.push("/")
    } else {
        const tid = key!.split('.')[1]
        message.info("切换团队" + tid)
        router.push("/team/" + tid + "/projectmanage")
        teamstore.curTeam.value = tid
        teamstore.teamChanged.value = !(teamstore.teamChanged.value)
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
const updateModalStatus = (status: boolean) => {
    createTeamModal.value = status;
};

//新通知实时提示
const notification = useNotification();
const newMessage = (teamId: number, teamName: string) => {
    const n = notification.create({
        title: `你在${teamName}团队群聊被@了`,
        avatar: () =>
            h(NAvatar, {
                size: 'small',
                round: true,
                src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'
            }),
        meta: ' ',
        action: () =>
            h(
                NButton,
                {
                    text: true,
                    type: 'primary',
                    onClick: () => {
                        n.destroy()
                    }
                },
                {
                    default: () => '去查看'
                }
            ),
    })
}

const chatContainer = useChatContainer();
chatContainer.onNewAT = newMessage;
</script>

<style scoped>
/* 顶部导航 */
.topNav {
    /* width: 100%; */
    height: 70px;
    background-image: linear-gradient(100deg, rgb(190, 218, 255), rgb(0, 195, 255) 2000px);
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
