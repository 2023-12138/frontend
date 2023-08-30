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
            <n-modal v-model:show="chatShowModal" class="custom-card" preset="card" style="width: 70vw;height: 95vh;"
                title="聊天室" size="huge" :bordered="false" header-style="padding:20px"
                content-style="height:70%;padding : 0 10px 10px;">
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

import { ref, h, onMounted, Component } from 'vue';

import { RecentListModel, useChatContainer } from '@/store/store'
import { NIcon, NButton, NAvatar, NText, NConfigProvider, useMessage, useNotification } from 'naive-ui'
import { useTeamStore } from '@/store/teamStore'
import { MessageCircle } from '@vicons/tabler'

import Logo from '@/components/Logo.vue';
import ChatForm from '@/components/ChatForm.vue'
import MessageCenter from './MessageCenter.vue';
import CreateTeamForm from '@/components/CreateTeamForm.vue'
import router from '@/routes';
import { storeToRefs } from 'pinia';
import { mypost } from '@/axios/axios';
const container = useChatContainer();
const myuid = ref(parseInt(localStorage.getItem('uid') || '-1'));
const wsURL = `ws://101.43.202.84:7002/ws/chat/${myuid.value}/`;
const { webSocket, recvHandler, allTeams, recentChatList, myname, chatShowModal } = storeToRefs(container);
import axios from '@/axios/axios';
import { useMessengerStore } from '@/store/messengerStore';
const messengerStore = useMessengerStore();

const renderOption = (icon: Component) => {
    return () => h(
        'div',
        {
            style: 'display: flex; align-items: center; padding: 8px 12px;'
        },
        [
            h(NIcon, null, { default: () => h(icon) }),
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
                avatarOptions.value[3].children![0] = ({
                    label: '个人空间',
                    key: 'team.private' + privateTid + '.' + '个人空间',
                } as never)
                avatarOptions.value[3].children![1] = (({
                    label: '创建团队',
                    key: 'create-team'
                }) as never)
                avatarOptions.value[3].children![2] = (({
                    key: 'child-divider',
                    type: 'divider'
                }) as never)
                const teamlist = res.data.data.teamlist.filter((item: any) => item.tid !== privateTid)
                if (teamlist) {
                    teamlist.forEach((item: any, index: number) => {
                        avatarOptions.value[3].children![index + 3] = ({
                            label: item.teamname,
                            key: 'team.' + item.tid + '.' + item.teamname
                        } as never)
                    })
                }
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
        localStorage.removeItem('uid')
        router.push("/")
    } else if (key === 'self-info') {
        message.info('个人信息')
    } else {
        const tid = key!.split('.')[1]
        const teamname = key!.split('.')[2]
        message.info("切换至团队" + teamname)
        teamstore.curTeam.value = tid
        teamstore.curTeamName.value = teamname
        teamstore.teamChanged.value = !(teamstore.teamChanged.value)
        router.push("/team/" + tid + "/projectmanage")
    }
}

const avatarDropdownThemeOverrides = {
    "Dropdown": {
        "borderRadius": "9px"
    }
}

//聊天

let createTeamModal = ref(false)
const updateModalStatus = (status: boolean) => {
    createTeamModal.value = status;
};

//新通知实时提示
const notification = useNotification();
const newMessage = (teamId: number, teamName: string, rid: number) => {
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
                        chatShowModal.value = true;
                        setTimeout(() => {
                            if (chatContainer.onOpenMsgFromNotice != null) chatContainer.onOpenMsgFromNotice(teamId, rid);
                        }, 500);
                        n.destroy()
                    }
                },
                {
                    default: () => '去查看'
                }
            ),
    })
}
const newDocMessage = (/*teamId: number, teamName: string, rid: number*/) => {
    const n = notification.create({
        title: `你在文档中被@了`,
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
                        // chatShowModal.value = true;
                        // setTimeout(() => {
                        //     if (chatContainer.onOpenMsgFromNotice != null) chatContainer.onOpenMsgFromNotice(teamId, rid);
                        // }, 500);
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

let reconnectCount = 0;
function initWebSocket() {
    if (webSocket.value == null) return;
    webSocket.value.onmessage = async (e) => {
        let data = JSON.parse(e.data);
        let msgtype: string = data.type;
        data = data.data;
        let message: string = data.message;
        let senderId: number = data.senderId;
        let receiverId: number | string = data.receiverId;
        let teamId: number | string = data.teamId;
        let currentTime: string = data.time;
        let rid: number = parseInt(data.rid);
        let senderName: string = data.senderName;
        if (msgtype == 'doc_aite') {
            newDocMessage();
        }
        if (msgtype == "chat_aite" && senderId != myuid.value) {
            newMessage(parseInt(teamId.toString()), allTeams.value.find((ele) => ele.teamID == teamId)?.teamName || "NoF :(", rid);
        } else {
            rid = NaN;
        }
        //判断是否在recent中
        let isuser = (teamId == "");
        let recent: RecentListModel | undefined;
        if (isuser) {//私聊信息
            //首先判断是否是自己发出去的
            if (senderId == myuid.value) {//自己发送的消息自己收到
                recent = recentChatList.value.find((ele) => ele.id == receiverId && ele.isuser == isuser);
                if (recent == undefined) {
                    messengerStore.callMessage('chatform_startchat', { id: receiverId, isuser: isuser, targetUName: myname.value });
                }
                recent = recentChatList.value.find((ele) => ele.id == receiverId && ele.isuser == isuser);

            } else {//别人发的消息自己收到
                recent = recentChatList.value.find((ele) => ele.id == senderId && ele.isuser == isuser);
                if (recent == undefined) {
                    messengerStore.callMessage('chatform_startchat', { id: receiverId, isuser: isuser, targetUName: senderName });
                }
                recent = recentChatList.value.find((ele) => ele.id == senderId && ele.isuser == isuser);
            }
        }
        //群聊信息
        else { //统一处理
            recent = recentChatList.value.find((ele) => ele.id == teamId && ele.isuser == isuser);
            const team = allTeams.value.find(ele => ele.teamID == teamId);
            const name = team?.teamMembers.find(ele => ele.userID == senderId)?.userName;
            console.log(name);
            senderName = allTeams.value.find(ele => ele.teamID == teamId)?.teamMembers.find(ele1 => ele1.userID == senderId)?.userName || 'NaN :(';
            if (recent == undefined) {
                messengerStore.callMessage('chatform_startchat', { id: senderId, isuser: isuser, targerUName: team?.teamName });
                recent = recentChatList.value.find((ele) => ele.id == teamId && ele.isuser == isuser);
            }
        }
        //在recent中未发现，首先添加到消息中


        recent?.Messages.push({
            userName: senderName,
            msg: message,
            userID: senderId,
            time: currentTime,
            imgstr: null,
            rid: rid
        });

        if (recvHandler.value != null) {
            await recvHandler.value(e, recent as RecentListModel, senderName);
        }
    };
    webSocket.value.onclose = (_) => {
        if (reconnectCount > 9) {
            reconnectCount = 0;
            message.error('webSocket 重连失败(10/10)，请刷新网页！');
            return;
        }
        try {
            reconnectCount++;
            webSocket.value = new WebSocket(wsURL);
            initWebSocket();
        } catch {
            message.error('重连失败？');
        }
    }
    webSocket.value.onerror = (_) => {
        //message.error('unknown error');
    }
}
onMounted(async () => {
    if (webSocket.value == null) {
        //重新加载socket的所有事件
        try {
            webSocket.value = new WebSocket(wsURL);
            initWebSocket();
        } catch (error) {
            message.error('webSocket cannot connect to server');
        }
    }
    let res = await mypost(message, '/team/viewTeam', {});
    if (!res) {
        return;
    }
    const li: {
        teamlist: {
            tid: number;
            teamname: string;
            teaminform: string;
            is_active: boolean;
        }[]
    } = res;
    allTeams.value = [];
    for (const ateam of li.teamlist) {
        const teammembers: {
            userName: string;
            userID: number;
        }[] = [];
        let mres = await mypost(message, '/team/viewUser', { tid: ateam.tid });
        if (!mres) return;
        for (const member of mres.userlist) {
            teammembers.push({
                userName: member.username,
                userID: member.uid
            });
        }
        allTeams.value.push({
            teamName: ateam.teamname,
            teamID: ateam.tid,
            teamMembers: teammembers
        });
    }
})

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
    min-width: 200px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.topNavLeft span {
    margin-left: 15px;
    letter-spacing: 3px;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', '宋体', Arial, sans-serif;
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
